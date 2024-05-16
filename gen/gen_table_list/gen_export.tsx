import capitalize from "lodash.capitalize";
import { GFCol, createItem, parseGenField } from "../utils";
import { on_load } from "./on_load";
import { codeBuild, codeBuildTest } from "../master_detail/utils";
// import * as Excel from "exceljs";
import ExcelJS from "exceljs";
import * as FileSaver from "file-saver";

export const gen_export = async (
  modify: (data: any) => void,
  data: any,
  arg: { mode: "table" | "list" | "grid" | "auto"; id_parent?: string }
) => {
  const table = JSON.parse(data.gen_table.value) as string;
  const raw_fields = JSON.parse(data.gen_fields.value) as (
    | string
    | { value: string; checked: string[] }
  )[];
  const select = {} as any;
  let pk = "";
  let pks: Record<string, string> = {};

  const fields = parseGenField(raw_fields);
  for (const f of fields) {
    select[f.name] = true;
    if (f.relation) {
      select[f.name] = {
        select: {},
      };
      for (const r of f.relation.fields) {
        select[f.name].select[r.name] = true;
      }
    }
    if (f.is_pk) {
      pk = f.name;
    }
  }

  if (arg.id_parent) {
    select[arg.id_parent] = true;
  }

  if (!pk) {
    alert("Failed to generate! Primary Key not found. ");
    return;
  }
  const keys = Object.keys(select);
  const tableName = data.gen_table.value;
  const selectFields = keys.join(", ");

  try {
    const result: any[] = await db.$queryRawUnsafe(
      `SELECT ${selectFields} FROM ${tableName};`
    );

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet 1");

    const columns = Object.keys(result[0]);
    worksheet.addRow(columns);

    result.forEach((row) => {
      const values = columns.map((col) => row[col]);
      worksheet.addRow(values);
    });

    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    FileSaver.saveAs(blob, "exported_data.xlsx");

    console.log("Data exported");
  } catch (error) {
    console.error("Error exporting data:", error);
  } finally {
    await db.$disconnect();
  }
};
