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

export type VaccineRow = {
  service: string;
  date: Date;
  place: string;
  type: string;
  dosed: number;
};

export type SchoolLongitudinal = {
  semester: string;
  school: string;
  level: 'KB' | 'TPA' | 'SPS' | 'A' | 'B' | 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI' | 'VII' | 'VIII' | 'IX' | 'X' | 'XI' | 'XII' | 'XIII' | 'PT' | '-';
  lastUpdated: string;
};

export type StudentExtra = Student & {
  religion: string;
  phone: string;
  address: string;
  height: number;
  mass: number;
  siblings: number;
  akta: string;
  nipd: string;
  nationality: string;
  transportation: string;
  schoolInDate?: Date;
  hobby: string;
  wishes: string;
  homeDistance: number;
  estimatedToSchool: number;
  vaccines: VaccineRow[];
  longitudinals: SchoolLongitudinal[];
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

