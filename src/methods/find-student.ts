import {type MethodScraper} from '@/@typings/index.js';
import {type Student} from '@/@typings/student.js';
import {VervalRoutes} from '@/routers.js';

export const findStudentMethod: MethodScraper<Student[], {search: string; limit?: number; offset?: number}> = async (app, _, args) => {
  let sekolahId = app.fetchedData.sekolahId;
  if (sekolahId.length === 0) {
    sekolahId = await app.findSekolahId() ?? '';
    if (sekolahId.length === 0) {
      throw new Error('Missing sekolahId');
    }
  }

  const responseStudentJson = await app.http.get(VervalRoutes.DataSiswaRest, {
    searchParams: new URLSearchParams({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      sekolah_id: sekolahId,
      search: args!.search,
      sort: '',
      order: '',
      offset: args?.offset?.toString() ?? '',
      limit: args?.limit?.toString() ?? '100',
    }),
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
    },
    throwHttpErrors: false,
  }).json<{
    rows: Array<Record<string, string>>;
  }>();

  if (!responseStudentJson.rows) {
    return [];
  }

  return responseStudentJson.rows.map(row => ({
    name: row.nama,
    gender: row.jenis_kelamin,
    born: {
      date: row.tanggal_lahir,
      place: row.tempat_lahir,
    },
    grade: row.tingkat_pendidikan,
    nik: row.nik,
    nisn: row.nisn,
    motherName: row.nama_ibu_kandung,
    id: /\?id=(.*)/i.exec(row.peserta_didik_id)?.at(1)?.split(/\s+/g).at(0)?.replace('\'', ''),
  })) as Student[];
};
