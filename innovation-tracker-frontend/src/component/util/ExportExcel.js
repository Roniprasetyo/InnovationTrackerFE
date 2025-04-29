import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportExcel = (jsonData, fileName = "export.xlsx") => {
  const worksheet = XLSX.utils.json_to_sheet(jsonData);
  const headers = Object.keys(jsonData[0] || {});
  headers.forEach((header, index) => {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: index }); // row 0
    if (!worksheet[cellAddress]) return;
    worksheet[cellAddress].s = {
      font: { bold: true },
    };
  });

  worksheet["!cols"] = headers.map(() => ({
    wch: 10,
    min: 10,
    max: 30,
  }));

  // Create workbook and export
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
    cellStyles: true,
  });

  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, fileName);
};
