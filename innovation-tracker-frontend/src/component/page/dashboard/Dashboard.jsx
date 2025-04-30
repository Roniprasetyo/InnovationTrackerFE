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
import Button from "../../part/Button";
import { exportExcel } from "../../util/ExportExcel";
import Table from "../../part/Table";
import Loading from "../../part/Loading";

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
const initialChart = {
  labels: [],
  datasets: [],
};

export default function Dashboard() {
  const [selectedLomba, setSelectedLomba] = useState("SS");
  const [isError, setIsError] = useState(false);
  const [currentData, setCurrentData] = useState([]);
  const [listEmployee, setListEmployee] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [listPeriod, setListPeriod] = useState(true);

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
          let userData = [];
          let sectionsCount = {};
          let sections = new Set();
          let categorySet = new Set();

          data.forEach((element) => {
            const usr = listEmployee.find(
              (item) => item.username === element["Creaby"]
            );
            if (usr !== undefined) {
              const fullData = { ...element, upt: usr.upt };
              userData.push(fullData);
              const dept = usr.upt;
              sectionsCount[dept] = (sectionsCount[dept] || 0) + 1;
              sections.add(dept);

              categorySet.add(element.Submission);
            }
          });

          const sectionsArray = [...sections];
          const categoryArray = [...categorySet];

          const tableData = sectionsArray
            .map((dept, index) => ({
              Department: dept,
              Total: sectionsCount[dept],
              Alignment: ["center", "left", "right"],
            }))
            .sort((a, b) => b.Total - a.Total);

          setTableData(
            tableData.map((prev, index) => ({
              Key: index + 1,
              No: index + 1,
              ...prev,
            }))
          );

          const formatted = categoryArray.map((category, index) => ({
            label: category,
            data: sectionsArray.map(
              (dept) =>
                userData.filter(
                  (value) => value.Submission === category && value.upt === dept
                ).length
            ),
            backgroundColor: index % 2 === 0 ? "#3B82F6" : "#59D2FE",
          }));

          const formattedData = {
            labels: sectionsArray,
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
        setCurrentData({});
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [listEmployee, currentFilter]);

  if (isLoading) return <Loading />;

  return (
    <>
      <div className="my-3 mt-4">
        <div className="mb-4 color-primary text-center">
          <div className="d-flex gap-3 justify-content-center">
            <h2 className="display-4 fw-bold">Total Submission Data</h2>
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
              { Text: "BPI", Value: "BPI" },
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
        <hr />
        <div className="mt-5 mb-3">
          <div className="mt-4">
            <div className="color-primary text-center">
              <div className="d-flex gap-3 justify-content-center">
                <h2 className="display-6 fw-bold">
                  {" "}
                  Summary of {currentFilter.jenis} Submission
                </h2>
              </div>
            </div>
          </div>
          <div className="mb-3">
            <Button
              iconName="file-excel"
              label="Export"
              classType="success"
              onClick={() => {
                exportExcel(
                  tableData.map(({ Key, Alignment, ...rest }) => rest),
                  currentFilter.jenis +
                    "_" +
                    new Date().toLocaleDateString() +
                    "_" +
                    new Date().toLocaleTimeString() +
                    "_" +
                    ".xlsx"
                );
              }}
            />
          </div>
          {tableData.length !== 0 ? (
            <>
              <Table data={tableData} />
            </>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
}
