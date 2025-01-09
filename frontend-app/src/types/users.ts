export interface Student {
  students_id: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    status: string;
    role: string;
    student_instruments: Array <{
        instruments_id: {
          id: number;
          name: string;
        };
    }>;
  };
}

export interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    status: string;
    student_instruments: Array <{
      instruments_id: {
        id: number;
        name: string;
      };
  }>;
}

export interface Teacher {
  teachers_id: {
    id: string;
    first_name: string;
    last_name: string;
  };
}