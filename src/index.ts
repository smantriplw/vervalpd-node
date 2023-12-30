import {CookieJar} from 'tough-cookie';
import got, {type Got} from 'got';
import {type VervalFetchedData, type Credentials, type VervalConfig, type StudentTypes} from './@typings/index.js';
import {loginMethod} from './methods/login.js';
import {VervalRoutes} from './routers.js';
import {findSekolahIdMethod} from './methods/find-sekolah-id.js';
import {findStudentMethod} from './methods/find-student.js';

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
      prefixUrl: options.baseUrl ?? 'https://vervalpd.data.kemdikbud.go.id/',
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.102 Safari/537.36',
        origin: options.baseUrl ?? 'https://vervalpd.data.kemdikbud.go.id/',
      },
    });
  }

  get authConfig(): Credentials {
    return this.auth;
  }

  get config(): VervalConfig {
    return this.options;
  }

  async initCookieJar(): Promise<void> {
    if (this.options.cookieInstance && !this.http.defaults.options.cookieJar) {
      const cookie = await this.options.cookieInstance.load<CookieJar>();

      this.http = got.extend(this.http, {
        cookieJar: cookie,
      });
    }
  }

  async findSekolahId(): Promise<string | undefined> {
    await this.initCookieJar();
    const response = await this.http.get(VervalRoutes.DataSiswa);

    return findSekolahIdMethod(this, response);
  }

  async findStudent(query: string): Promise<StudentTypes.Student[]> {
    return findStudentMethod(this, undefined, {search: query});
  }

  async login(): Promise<void> {
    await this.initCookieJar();
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
