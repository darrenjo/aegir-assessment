// // export interface User {
// //   id: string; // ID dari tabel `directus_users`
// //   first_name: string;
// //   last_name: string;
// // }

// export interface StudentInstrument {
//   id: number; // ID dari tabel `junction_students_instruments`
//   students_id: string; // Relasi ke tabel `directus_users`
//   instruments_id: number; // Relasi ke tabel `instruments`
// }

// // export interface TeacherInstrument {
// //   id: number; // ID dari tabel `junction_teachers_instruments` (jika ada)
// //   teachers_id: User; // Relasi ke tabel `directus_users`
// //   instruments_id: number; // Relasi ke tabel `instruments`
// // }

// export interface Instrument {
//   id: number; // ID tabel `instruments`
//   name: string;
//   students?: StudentInstrument[]; // Relasi banyak ke banyak dengan junction table
//   // teachers?: TeacherInstrument[]; // Relasi banyak ke banyak dengan junction table
// }


//
// export interface DirectusUser {
//   id: string; // ID user dari tabel `directus_users`
//   first_name: string;
//   last_name: string;
// }

// export interface JunctionStudentsInstruments {
//   students_id: DirectusUser; // Relasi ke tabel directus_users
// }

// export interface JunctionTeachersInstruments {
//   teachers_id: DirectusUser; // Relasi ke tabel directus_users
// }

export interface Student {
  students_id: {
    id: string;
    first_name: string;
    last_name: string;
  };
}

export interface Instrument {
  id: number; // ID dari tabel instruments
  name: string; // Nama instrumen
  students?: Student[]; // Relasi many-to-many untuk students
  // students?: JunctionStudentsInstruments[]; // Relasi many-to-many untuk students
  // teachers?: JunctionTeachersInstruments[]; // Relasi many-to-many untuk teachers
}
