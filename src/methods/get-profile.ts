import htmlParser from 'node-html-parser';
import {type StudentTypes, type MethodScraper} from '@/@typings/index.js';
import {VervalRoutes} from '@/routers.js';

// eslint-disable-next-line complexity
export const getProfileMethod: MethodScraper<StudentTypes.StudentExtra | undefined, {id: string}> = async (app, _, args) => {
  const response = await app.http.get(VervalRoutes.Profil, {
    searchParams: new URLSearchParams({
      id: args!.id,
    }),
    throwHttpErrors: false,
  });

  const dom = htmlParser.parse(response.body, {
    comment: false,
  });

  if (!dom.querySelector('.row div')) {
    return undefined;
  }

  const attributs = dom.querySelectorAll('#identitas .row div .row li');
  const boxProfiles = dom.querySelectorAll('.box-profile li');

  return {
    name: dom.querySelector('.profile-username')?.text.trim() ?? '',
    nisn: dom.querySelector('.box-profile p')?.text.trim().match(/\d+/g)?.[0] ?? '',
    motherName: boxProfiles.at(-1)?.querySelector('span')?.text.trim() ?? '',
    gender: boxProfiles.at(0)?.querySelector('span')?.text.trim()[0] as StudentTypes.Gender,
    born: {
      place: boxProfiles.at(1)?.querySelector('span')?.text.trim() ?? '',
      date: boxProfiles.at(2)?.querySelector('span')?.text.trim() ?? '',
    },
    nik: attributs?.at(0)?.text.match(/\d+/g)?.[0].trim() ?? '',
    religion: attributs?.at(2)?.text.split(':')[1].trim() ?? '',
    nationality: attributs?.at(3)?.text.split(':')[1].trim() ?? '',
    transportation: attributs?.at(5)?.text.split(':')[1].trim() ?? '',
    phone: attributs?.at(8)?.text.match(/\d+/g)?.[0].trim() ?? '',
    id: args!.id,
    akta: attributs?.at(10)?.text.split(':')[1].trim() ?? '-',
    nipd: attributs?.at(12)?.text.split(':')[1].trim() ?? '-',
    height: Number.parseInt(attributs?.at(31)?.text.match(/\d+/g)?.[0].trim() ?? '0', 10),
    mass: Number.parseInt(attributs?.at(32)?.text.match(/\d+/g)?.[0].trim() ?? '0', 10),
    grade: dom.querySelectorAll('.box-profile p').at(2)?.text?.trim().split('\n')[1].split(':').at(1)?.trim() ?? '',
    address: dom.querySelector('.box-profile')?.nextElementSibling?.nextElementSibling?.text.trim().replaceAll(/(\t|\r)/g, '') ?? '',
    siblings: Number.parseInt(attributs?.at(35)?.text.split(':')[1].trim() ?? '1', 10),
    schoolInDate: new Date(attributs?.at(13)?.text.split(':')[1].trim() ?? '-'),
    homeDistance: Number.parseInt(attributs?.at(33)?.text.match(/\d+/g)?.[0].trim() ?? '0', 10),
    estimatedToSchool: Number.parseInt(attributs?.at(34)?.text.match(/\d+/g)?.[0].trim() ?? '0', 10),
    hobby: attributs.at(36)?.text.split(':').at(1)?.trim() ?? '-',
    wishes: attributs.at(-1)?.text.split(':').at(1)?.trim() ?? '-',
    vaccines: dom.querySelectorAll('#integrasi .row div .row div:last-child tbody tr').map(row => ({
      service: row.childNodes.at(1)?.text.trim() ?? '-',
      date: new Date(row.childNodes.at(3)?.text.trim() ?? '-'),
      place: row.childNodes.at(5)?.text.trim() ?? '-',
      type: row.childNodes.at(7)?.text.trim() ?? '-',
      dosed: Number.parseInt(row.childNodes.at(9)?.text.trim() ?? '-', 10),
    })),
  };
};
