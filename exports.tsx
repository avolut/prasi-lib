export { FieldLoading } from "@/comps/ui/field-loading";
import { lazify, lazifyMany } from "@/utils/lazify";
import __get from "lodash.get";
import { sum } from "./utils/sum";
export { guessLabel } from "./utils/guess-label";
export { fetchLinkParams } from "./comps/form/field/type/TypeLink";
export { prasi_gen } from "./gen/prasi_gen";

export const _sum = sum;
export const _get = __get;

export const Accordion = lazify(
  async () => (await import("@/comps/ui/accordion")).Accordion
);

export const Popover = lazify(
  async () => (await import("@/comps/custom/Popover")).Popover
);
export const Progress = lazify(
  async () => (await import("@/comps/ui/progress")).Progress
);
export const Dialog = lazify(
  async () => (await import("@/comps/ui/dialog")).Dialog
);
export const Typeahead = lazify(
  async () => (await import("@/comps/ui/typeahead")).Typeahead
);

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

export const HeaderProfile = lazify(
  async () => (await import("@/comps/custom/HeaderProfile")).HeaderProfile
);

/** charts */
export { PieChart } from "@/comps/charts/pie";
export { BarChart } from "@/comps/charts/bar";
// export { LineChart } from "@/comps/charts/line";

/** Generator */
export { generateFilter as genereteFilter } from "@/comps/filter/gen/gen-filter";
export { generateRelation } from "@/comps/form/gen/gen-rel";
export { genTableEdit } from "@/comps/form/gen/gen-table-edit";
export { generateMasterDetail } from "@/comps/md/gen/md-gen";
export { parseGenField } from "@/gen/utils";

/** ETC */
export { filterModifier } from "@/comps/filter/utils/filter-modifier";
export { generateField } from "@/comps/form/gen/gen-field";
export { generateForm } from "@/comps/form/gen/gen-form";
export { validate as validateField } from "@/comps/form/utils/validate";
export { sortTree, treePrefix } from "@/comps/list/utils/sort-tree";

export {
  FMLocal,
  FieldTypeCustom,
  fieldType,
  formType,
} from "@/comps/form/typings";
export { TableListType } from "@/comps/list/utils/typings";
export { generateTableList as generateTableList } from "@/comps/md/gen/gen-table-list";
export { generateSelect } from "@/comps/md/gen/md-select";
export { MasterDetailType } from "@/comps/md/utils/typings";
export { Button, FloatButton } from "@/comps/ui/button";
export { FormatValue } from "@/utils/format-value";
export { GetValue } from "@/utils/get-value";
export { password } from "@/utils/password";
export { prasi_events, call_prasi_events } from "lib/utils/prasi-events";
export { getFilter } from "@/comps/filter/utils/get-filter";

/** Session */
export { Login } from "@/preset/login/Login";
export { generateLogin } from "@/preset/login/utils/generate";
export { logout } from "@/preset/login/utils/logout";
export {
  RG,
  UserSession,
  registerSession,
} from "@/preset/login/utils/register";

export { Card } from "@/comps/custom/Card";

/** Layout */
export { Layout } from "@/preset/menu/Layout";

/* MENU */
export { Menu, MenuIcon } from "@/preset/menu/Menu";

/*Panel Tab*/
export { ShowHidePanel } from "@/comps/custom/ShowHidePanel";
export { PanelBody } from "@/comps/tab/parts/PanelBody";
export { PanelHeader } from "@/comps/tab/parts/PanelHead";
export { PanelTab } from "@/comps/tab/parts/PanelTab";

/*Popup*/
export { Popup } from "@/comps/popup/PopUp";

export { Detail } from "@/comps/custom/Detail";
export { ButtonUpload } from "@/preset/profile/ButtonUpload";
export { Profile } from "@/preset/profile/Profile";
export { generateProfile } from "@/preset/profile/utils/generate";
export { formatTime, longDate, shortDate, timeAgo } from "@/utils/date";
export { getPathname, getBasename } from "@/utils/pathname";

export * from "@/comps/ui/input";

export { Flow } from "@/comps/ui/flow";
