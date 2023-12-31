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

export type ResiduRow = {
  similarity: number;
  text: string;
};

export type Residu = Pick<Student, 'nik' | 'nisn' | 'name' | 'id'> & {
  nisnResidu?: string;
  rombelResidu?: ResiduRow;
  motherResidu?: ResiduRow;
  bornDateResidu?: ResiduRow;
  bornPlaceResidu?: ResiduRow;
  nikResidu?: ResiduRow;
  nameResidu?: ResiduRow;
  genderResidu?: ResiduRow;
  villageResidu?: ResiduRow;
};

