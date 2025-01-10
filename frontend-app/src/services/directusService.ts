import axios from 'axios';

const API_URL = 'http://localhost:8055';

const api = axios.create({
  baseURL: API_URL,
});

// Fungsi untuk mendapatkan data dari koleksi tertentu
export const fetchCollectionData = async <T>(collectionName: string): Promise<T[]> => {
  try {
    const response = await api.get(`/items/${collectionName}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching ${collectionName}:`, error);
    if (axios.isAxiosError(error)) {
      throw new Error(`Axios error: ${error.response?.status} ${error.message}`);
    }
    throw new Error('Unknown error occurred');
  }
};

// Fungsi untuk mendapatkan data dari users
export const fetchCollectionUsersData = async <T>(collectionName: string): Promise<T[]> => {
  try {
    const response = await api.get(`/${collectionName}?fields=*,student_instruments.instruments_id.id,student_instruments.instruments_id.name`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching ${collectionName}:`, error);
    if (axios.isAxiosError(error)) {
      throw new Error(`Axios error: ${error.response?.status} ${error.message}`);
    }
    throw new Error('Unknown error occurred');
  }
};

// Fungsi untuk mendapatkan relasi kompleks
export const fetchRoleDetails = async (roleId: string) => {
  try {
    const response = await api.get(`/roles/${roleId}?fields=id,name`);
    return response.data.data; // Nama role
  } catch (error) {
    console.error('Error fetching role details:', error);
    throw error;
  }
};


// Fungsi untuk mendapatkan relasi kompleks
export const fetchInstrumentDetails = async (instrumentId: number) => {
  try {
    // const response = await api.get(`/items/instruments/${instrumentId}?fields=*,students.students_id.id,students.students_id.first_name,students.students_id.last_name,teachers.teachers_id.id,teachers.teachers_id.first_name,teachers.teachers_id.last_name`);
    const response = await api.get(`/items/instruments/${instrumentId}?fields=*,students.students_id.student_instruments.id,students.students_id.*,teachers.teachers_id.*`);
    console.log("Selected Instrument:", response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching instrument details:', error);
    throw error;
  }
};

// Fungsi untuk mendapatkan relasi kompleks
export const fetchStudentDetails = async (studentId: string) => {
  try {
    // const response = await api.get(`/items/instruments/${instrumentId}?fields=*,students.students_id.id,students.students_id.first_name,students.students_id.last_name,teachers.teachers_id.id,teachers.teachers_id.first_name,teachers.teachers_id.last_name`);
    // const response = await api.get(`/items/packages/?fields=*&filter[student]=${studentId}`);
    const response = await api.get(`/users/${studentId}?fields=*,student_instruments.instruments_id.id,student_instruments.instruments_id.name,teacher_instruments.instruments_id.id,teacher_instruments.instruments_id.name`);
    console.log("Selected Student Details:", response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching student details:', error);
    throw error;
  }
};

// Fungsi untuk mendapatkan relasi kompleks
export const fetchStudentSchedule = async (studentId: string, instrumentId: number) => {
  try {
    // const response = await api.get(`/items/instruments/${instrumentId}?fields=*,students.students_id.id,students.students_id.first_name,students.students_id.last_name,teachers.teachers_id.id,teachers.teachers_id.first_name,teachers.teachers_id.last_name`);
    const response = await api.get(`/items/packages/?fields=id,student,instrument,lessons,lessons.package.start_datetime&filter[student]=${studentId}&filter[instrument]=${instrumentId}`);
    console.log("Selected Schedule Details:", response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching student schedule details:', error);
    throw error;
  }
};

export default api;
