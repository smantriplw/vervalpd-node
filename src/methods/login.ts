import got from 'got';
import htmlParser from 'node-html-parser';
import {type MethodScraper} from '@/@typings/index.js';

export const loginMethod: MethodScraper<void, Record<string, unknown>> = async (app, response) => {
  let dom = htmlParser.parse(response?.body as string, {
    comment: false,
  });

  const [
    csrfQuery,
    csrfToken,
  ] = [
    dom.querySelector('[name="csrf-param"]')?.getAttribute('content'),
    dom.querySelector('[name="csrf-token"]')?.getAttribute('content'),
  ];

  // If (!csrfQuery || !csrfToken) {
  //   throw new Error('Missing csrf token');
  // }

  const postLoginUrl = dom.querySelector('.pengguna-form form')?.getAttribute('action');
  if (!postLoginUrl) {
    throw new Error('Missing postLoginUrl');
  }

  const appKey = dom.querySelector('[name="appkey"]')?.getAttribute('value');
  if (!appKey) {
    throw new Error('Missing appkey');
  }

  const payload = {
    ...csrfQuery && csrfToken ? {
      [csrfQuery]: csrfToken,
    } : {},
    // [csrfQuery]: csrfToken,

    // 'Pengguna[email]': app.authConfig.email,

    // 'Pengguna[password]': app.authConfig.password,
    email: app.authConfig.email,
    password: app.authConfig.password,
    csrf_token: csrfToken,
    appkey: appKey,
  };

  const responseLogin = await got.post(new URL(postLoginUrl, response?.requestUrl.origin), {
    form: payload,
    headers: {
      ...app.http.defaults.options.headers,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Cookie: response?.headers['set-cookie']?.toString(),
    },
    https: {
      rejectUnauthorized: false,
    },
    throwHttpErrors: false,
    cookieJar: app.http.defaults.options.cookieJar,
  });

  dom = htmlParser.parse(responseLogin.body, {
    comment: false,
  });

  const errorMessages = dom.querySelectorAll('[class="alert alert-danger"] ul li');
  if (errorMessages.length > 0) {
    throw new Error(`Login errors: ${errorMessages.map(x => x.text).join(', ')}`);
  }

  const newUrl = responseLogin.headers.refresh?.toString().split(';url=').at(1);
  if (!newUrl?.match(/vervalpd\.data\.kemdikbud\.go\.id/gi)) {
    throw new Error('Refresh URL looks different: ' + newUrl);
  }

  await app.saveCookieJar();
};

