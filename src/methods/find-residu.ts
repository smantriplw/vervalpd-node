import htmlParser from 'node-html-parser';
import {type MethodScraper, type StudentTypes} from '@/@typings/index.js';
import {VervalRoutes} from '@/routers.js';

export const findResiduMethod: MethodScraper<StudentTypes.Residu[], {
  search: string;
  limit?: number;
  offset?: number;
}> = async (app, _, args) => {
  const response = await app.http.get(VervalRoutes.ResiduRest, {
    searchParams: new URLSearchParams({
      search: args?.search ?? '',
      limit: args?.limit?.toString() ?? '',
      offset: args?.offset?.toString() ?? '',
      sort: '',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      sekolah_id: app.fetchedData.sekolahId.length > 0 ? app.fetchedData.sekolahId : '',
    }),
  }).json<{
    rows: Array<{
      nama: string;
      nisn: string;
      nik: string;
      peserta_didik_id: string;
      qc_1: string; // Rombel
      qc_2: string; // NISN
      qc_3: string; // NAMA
      qc_4: string; // Tanggal Lahir
      qc_5: string; // Tempat Lahir
      qc_6: string; // IBU KANDUNG
      qc_7: string; // JENIS KELAMIN
      qc_8: string; // NIK
      qc_9: string;
      qc_10: string;
      qc_11: string; // DESA/KELURAHAN
    }>;
  }>();

  const resolveQcMessage = (value: string) => htmlParser.parse(value, {
    comment: false,
    parseNoneClosedTags: false,
    lowerCaseTagName: false,
  }).querySelector('a')?.getAttribute('title')?.trim();

  return response.rows.map(row => ({
    name: row.nama,
    nik: row.nik,
    nisn: row.nisn,
    bornDateResidu: resolveQcMessage(row.qc_4),
    bornPlaceResidu: resolveQcMessage(row.qc_5),
    nameResidu: resolveQcMessage(row.qc_3),
    nikResidu: resolveQcMessage(row.qc_8),
    rombelResidu: resolveQcMessage(row.qc_1),
    genderResidu: resolveQcMessage(row.qc_7),
    motherResidu: resolveQcMessage(row.qc_6),
    id: /\?id=(.*)/i.exec(row.peserta_didik_id)?.at(1)?.split(/\s+/g).at(0)?.replace('\'', '') ?? '',
  }));
};
