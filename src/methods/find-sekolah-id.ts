import {type MethodScraper} from '@/@typings/index.js';

export const findSekolahIdMethod: MethodScraper<string | undefined, Record<string, unknown>> = async (app, response) => {
  const tokens = /sekolah_id=(.*)/i.exec((response?.body as string));
  const id = tokens?.at(-1)?.trim().replace('\'', '') ?? '';

  app.fetchedData.sekolahId = id;
  return id;
};
