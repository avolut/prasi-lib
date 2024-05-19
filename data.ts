import { lazify } from "./utils/lazify";

/** Master - Detail - List - Form */
export const MasterDetail = lazify(
  async () => (await import("@/comps/md/MasterDetail")).MasterDetail
);
export const MDMaster = lazify(
  async () => (await import("@/comps/md/parts/MDMaster")).MDMaster
);
export const MDAction = lazify(
  async () => (await import("@/comps/md/parts/MDAction")).MDAction
);
export const Breadcrumb = lazify(
  async () => (await import("@/comps/custom/Breadcrumb")).Breadcrumb
);
export const TableList = lazify(
  async () => (await import("@/comps/list/TableList")).TableList
);
export const Form = lazify(
  async () => (await import("@/comps/form/Form")).Form
);
export const Field = lazify(
  async () => (await import("@/comps/form/field/Field")).Field
);

/** Export - Import */
export const ImportExcel = lazify(
  async () => (await import("@/comps/list/ImportExcel")).ImportExcel
);

export const ExportExcel = lazify(
  async () => (await import("@/comps/list/ExportExcel")).ExportExcel
);

/** ETC */
export {
  FMLocal,
  FieldTypeCustom,
  fieldType,
  formType,
} from "@/comps/form/typings";
export { MasterDetailType } from "@/comps/md/utils/typings";
export { prasi_gen } from "@/gen/prasi_gen";
export { FormatValue } from "@/utils/format-value";
export { GetValue } from "@/utils/get-value";
export { TableListType } from "lib/comps/list/utils/typings";
