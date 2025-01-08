// import { Lesson } from './lessons';
import { Payment } from './payments';

export interface Schedule {
  data: {
    id: string;
  };
}
export interface Package {
    id: number;
    status: 'Published' | 'Draft' | 'Archived';
    user_created: string;
    user_updated: string;
    date_created: string;
    date_updated: string;
    name: string;
    student: string;
    instrument: number;
    start_datetime: string;
    end_datetime: string;
    duration: number;
    remarks: string;
    lessons?: Schedule[];
    payments: Payment[];
    lesson_quota: number;
  }
  