import { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import DropDown from "../../part/Dropdown";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const dataLomba = {
  SS: {
    labels: ["Departemen IF", "Departemen TPM", "Departemen MK"],
    datasets: [
      {
        label: "SS Technic",
        data: [40, 30, 20],
        backgroundColor: "#3B82F6", // Biru
      },
      {
        label: "SS Non Technic",
        data: [35, 25, 15],
        backgroundColor: "#10B981", // Hijau
      },
    ],
  },
  QCC: {
    labels: ["Departemen IF", "Departemen TPM", "Departemen MK"],
    datasets: [
      {
        label: "QCC Technic",
        data: [50, 70, 90],
        backgroundColor: "#3B82F6",
      },
      {
        label: "QCC Non Technic",
        data: [45, 65, 85],
        backgroundColor: "#10B981",
      },
    ],
  },
  QCP: {
    labels: ["Departemen IF", "Departemen TPM", "Departemen MK"],
    datasets: [
      {
        label: "QCP Technic",
        data: [60, 50, 40],
        backgroundColor: "#3B82F6",
      },
      {
        label: "QCP Non Technic",
        data: [55, 45, 35],
        backgroundColor: "#10B981",
      },
    ],
  },
  VCI: {
    labels: ["Departemen IF", "Departemen TPM", "Departemen MK"],
    datasets: [
      {
        label: "VCI Technic",
        data: [20, 60, 80],
        backgroundColor: "#3B82F6",
      },
      {
        label: "VCI Non Technic",
        data: [25, 55, 75],
        backgroundColor: "#10B981",
      },
    ],
  },
};


export default function Dashboard() {
  const [selectedLomba, setSelectedLomba] = useState("SS");
  const [isError, setIsError] = useState(false);

  return (
    <>
      <div className="my-3">
        <div className="mb-4 color-primary text-center">
          <div className="d-flex gap-3 justify-content-center">
            <h2 className="display-1 fw-bold">Total Submission</h2>
            <div className="d-flex align-items-end mb-2">
              <h2 className="display-5 fw-bold align-items-end">Data</h2>
            </div>
          </div>
        </div>
      </div>
      {isError.error && (
        <div className="flex-fill ">
          <Alert
            type="danger"
            message={isError.message}
            handleClose={() => setIsError({ error: false, message: "" })}
          />
        </div>
      )}
      <div className="container">
        {/* <h1 className="text-2xl font-bold mb-4">Dashboard Lomba</h1> */}

        <div className="w-25">
          <DropDown
            forInput="ddSubmission"
            label="Submission"
            arrData={[
              { Text: "SS", Value: "SS" },
              { Text: "QCC", Value: "QCC" },
              { Text: "QCP", Value: "QCP" },
              { Text: "VCI", Value: "VCI" },
            ]}
            value={selectedLomba}
            onChange={(e) => setSelectedLomba(e.target.value)}
          />
        </div>

        <Bar data={dataLomba[selectedLomba]} options={{ responsive: true }} />
      </div>
    </>
  );
}
