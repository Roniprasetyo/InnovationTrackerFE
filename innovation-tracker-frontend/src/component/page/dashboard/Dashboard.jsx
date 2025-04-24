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
        backgroundColor: "#3B82F6",
      },
      {
        label: "SS Non Technic",
        data: [35, 25, 15],
        backgroundColor: "#10B981",
      },
    ],
    totalSubmit: [
      { departemen: "Departemen IF", technic: 10, nonTechnic: 8 },
      { departemen: "Departemen TPM", technic: 6, nonTechnic: 4 },
      { departemen: "Departemen MK", technic: 5, nonTechnic: 3 },
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
    totalSubmit: [
      { departemen: "Departemen IF", technic: 15, nonTechnic: 12 },
      { departemen: "Departemen TPM", technic: 18, nonTechnic: 10 },
      { departemen: "Departemen MK", technic: 13, nonTechnic: 8 },
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
    totalSubmit: [
      { departemen: "Departemen IF", technic: 10, nonTechnic: 6 },
      { departemen: "Departemen TPM", technic: 8, nonTechnic: 5 },
      { departemen: "Departemen MK", technic: 7, nonTechnic: 4 },
    ],
  },
  VCI: {
    labels: ["Departemen IF", "Departemen TPM", "Departemen MK"],
    datasets: [
      {
        label: "VCI",
        data: [25, 40, 60],
        backgroundColor: "#6366F1",
      },
    ],
    totalSubmit: [
      { departemen: "Departemen IF", total: 5 },
      { departemen: "Departemen TPM", total: 7 },
      { departemen: "Departemen MK", total: 9 },
    ],
  },
};

export default function Dashboard() {
  const [selectedLomba, setSelectedLomba] = useState("SS");
  const [isError, setIsError] = useState(false);

  const selectedData = dataLomba[selectedLomba];

  // Hitung total otomatis
  const total = selectedData.totalSubmit.reduce(
    (acc, item) => {
      if (selectedLomba === "VCI") {
        acc.total += item.total;
      } else {
        acc.technic += item.technic;
        acc.nonTechnic += item.nonTechnic;
      }
      return acc;
    },
    selectedLomba === "VCI"
      ? { total: 0 }
      : { technic: 0, nonTechnic: 0 }
  );

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
        <div className="flex-fill">
          <Alert
            type="danger"
            message={isError.message}
            handleClose={() => setIsError({ error: false, message: "" })}
          />
        </div>
      )}

      <div className="container">
        <div className="w-25 mb-3">
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


        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">
            Total Submission {selectedLomba} per Departemen
          </h3>
          <table className="table table-bordered w-75">
          <thead>
            <tr className="text-center">
              <th>No</th>
              <th>Departemen</th>
              {selectedLomba === "VCI" ? (
                <th>Total Submit</th>
              ) : (
                <>
                  <th>{selectedData.datasets[0].label}</th>
                  <th>{selectedData.datasets[1].label}</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {selectedData.totalSubmit.map((item, index) => (
              <tr key={index}>
                <td className="text-center">{index + 1}</td>
                <td>{item.departemen}</td>
                {selectedLomba === "VCI" ? (
                  <td className="text-end">{item.total}</td>
                ) : (
                  <>
                    <td className="text-end">{item.technic}</td>
                    <td className="text-end">{item.nonTechnic}</td>
                  </>
                )}
              </tr>
            ))}
            <tr className="fw-bold">
              <td colSpan="2" className="text-center">Total Submit</td>
              {selectedLomba === "VCI" ? (
                <td className="text-end">{total.total}</td>
              ) : (
                <>
                  <td className="text-end">{total.technic}</td>
                  <td className="text-end">{total.nonTechnic}</td>
                </>
              )}
            </tr>
          </tbody>
        </table>

        </div>
        <br />
        <br />
        <Bar data={selectedData} options={{ responsive: true }} />
      </div>
    </>
  );
}
