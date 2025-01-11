export interface Lesson {
    id: number;
    student: number;
    instrument: string;
    lessons: Array <{
      package: {
        start_datetime: string;
      };
  }>;
  }
  