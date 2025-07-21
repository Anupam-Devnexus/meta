import React, { useState } from "react";
import * as XLSX from "xlsx";

export default function ExcelUploader() {
  const [data, setData] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const binaryStr = evt.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      setData(jsonData);
      console.log(jsonData); // Data parsed from Excel
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="p-4">
      <label
        htmlFor="excelUpload"
        className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer"
      >
        Upload Excel File
      </label>
      <input
        type="file"
        id="excelUpload"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Preview uploaded data */}
      {data.length > 0 && (
        <div className="mt-4">
          <h3 className="font-bold mb-2">Parsed Data:</h3>
          <pre className="bg-gray-100 p-2 rounded overflow-x-auto max-h-96">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
