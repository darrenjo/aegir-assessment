import React, { useEffect, useState } from "react";
import {
  fetchCollectionData,
  fetchCollectionUsersData,
  fetchInstrumentDetails,
  fetchStudentDetails,
  fetchStudentSchedule,
} from "./services/directusService";
import { Instrument } from "./types/instruments";
import { Student, User } from "./types/users";
import { Schedule } from "./types/lessons";

const App: React.FC = () => {
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [selectedInstrument, setSelectedInstrument] =
    useState<Instrument | null>(null);

  const [users, setUsers] = useState<User[]>([]);
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(
    null
  );
  // const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentDetails, setStudentDetails] = useState<Student | null>(null);

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

        const dataUsers = await fetchCollectionUsersData<User>("users");
        console.log("Fetched Students:", dataUsers); // Debugging log
        setUsers(dataUsers);
      } catch (error) {
        console.error("Error fetching students:", error);
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
    if (expandedStudentId === studentId) {
      // Jika mahasiswa sudah diperluas, tutup detailnya
      setExpandedStudentId(null);
      setStudentDetails(null);
    } else {
      try {
        const studentDetails = await fetchStudentDetails(studentId);
        // console.log("Instrument Details:", instrumentDetails); // Debugging log
        // setSelectedStudent(studentDetails);
        // console.log("Students Array:", instrumentDetails.students);
        setExpandedStudentId(studentId);
        setStudentDetails(studentDetails);
        // console.log("Student Details Data:", studentDetails);
      } catch (error) {
        console.error("Error fetching student details:", error);
      }
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
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.first_name} {user.last_name}
            <button onClick={() => handleViewDetailsStudent(user.id)}>
              {expandedStudentId === user.id
                ? "Hide Student Details"
                : "View Student Details"}
            </button>
            {expandedStudentId === user.id && studentDetails && (
              <div style={{ marginTop: "10px", paddingLeft: "20px" }}>
                <p>
                  <strong>ID:</strong> {user.id}
                </p>
                <p>
                  <strong>First Name:</strong> {user.first_name}
                </p>
                <p>
                  <strong>Last Name:</strong> {user.last_name}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Status:</strong> {user.status}
                </p>
                <p>
                  <strong>Instruments:</strong>{" "}
                  {user.student_instruments &&
                  user.student_instruments.length > 0
                    ? user.student_instruments
                        .map(
                          (relation) =>
                            relation.instruments_id?.name || "Unknown"
                        )
                        .join(", ")
                    : "No Instruments Assigned"}
                </p>
                {/* Tambahkan data lain yang relevan */}
              </div>
            )}
          </li>
        ))}
      </ul>

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
                    {expandedStudentId === studentData.id
                      ? "Hide Student Details"
                      : "View Student Details"}
                  </button>
                  {expandedStudentId === studentData.id && studentDetails && (
                    <div style={{ marginTop: "10px", paddingLeft: "20px" }}>
                      <p>
                        <strong>First Name:</strong> {studentData.first_name}
                      </p>
                      <p>
                        <strong>Last Name:</strong> {studentData.last_name}
                      </p>
                      <p>
                        <strong>Email:</strong> {studentData.email}
                      </p>
                      <p>
                        <strong>Status:</strong> {studentData.status}
                      </p>
                      {/* <p>
                        <strong>Instruments:</strong>{" "}
                        {studentData.student_instruments.instruments_id.name}
                      </p> */}
                      {/* Tambahkan data lain yang relevan */}
                    </div>
                  )}
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
