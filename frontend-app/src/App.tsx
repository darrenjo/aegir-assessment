import React, { useEffect, useState } from "react";
import {
  fetchCollectionData,
  fetchInstrumentDetails,
} from "./services/directusService";
import { Instrument } from "./types/instruments";

const App: React.FC = () => {
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [selectedInstrument, setSelectedInstrument] =
    useState<Instrument | null>(null);

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
      console.log("Instrument Details Data:", selectedInstrument);
    } catch (error) {
      console.error("Error fetching instrument details:", error);
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
                </li>
              );
            })}
          </ul>

          {/* <h3>Teachers:</h3>
          <ul>
            {selectedInstrument.teachers?.map((teacher, index) => (
              <li key={index}>
                {teacher.teachers_id.first_name} {teacher.teachers_id.last_name}{" "}
                (ID: {teacher.teachers_id.id})
              </li>
            ))}
          </ul> */}
        </div>
      )}
    </div>
  );
};

export default App;
