import {CookieJar} from 'tough-cookie';
import got, {type OptionsInit, type Got} from 'got';
import {type VervalFetchedData, type Credentials, type VervalConfig, type StudentTypes} from './@typings/index.js';
import {loginMethod} from './methods/login.js';
import {VervalRoutes} from './routers.js';
import {findSekolahIdMethod} from './methods/find-sekolah-id.js';
import {findStudentMethod} from './methods/find-student.js';
import {findResiduMethod} from './methods/find-residu.js';
import {getProfileMethod} from './methods/get-profile.js';

export class VervalPd {
  public http!: Got;
  public fetchedData: VervalFetchedData = {
    sekolahId: '',
  };

  constructor(private readonly auth: Credentials, private readonly options: VervalConfig) {
    if (typeof auth.email !== 'string') {
      throw new SyntaxError(`${VervalPd.name}__constructor#auth.email must be a string`);
    }

    if (typeof auth.password !== 'string') {
      throw new SyntaxError(`${VervalPd.name}__constructor#auth.password must be a string!`);
    }

    this.http = got.extend({
      retry: {
        limit: 4,
      },
      prefixUrl: options.baseUrl ?? 'https://vervalpd.data.kemdikbud.go.id/',
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.102 Safari/537.36',
        origin: options.baseUrl ?? 'https://vervalpd.data.kemdikbud.go.id/',
      },
      hooks: {
        afterResponse: [
          async (response, retry) => {
            if (response.statusCode === 200 && response.headers.refresh) {
              const isLoginMatch = /clogin/gi.test(response.headers.refresh.toString());
              if (isLoginMatch) {
                if (!response.request.options.cookieJar) {
                  await this.initCookieJar();

                  // Test it again
                  const testResponse = await this.findSekolahId();
                  if (!testResponse?.length) {
                    await this.login();
                    await this.saveCookieJar();
                  }

                  return retry({
                    cookieJar: this.http.defaults.options.cookieJar,
                  });
                }

                // Refresh the cookie
                await this.login();
                await this.saveCookieJar();

                return retry({
                  cookieJar: this.http.defaults.options.cookieJar,
                });
              }
            }

            return response;
          },
        ],
      },
    });
  }

  get authConfig(): Credentials {
    return this.auth;
  }

  get config(): VervalConfig {
    return this.options;
  }

  async initCookieJar(options?: OptionsInit): Promise<void> {
    if (this.options.cookieInstance && !(options ?? this.http.defaults.options).cookieJar) {
      const cookie = await this.options.cookieInstance.load<CookieJar>();

      if (options) {
        options.cookieJar = cookie;
      } else {
        this.http = got.extend(this.http, {
          cookieJar: cookie,
        });
      }
    }
  }

  async findSekolahId(): Promise<string | undefined> {
    if (this.fetchedData.sekolahId.length > 0) {
      return this.fetchedData.sekolahId;
    }

    const response = await this.http.get(VervalRoutes.DataSiswa);

    return findSekolahIdMethod(this, response);
  }

  async findStudent(query: string, limit = 100, offset?: number): Promise<StudentTypes.Student[]> {
    return findStudentMethod(this, undefined, {search: query, limit, offset});
  }

  async listStudent(limit = 100, offset = 1): Promise<StudentTypes.Student[]> {
    return this.findStudent('', limit, offset);
  }

  async findResidu(query: string, limit = 100, offset?: number): Promise<StudentTypes.Residu[]> {
    return findResiduMethod(this, undefined, {search: query, limit, offset});
  }

  async listResidu(limit = 100, offset = 1): Promise<StudentTypes.Residu[]> {
    return this.findResidu('', limit, offset);
  }

  async getProfile(id: string): Promise<StudentTypes.StudentExtra | undefined> {
    return getProfileMethod(this, undefined, {id});
  }

  async login(): Promise<void> {
    let response = await this.http.get('./', {
      followRedirect: true,
      responseType: 'text',
    });

    if (!response.headers.refresh) {
      throw new Error('Couldn\'t retrieve refresh URL from server');
    }

    const newUrl = response.headers.refresh.toString().split(';url=')[1];
    response = await got(newUrl, {
      headers: {
        ...got.defaults.options.headers,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Cookie: response.headers['set-cookie']?.toString(),
      },
      cookieJar: this.http.defaults.options.cookieJar,
    });

    return loginMethod(this, response).then(async () => {
      await this.saveCookieJar();
    });
  }

  async saveCookieJar<Jar>(jar?: Jar): Promise<void> {
    const cookieJar = jar ?? this.http.defaults.options.cookieJar;
    if (cookieJar instanceof CookieJar) {
      await this.options.cookieInstance.store(await cookieJar.serialize());
    }
  }
}

export * from './routers.js';
export * from './@typings/index.js';
