import React, { useEffect, useState } from "react";
import {
  fetchCollectionData,
  fetchInstrumentDetails,
  fetchStudentDetails,
  fetchStudentSchedule,
} from "./services/directusService";
import { Instrument } from "./types/instruments";
import { Student } from "./types/users";
import { Schedule } from "./types/lessons";

const App: React.FC = () => {
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [selectedInstrument, setSelectedInstrument] =
    useState<Instrument | null>(null);

  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const [schedules, setSchedules] = useState<Student[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );

  // const [selectedInstrument, setSelectedInstrument] = useState<any>(null);
  // const [students, setStudents] = useState<any[]>([]); // State untuk menyimpan data siswa

  useEffect(() => {
    const fetchData = async () => {
      // // Fetch instrument data di awal, misalnya "Piano"
      // fetch("http://localhost:8055/items/instruments/1")
      //   .then((res) => res.json())
      //   .then((data) => setSelectedInstrument(data.data));
      try {
        const data = await fetchCollectionData<Instrument>("instruments");
        console.log("Fetched Instruments:", data); // Debugging log
        setInstruments(data);
      } catch (error) {
        console.error("Error fetching instruments:", error);
      }
    };

    fetchData();
  }, []);

  const handleViewDetails = async (instrumentId: number) => {
    try {
      const instrumentDetails = await fetchInstrumentDetails(instrumentId);
      // console.log("Instrument Details:", instrumentDetails); // Debugging log
      setSelectedInstrument(instrumentDetails);
      // console.log("Students Array:", instrumentDetails.students);
      console.log("Instrument Details Data:", instrumentDetails);
    } catch (error) {
      console.error("Error fetching instrument details:", error);
    }
  };

  const handleViewDetailsStudent = async (studentId: string) => {
    try {
      const studentDetails = await fetchStudentDetails(studentId);
      // console.log("Instrument Details:", instrumentDetails); // Debugging log
      setSelectedStudent(studentDetails);
      // console.log("Students Array:", instrumentDetails.students);
      console.log("Student Details Data:", studentDetails);
    } catch (error) {
      console.error("Error fetching student details:", error);
    }
  };

  const handleViewSchedule = async (
    studentId: string,
    instrumentId: number
  ) => {
    try {
      const scheduleDetails = await fetchStudentSchedule(
        studentId,
        instrumentId
      );
      // console.log("Instrument Details:", instrumentDetails); // Debugging log
      setSelectedSchedule(scheduleDetails);
      // console.log("Students Array:", instrumentDetails.students);
      console.log("Schedule Details Data:", scheduleDetails);
    } catch (error) {
      console.error("Error fetching schedule details:", error);
    }
  };

  return (
    <div>
      <h1>Instruments</h1>
      <ul>
        {instruments.map((instrument) => (
          <li key={instrument.id}>
            {instrument.name}
            <button onClick={() => handleViewDetails(instrument.id)}>
              View Details
            </button>
          </li>
        ))}
      </ul>

      {selectedInstrument && (
        <div>
          <h2>Instrument Details</h2>
          <p>
            <strong>Name:</strong> {selectedInstrument.name}
          </p>

          <h3>Students:</h3>
          <ul>
            {selectedInstrument.students?.map((student, index) => {
              // console.log("Student Data:", student);
              const studentData = student.students_id;
              // Validasi apakah students_id ada
              if (!student || !student.students_id) {
                return <li key={index}>Unknown Student</li>;
              }

              return (
                <li key={index}>
                  {studentData.first_name} {studentData.last_name} (ID:{" "}
                  {studentData.id})
                  <button
                    onClick={() => handleViewDetailsStudent(studentData.id)}
                  >
                    View Student Details
                  </button>
                  <button
                    onClick={() =>
                      handleViewSchedule(studentData.id, selectedInstrument.id)
                    }
                  >
                    View Schedule
                  </button>
                </li>
              );
            })}
          </ul>
          <h3>Teachers:</h3>
          <ul>
            {selectedInstrument.teachers?.map((teacher, index) => {
              // console.log("Student Data:", student);
              const teacherData = teacher.teachers_id;
              // Validasi apakah students_id ada
              if (!teacher || !teacher.teachers_id) {
                return <li key={index}>Unknown teacher</li>;
              }

              return (
                <li key={index}>
                  {teacherData.first_name} {teacherData.last_name} (ID:{" "}
                  {teacherData.id})
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
