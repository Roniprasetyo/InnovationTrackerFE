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
import { useEffect } from "react";
import UseFetch from "../../util/UseFetch";
import Alert from "../../part/Alert";
import { API_LINK } from "../../util/Constants";
import { EMP_API_LINK } from "../../util/Constants";
import { use } from "react";
import Label from "../../part/Label";

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
const initialChart = {
  labels: [],
  datasets: [],
};

export default function Dashboard() {
  const [selectedLomba, setSelectedLomba] = useState("SS");
  const [isError, setIsError] = useState(false);
  const [currentData, setCurrentData] = useState([]);
  const [listEmployee, setListEmployee] = useState([]);
  const [currentFilter, setCurrentFilter] = useState({
    jenis: selectedLomba,
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));
      try {
        const response = await fetch(`${EMP_API_LINK}getDataKaryawan`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        });

        const data = await response.json();
        setListEmployee(
          data.map((value) => ({
            username: value.username,
            upt: value.upt_bagian,
            jabatan: value.jabatan,
            departmen: value.departemen_jurusan,
          }))
        );
      } catch (error) {
        window.scrollTo(0, 0);
        setIsError((prevError) => ({
          ...prevError,
          error: true,
          message: error.message,
        }));
        setListEmployee({});
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));
      try {
        const data = await UseFetch(
          API_LINK + "Chart/GetAllSubbmision",
          currentFilter
        );

        if (data === "ERROR") {
          throw new Error("Error: Failed to get the period data.");
        } else {
          // console.log(data);

          let userData = [];
          data.forEach((element) => {
            const usr = listEmployee.find(
              (item) => item.username === element["Creaby"]
            );
            if (usr !== undefined) {
              userData.push({ ...element, departmen: usr.departmen });
            }
          });
          const departments = [
            ...new Set(userData.map((item) => item.departmen)),
          ];
          const category = [...new Set(data.map((item) => item.Submission))];
          const formatted = category.map((category, index) => {
            return {
              label: category,
              data: departments.map((dept) => {
                return userData.filter((sub) => sub.departmen === dept).length;
              }),
              backgroundColor: index % 2 === 0 ? ["#3B82F6"] : "#10B981",
            };
          });
          console.log(formatted);
          const formattedData = {
            labels: departments,
            datasets: formatted,
          };
          setCurrentData(formattedData);
        }
      } catch (error) {
        window.scrollTo(0, 0);
        setIsError((prevError) => ({
          ...prevError,
          error: true,
          message: error.message,
        }));
        setListPeriod({});
      }
    };

    fetchData();
  }, [listEmployee, currentFilter]);

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
            value={currentFilter.jenis}
            onChange={(e) =>
              setCurrentFilter((prevFilter) => {
                return {
                  ...prevFilter,
                  jenis: e.target.value,
                };
              })
            }
          />
        </div>

        {currentData.length !== 0 ? (
          <Bar data={currentData} options={{ responsive: true }} />
        ) : (
          <Label data="No data Available" />
        )}
      </div>
    </>
  );
}
