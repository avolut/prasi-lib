import { GFCol } from "lib/gen/utils";
import { useLocal } from "lib/utils/use-local";
import { ChangeEvent, FC, MouseEvent } from "react";
// import { Workbook } from 'exceljs';
// import * as XLSX from "xlsx";

type ImportExcelProps = {
  gen_fields: string[];
  gen_table: string;
};

type RowData = {
  pk: string | number;
  rows: any;
};

export const ImportExcel: FC<ImportExcelProps> = ({
  gen_fields,
  gen_table,
}) => {
  const local = useLocal({
    data: [] as any[],
    columns: [] as string[],
    fields: [] as string[],
    tableName: "",
    selectedRows: [] as RowData[],
    pk: null as null | GFCol,
    columnMappings: [] as { column: string; selectedColumn: string }[],
    isLoading: false,
    progress: 0,
    showPreviewExcel: false,
    insertedData: [] as any[],
    isStopped: false,
    processedRows: 0,
    firstRow: [] as string[],
  });

  const pk = local.pk?.name || "id";

  const getAllKeys = (arr: Array<Record<string, any>>): string[] => {
    const keysSet = new Set<string>();

    arr.forEach((obj) => {
      Object.keys(obj).forEach((key) => keysSet.add(key));
    });

    return Array.from(keysSet);
  };

  // const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;

  //   const reader = new FileReader();

  //   reader.onload = (event: ProgressEvent<FileReader>) => {
  //     if (!event.target?.result) return;

  //     const workbook = XLSX.read(event.target.result, { type: "binary" });
  //     const sheetName = workbook.SheetNames[0];
  //     const sheet = workbook.Sheets[sheetName];
  //     const sheetData = XLSX.utils.sheet_to_json(sheet);
  //     local.data = sheetData;
  //     local.columns = getAllKeys(local.data);
  //     gen_fields.forEach((data: any) => {
  //       local.fields.push(JSON.parse(data).name);
  //     });
  //     local.tableName = gen_table;
  //     local.showPreviewExcel = true;
  //     local.render();
  //   };
  //   reader.readAsBinaryString(file);
  // };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (event: ProgressEvent<FileReader>) => {
      if (!event.target?.result) return;

    //   const buffer = new Uint8Array(event.target.result as ArrayBuffer);
    //   const workbook = new Workbook();
    //   await workbook.xlsx.load(buffer);

    //   const worksheet = workbook.worksheets[0];
    //   if (worksheet) {
    //     let sheetData = worksheet
    //       .getRows(1, worksheet.actualRowCount)
    //       ?.map((row) => row.values);
    //     let firstRow = sheetData!.shift();
    //     local.data = sheetData!;
    //     if (firstRow) {
    //       local.firstRow = firstRow as string[];
    //     } else {
    //       console.log("firstRow is undefined");
    //     }
    //     local.columns = getAllKeys(local.data);
    //     gen_fields.forEach((data: any) => {
    //       local.fields.push(JSON.parse(data).name);
    //     });
    //     local.tableName = gen_table;
    //     local.showPreviewExcel = true;
    //     local.render();
    //   }
    };
    reader.readAsArrayBuffer(file);
  };

  const executeImport = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const table = (db as any)[local.tableName];
    if (table) {
      local.showPreviewExcel = false;
      local.isLoading = true;
      local.progress = 0;
      local.insertedData = [];
      local.render();
      const totalRows = local.selectedRows.length;
      local.processedRows = 0;
      let rowIndex = 0;
      for (const row of local.selectedRows) {
        if (!local.isStopped) {
          let insertRow: any = {};
          local.columnMappings.forEach((columnMapping) => {
            insertRow[pk] = rowIndex;
            insertRow[columnMapping.selectedColumn] =
              row.rows[columnMapping.column];
          });
          rowIndex++;

          // let insertedData = await table.create({ data: insertRow });
          // local.insertedData.push({
          //   pk: insertedData.id,
          //   rows: insertedData
          // });
          local.insertedData.push({
            pk: insertRow[pk],
            rows: insertRow,
          });
          local.render();
          local.processedRows++;
          local.progress = Math.round((local.processedRows / totalRows) * 100);
          local.render();
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }
      local.isLoading = false;
      local.render();
    }
  };

  const headerCheckboxClick = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      local.data.forEach((data, key) => {
        local.selectedRows.push({
          pk: data[pk] === undefined ? key : data[pk],
          rows: data,
        });
      });
      local.render();
      console.log("Select All", local.selectedRows);
    } else {
      local.selectedRows = [];
      local.render();
      console.log("Deselect all", local.selectedRows);
    }
  };

  const checkboxClick = (rowId: any) => (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const checked = !!local.selectedRows.find((data) => data.pk === rowId);
    if (!checked) {
      const checkedRowData = local.data.filter((row) => row[pk] === rowId);
      local.selectedRows.push({
        pk: rowId,
        rows: checkedRowData,
      });
      local.render();
      console.log("selected", local.selectedRows);
    } else {
      local.selectedRows = local.selectedRows.filter(
        (data) => data.pk !== rowId
      );
      local.render();
      console.log("deselected", local.selectedRows);
    }
  };

  const handleStopProgress = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    local.isStopped = true;
    local.render();
  };

  const continueProgress = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    let ids = [] as any[];
    local.insertedData.forEach((row) => {
      ids.push(row.pk);
    });
    const table = (db as any)[local.tableName];
    if (table) {
      let remainingData = local.selectedRows.filter(
        (row) => !ids.includes(row.pk)
      );
      local.showPreviewExcel = false;
      local.isLoading = true;
      local.render();
      const totalRows = local.selectedRows.length;
      for (const row of remainingData) {
        let insertRow: any = {};
        local.columnMappings.forEach((columnMapping) => {
          insertRow[columnMapping.selectedColumn] =
            row.rows[columnMapping.column];
        });

        // let insertedData = await table.create({ data: insertRow });
        // local.insertedData.push({
        //   pk: insertedData.id,
        //   rows: insertedData
        // });
        local.insertedData.push({
          pk: insertRow[pk],
          rows: insertRow,
        });
        local.render();
        local.processedRows++;
        local.progress = Math.round((local.processedRows / totalRows) * 100);
        local.render();
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
      local.isLoading = false;
      local.isStopped = false;
      local.render();
    }
  };

  const columnMappingChange =
    (col: string) => (e: ChangeEvent<HTMLSelectElement>) => {
      const selectedValue = e.target.value;
      local.columnMappings.push({
        column: col,
        selectedColumn: selectedValue,
      });
      local.render();
      console.log("column mappings", local.columnMappings);
    };

  const isRowChecked = (id: any) => {
    return local.selectedRows.some((checked) => checked.pk === id);
  };

  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
      {local.showPreviewExcel && local.data.length > 0 && (
        <div>
          <button
            onClick={executeImport}
            style={{
              backgroundColor: "#4CAF50",
              border: "none",
              color: "white",
              padding: "15px 32px",
              textAlign: "center",
              textDecoration: "none",
              display: "inline-block",
              fontSize: "16px",
              margin: "4px 2px",
              cursor: "pointer",
              borderRadius: "10px",
            }}
          >
            Confirm Import
          </button>
          <h2>Your Excel Data:</h2>
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid black", padding: "8px" }}>
                  <input type="checkbox" onChange={headerCheckboxClick} />
                </th>
                {local.columns.map((col: any) => (
                  <th
                    key={col}
                    style={{ border: "1px solid black", padding: "8px" }}
                  >
                    {local.firstRow[col]}{" "}
                    <select
                      onChange={columnMappingChange(col)}
                      style={{
                        marginLeft: "8px",
                        padding: "4px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                      }}
                    >
                      <option value="">Select Field</option>
                      {local.fields.map((field) => (
                        <option key={field} value={field}>
                          {field}
                        </option>
                      ))}
                    </select>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {local.data.map((row, index) => (
                <tr key={index}>
                  <td style={{ border: "1px solid black", padding: "8px" }}>
                    <div
                      onClick={checkboxClick(row[pk])}
                      className={cx(
                        css`
                          width: 100%;
                          height: 100%;
                        `,
                        "c-flex c-items-center c-justify-center"
                      )}
                    >
                      <input
                        className="c-pointer-events-none"
                        type="checkbox"
                        checked={isRowChecked(
                          row[pk] === undefined ? index : row[pk]
                        )}
                      />
                    </div>
                  </td>
                  {local.columns.map((col) => (
                    <td
                      key={col}
                      style={{ border: "1px solid black", padding: "8px" }}
                    >
                      {row[col]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {local.isLoading && (
        <div style={{ width: "100%", padding: "10px" }}>
          <div
            style={{
              width: "100%",
              backgroundColor: "#f3f3f3",
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${local.progress}%`,
                height: "24px",
                backgroundColor: "#4caf50",
                textAlign: "center",
                lineHeight: "24px",
                color: "white",
              }}
            >
              {local.progress}%
            </div>
          </div>
        </div>
      )}
      {local.insertedData.length > 0 && (
        <div>
          {local.insertedData.length !== local.selectedRows.length && (
            <div>
              {!local.isStopped && (
                <button
                  onClick={handleStopProgress}
                  style={{
                    backgroundColor: "red",
                    border: "none",
                    color: "white",
                    padding: "15px 32px",
                    textAlign: "center",
                    textDecoration: "none",
                    display: "inline-block",
                    fontSize: "16px",
                    margin: "4px 2px",
                    cursor: "pointer",
                    borderRadius: "10px",
                  }}
                >
                  Pause Progress
                </button>
              )}
              {local.isStopped && (
                <button
                  onClick={continueProgress}
                  style={{
                    backgroundColor: "green",
                    border: "none",
                    color: "white",
                    padding: "15px 32px",
                    textAlign: "center",
                    textDecoration: "none",
                    display: "inline-block",
                    fontSize: "16px",
                    margin: "4px 2px",
                    cursor: "pointer",
                    borderRadius: "10px",
                  }}
                >
                  Continue Progress
                </button>
              )}
            </div>
          )}
          <h2>Inserted Data:</h2>
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                {local.columnMappings.map((col) => (
                  <th
                    key={col.selectedColumn}
                    style={{ border: "1px solid black", padding: "8px" }}
                  >
                    {col.selectedColumn}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {local.columnMappings.map((col) => (
                  <td
                    key={col.selectedColumn}
                    style={{ border: "1px solid black", padding: "8px" }}
                  >
                    {
                      local.insertedData[local.insertedData.length - 1].rows[
                        col.selectedColumn
                      ]
                    }
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
