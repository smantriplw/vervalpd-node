export type Gender = 'L' | 'P';

export type Student = {
  gender: Gender;
  name: string;
  motherName: string;
  nik: string;
  nisn: string;
  born: {
    date: string;
    place: string;
  };
  grade: string;
  id: string;
};

export type StudentExtra = Student & {
  religion: string;
  phone: string;
  address: string;
  height: number;
  weight: number;
  siblings: number;
  akta: string;
  nipd: string;
  nationality: string;
  transportation: string;
};
