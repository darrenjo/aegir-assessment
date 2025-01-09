export interface Schedule {
  data: {
    id: string;
  };
}

export interface Lesson {
    id: number;
    sort: number;
    user_created: string;
    user_updated: string;
    date_created: string;
    date_updated: string;
    package: number;
    teacher: string;
    start_datetime?: Schedule[];
    // start_datetime: string;
    status: 'Attended' | 'Absent';
    remarks: string;
  }
  