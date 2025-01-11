import React, { useEffect, useState } from "react";
import {
  fetchCollectionData,
  fetchCollectionUsersData,
  fetchInstrumentDetails,
  fetchTeacherSchedule,
  fetchStudentDetails,
  fetchStudentSchedule,
  fetchRoleDetails,
} from "./services/directusService";
import { Instrument } from "./types/instruments";
import { Student, User, Teacher } from "./types/users";
import { Lesson } from "./types/lessons";
import { Role } from "./types/roles";

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

  const [schedules, setSchedules] = useState<Lesson[]>([]);
  const [expandedScheduleId, setExpandedScheduleId] = useState<string | null>(
    null
  );

  const [roles, setRoles] = useState<Role[]>([]); // Peta antara role ID dan nama role

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
        // console.log("Fetched Instruments:", data); // Debugging log
        setInstruments(data);

        const dataUsers = await fetchCollectionUsersData<User>("users");
        // console.log("Fetched Students:", dataUsers); // Debugging log
        setUsers(dataUsers);

        const dataRoles = await fetchRoleDetails(""); // Fetch roles
        // console.log("Roles Data:", dataRoles); // Tambahkan log untuk debug
        // setRoles(dataRoles as Role[]); // Cast hasil sebagai Role[]
        setRoles(dataRoles);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchData();
  }, []);

  // const handleViewDetails = async (instrumentId: number) => {
  //   try {
  //     const instrumentDetails = await fetchInstrumentDetails(instrumentId);
  //     // console.log("Instrument Details:", instrumentDetails); // Debugging log
  //     setSelectedInstrument(instrumentDetails);
  //     // console.log("Students Array:", instrumentDetails.students);
  //     // console.log("Instrument Details Data:", instrumentDetails);
  //   } catch (error) {
  //     console.error("Error fetching instrument details:", error);
  //   }
  // };

  const getRoleNameById = (roleId: string): string => {
    // console.log("Roles in State:", roles); // Debugging log
    // console.log("Searching Role ID:", roleId); // Debugging log
    const role = roles.find((role) => role.id === roleId);
    return role ? role.name : "Unknown Role";
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

  const handleViewSchedule = async (studentId: string, instrumentId: number) => {
    try {
      const scheduleDetails = await fetchStudentSchedule(studentId, instrumentId);
      setSchedules(scheduleDetails);
      setExpandedScheduleId(studentId); // Menandai jadwal untuk mahasiswa yang dipilih
    } catch (error) {
      console.error("Error fetching schedule details:", error);
    }
  };
  // Filter data untuk Student dan Teacher
  const students = users.filter(
    (user) => getRoleNameById(user.role) === "Student"
  );
  const teachers = users.filter(
    (user) => getRoleNameById(user.role) === "Teacher"
  );

  return (
    <div>
      <h1>Users</h1>

      {/* Tabel untuk Student */}
      <h2>Students</h2>
      <table border="1" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>Role</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((user) => (
            <React.Fragment key={user.id}>
              {/* Baris utama */}
              <tr>
                <td>{getRoleNameById(user.role)}</td>
                <td>
                  {user.first_name} {user.last_name}
                </td>
                <td>
                  <button onClick={() => handleViewDetailsStudent(user.id)}>
                    {expandedStudentId === user.id
                      ? "Hide Details"
                      : "View Details"}
                  </button>
                  <button onClick={() => {
                        if (expandedScheduleId === user.id) {
                          // Jika sudah diperluas, sembunyikan
                          setExpandedScheduleId(null);
                        } else {
                          // Jika belum diperluas, tampilkan jadwal
                          handleViewSchedule(
                            user.id,
                            user.student_instruments?.[0]?.instruments_id?.id || 0
                          );
                        }
                      }}
                    >
                      {expandedScheduleId === user.id ? "Hide Schedule" : "View Schedule"}
                  </button>
                </td>
              </tr>

              {/* Baris detail */}
              {expandedStudentId === user.id && studentDetails && (
                <tr>
                  <td colSpan={3}>
                    <div
                      style={{ padding: "10px", backgroundColor: "#f9f9f9" }}
                    >
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
                    </div>
                  </td>
                </tr>
              )}

              {/* Baris jadwal */}
              {expandedScheduleId === user.id && schedules.length > 0 && (
                <tr>
                  <td colSpan={3}>
                    <div style={{ padding: "10px", backgroundColor: "#f2f2f2" }}>
                      <h3>Schedule Details:</h3>
                      <ul>
                      {schedules.map((schedule, index) => (
                          <li key={index}>
                            <strong>Instrument:</strong> {schedule.instrument}
                            {schedule.lessons.map((lesson, lessonIndex) => (
                              <div key={lessonIndex}>
                                <strong>Lesson:</strong>{" "}
                                {new Date(lesson.package.start_datetime).toLocaleString()}
                              </div>
                            ))}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </td>
                </tr>
              )}

              {expandedScheduleId === user.id && schedules.length === 0 && (
                <tr>
                  <td colSpan={3}>
                    <div style={{ padding: "10px", backgroundColor: "#f2f2f2" }}>
                      <h3>Schedule Details:</h3>
                      <p>No schedule available for this user.</p>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* Tabel untuk Teacher */}
      <h2>Teachers</h2>
      <table border="1" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>Role</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((user) => (
            <React.Fragment key={user.id}>
              {/* Baris utama */}
              <tr>
                <td>{getRoleNameById(user.role)}</td>
                <td>
                  {user.first_name} {user.last_name}
                </td>
                <td>
                  <button onClick={() => handleViewDetailsStudent(user.id)}>
                    {expandedStudentId === user.id
                      ? "Hide Details"
                      : "View Details"}
                  </button>
                  <button onClick={() => {
                        if (expandedScheduleId === user.id) {
                          // Jika sudah diperluas, sembunyikan
                          setExpandedScheduleId(null);
                        } else {
                          // Jika belum diperluas, tampilkan jadwal
                          handleViewSchedule(
                            user.id,
                            user.student_instruments?.[0]?.instruments_id?.id || 0
                          );
                        }
                      }}
                    >
                      {expandedScheduleId === user.id ? "Hide Schedule" : "View Schedule"}
                  </button>
                </td>
              </tr>

              {/* Baris detail */}
              {expandedStudentId === user.id && studentDetails && (
                <tr>
                  <td colSpan={3}>
                    <div
                      style={{ padding: "10px", backgroundColor: "#f9f9f9" }}
                    >
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
                        {user.teacher_instruments &&
                        user.teacher_instruments.length > 0
                          ? user.teacher_instruments
                              .map(
                                (relation) =>
                                  relation.instruments_id?.name || "Unknown"
                              )
                              .join(", ")
                          : "No Instruments Assigned"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
              

              {expandedScheduleId === user.id && schedules.length > 0 && (
                <tr>
                  <td colSpan={3}>
                    <div style={{ padding: "10px", backgroundColor: "#f2f2f2" }}>
                      <h3>Schedule Details:</h3>
                      <ul>
                      {schedules.map((schedule, index) => (
                          <li key={index}>
                            <strong>Instrument:</strong> {schedule.instrument}
                            {schedule.lessons.map((lesson, lessonIndex) => (
                              <div key={lessonIndex}>
                                <strong>Lesson:</strong>{" "}
                                {new Date(lesson.package.start_datetime).toLocaleString()}
                              </div>
                            ))}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </td>
                </tr>
              )}

              {expandedScheduleId === user.id && schedules.length === 0 && (
                <tr>
                  <td colSpan={3}>
                    <div style={{ padding: "10px", backgroundColor: "#f2f2f2" }}>
                      <h3>Schedule Details:</h3>
                      <p>No schedule available for this user.</p>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
