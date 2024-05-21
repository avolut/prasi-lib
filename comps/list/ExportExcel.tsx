import { useLocal } from "@/utils/use-local";
import { FC, MouseEvent } from "react";
import ExcelJS from "exceljs";

export const ExportExcel: FC<{
  data: any[],
  fileName?: string
}> = ({
  data, fileName = "exported_data.xlsx"
}): JSX.Element => {
    const local = useLocal({
      data: [] as any[]
    });
    local.data = data;
    local.render();
    const getAllKeys = (arr: Array<Record<string, any>>): string[] => {
      const keysSet = new Set<string>();

      arr.forEach(obj => {
        Object.keys(obj).forEach(key => keysSet.add(key));
      });

      return Array.from(keysSet);
    };

    // const handleExport = async (e: MouseEvent<HTMLButtonElement>) => {
    //   try {
    //     const workbook = new ExcelJS.Workbook();
    //     const worksheet = workbook.addWorksheet("Sheet 1");

    //     const columns = getAllKeys(local.data);
    //     worksheet.addRow(columns);

    //     local.data.forEach((row) => {
    //       const values = columns.map((col) => row[col]);
    //       worksheet.addRow(values);
    //     });

    //     const buffer = await workbook.xlsx.writeBuffer();

    //     const blob = new Blob([buffer], {
    //       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    //     });

    //     // FileSaver.saveAs(blob, fileName);

    //     console.log("Data exported");
    //   } catch (error) {
    //     console.error("Error exporting data:", error);
    //   }
    // };

    const handleExport = async (e: MouseEvent<HTMLButtonElement>) => {
      try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Sheet 1");

        const columns = getAllKeys(local.data);
        worksheet.addRow(columns);

        local.data.forEach((row) => {
          const values = columns.map((col) => row[col]);
          worksheet.addRow(values);
        });

        const buffer = await workbook.xlsx.writeBuffer();

        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const a = document.createElement("a");
        a.href = window.URL.createObjectURL(blob);
        a.download = "my-exported-data.xlsx";
        a.click();

        console.log("Data exported");
      } catch (error) {
        console.error("Error exporting data:", error);
      }
    };

    return (
      <div>
        <button onClick={handleExport} style={{ background: '#00ffff' }}>Export</button>
      </div>
    );
  };