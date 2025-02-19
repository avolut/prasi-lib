import ExcelJS from "exceljs";
import { FC, MouseEvent } from "react";

export const ExportExcel: FC<{
  data: any[];
  fileName?: string;
  children?: any;
  className?: string;
}> = ({
  data,
  fileName = "exported_data.xlsx",
  children,
  className,
}): JSX.Element => {
  const getAllKeys = (arr: Array<Record<string, any>>): string[] => {
    const keysSet = new Set<string>();

    arr.forEach((obj) => {
      Object.keys(obj).forEach((key) => keysSet.add(key));
    });

    return Array.from(keysSet);
  };
  
  const handleExport = async (e: MouseEvent<HTMLButtonElement>) => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Sheet 1");

      const columns = getAllKeys(data);
      worksheet.addRow(columns);

      data.forEach((row) => {
        const values = columns.map((col) => row[col]);
        worksheet.addRow(values);
      });

      const buffer = await workbook.xlsx.writeBuffer();

      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const a = document.createElement("a");
      a.href = window.URL.createObjectURL(blob);
      a.download = fileName;
      a.click();

      console.log("Data exported");
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };

  return (
    <button onClick={handleExport} className={className}>
      {children || "Export"}
    </button>
  );
};
