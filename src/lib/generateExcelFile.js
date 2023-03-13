import { ExcelFile, ExcelSheet, ExcelColumn } from "react-export-excel";

export default function generateExcelFile(jsonData) {
  const headerStyle = { background: "#f5f5f5", fontWeight: "bold" };
  const cellStyle = { borderBottom: "1px solid #ddd", padding: "8px" };

  return (
    <ExcelFile
      element={<button>Download</button>}
      filename="myFile"
      fileExtension="xlsx"
    >
      <ExcelSheet data={data} name="Sheet1">
        <ExcelColumn label="Name" value="name" />
        <ExcelColumn label="Age" value="age" />
        <ExcelColumn label="Address" value="address" />
      </ExcelSheet>
    </ExcelFile>
  );
}
