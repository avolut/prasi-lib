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

/** Generator */
export { generateMasterDetail } from "lib/comps/md/gen/md-gen";

/** ETC */
export {
  FMLocal,
  FieldTypeCustom,
  fieldType,
  formType,
} from "@/comps/form/typings";
export { MasterDetailType } from "@/comps/md/utils/typings";
export { FormatValue } from "@/utils/format-value";
export { GetValue } from "@/utils/get-value";
export { TableListType } from "lib/comps/list/utils/typings";
export { Button, FloatButton } from "@/comps/ui/button";
export { prasi_gen } from "@/gen/prasi_gen";

/** Session */
export {registerSession, RG, UserSession} from "@/comps/login/utils/register"
export {prasi_user} from "@/comps/login/utils/user"
export {Login} from "@/comps/login/Login"
export {logout} from "@/comps/login/utils/logout"
export {generateLogin} from "@/comps/login/utils/generate"
/** Layout */
export {Layout} from "@/comps/custom/Layout"

/* MENU */
export {Menu} from "@/comps/menu/Menu"

/* Bcrypt */
export {password} from "@/utils/password"
