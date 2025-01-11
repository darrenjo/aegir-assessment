import { Student } from './users';
import { Teacher } from './users';

export interface Instrument {
  id: number; // ID dari tabel instruments
  name: string; // Nama instrumen
  students?: Student[]; // Relasi many-to-many untuk students
  teachers?: Teacher[]; // Relasi many-to-many untuk teachers
}
