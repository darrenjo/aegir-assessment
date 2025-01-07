export interface JunctionStudentsInstruments {
  id: number; // ID unik pada tabel `junction_students_instruments`
  students_id: string; // ID string dari tabel `directus_users`
  instruments_id: number; // ID dari tabel `instruments`
}

export interface JunctionTeachersInstruments {
  id: number; // ID unik pada tabel `junction_teachers_instruments`
  teachers_id: string; // ID string dari tabel `directus_users`
  instruments_id: number; // ID dari tabel `instruments`
}
