export { FieldLoading } from "./comps/ui/field-loading";
import { lazify, lazifyMany } from "./utils/lazify";

/** Master - Detail - List - Form */
export const MasterDetail = lazify(
  async () => (await import("@/comps/md/MasterDetail")).MasterDetail
);
export const MDRenderMaster = lazify(
  async () => (await import("@/comps/md/parts/MDMaster")).MDRenderMaster
);
export const MDRenderTab = lazify(
  async () => (await import("@/comps/md/parts/MDDetail")).MDRenderTab
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
export const TableEdit = lazify(
  async () =>
    (await import("@/comps/form/field/table-edit/TableEdit")).TableEdit
);

const form = lazifyMany({
  Form: async () => (await import("@/comps/form/Form")).Form,
  Field: async () => (await import("@/comps/form/field/Field")).Field,
});
export const Form = form.Form;
export const Field = form.Field;

/** Export - Import */
export const ImportExcel = lazify(
  async () => (await import("@/comps/list/ImportExcel")).ImportExcel
);

export const ExportExcel = lazify(
  async () => (await import("@/comps/list/ExportExcel")).ExportExcel
);

/** Filter */
export const MasterFilter = lazify(
  async () => (await import("@/comps/filter/MasterFilter")).MasterFilter
);

export const FilterField = lazify(
  async () => (await import("@/comps/filter/FilterField")).FilterField
);

/** Generator */
export { generateMasterDetail } from "@/comps/md/gen/md-gen";
export { genTableEdit } from "@/comps/form/gen/gen-table-edit";
export { generateFilter as genereteFilter } from "@/comps/filter/gen/gen-filter";
export { generateRelation } from "@/comps/form/gen/gen-rel";
export { parseGenField } from "@/gen/utils";
/** ETC */
export { filterModifier } from "@/comps/filter/utils/filter-modifier";
export { filterWhere } from "@/comps/filter/utils/filter-where";
export {
  FMLocal,
  FieldTypeCustom,
  fieldType,
  formType,
} from "@/comps/form/typings";
export { MasterDetailType } from "@/comps/md/utils/typings";
export { FormatValue } from "@/utils/format-value";
export { GetValue } from "@/utils/get-value";
export { TableListType } from "@/comps/list/utils/typings";
export { Button, FloatButton } from "@/comps/ui/button";
export { prasi_gen } from "@/gen/prasi_gen";
export { password } from "@/utils/password";
export { generateTableList } from "@/comps/md/gen/gen-table-list";
export { generateForm } from "@/comps/form/gen/gen-form";

/** Session */
export {
  registerSession,
  RG,
  UserSession,
} from "@/preset/login/utils/register";
export { prasi_user } from "@/preset/login/utils/user";
export { Login } from "@/preset/login/Login";
export { logout } from "@/preset/login/utils/logout";
export { generateLogin } from "@/preset/login/utils/generate";
export { select as generateSelect } from "@/preset/login/utils/select";

export { Card } from "@/comps/custom/Card";

/** Layout */
export { Layout } from "@/preset/menu/Layout";

/* MENU */
export { Menu, MenuIcon } from "@/preset/menu/Menu";

/*Panel Tab*/
export { PanelTab } from "@/comps/tab/Tab";
export { PanelBody } from "@/comps/tab/parts/PanelBody";
export { PanelHeader } from "@/comps/tab/parts/PanelHead";
export { ShowHidePanel } from "@/comps/custom/ShowHidePanel";

/*Popup*/
export { Popup } from "@/comps/popup/PopUp";

// Detail
export { Detail } from "@/comps/custom/Detail";
export { Profile } from "@/preset/profile/Profile";
export { generateProfile } from "@/preset/profile/utils/generate";
export { ButtonUpload } from "@/preset/profile/ButtonUpload";
export { longDate, shortDate, timeAgo, formatTime } from "@/utils/date";
export { getPathname } from "./utils/pathname";

export * from "@/comps/ui/typeahead";
export * from "@/comps/ui/input";
