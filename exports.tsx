import { lazify, lazifyMany } from "lib/utils/lazify";

export const Accordion = lazify(
  async () => (await import("lib/comps/ui/accordion")).Accordion
);

export const Popover = lazify(
  async () => (await import("lib/comps/custom/Popover")).Popover
);
export const Progress = lazify(
  async () => (await import("lib/comps/ui/progress")).Progress
);

export const Dialog = lazify(
  async () => (await import("lib/comps/ui/dialog")).Dialog
);

export const Typeahead = lazify(
  async () => (await import("lib/comps/ui/typeahead")).Typeahead
);

/** Master - Detail - List - Form */
// export const MasterDetail = lazify(
//   async () => (await import("lib/comps/md/MasterDetail")).MasterDetail
// );
export const MDRenderMaster = lazify(
  async () => (await import("lib/comps/md/parts/MDMaster")).MDRenderMaster
);
export const MDRenderTab = lazify(
  async () => (await import("lib/comps/md/parts/MDDetail")).MDRenderTab
);
export const MDAction = lazify(
  async () => (await import("lib/comps/md/parts/MDAction")).MDAction
);
export const Breadcrumb = lazify(
  async () => (await import("lib/comps/custom/Breadcrumb")).Breadcrumb
);
export const TableList = lazify(
  async () => (await import("lib/comps/list/TableList")).TableList
);
export const TableEdit = lazify(
  async () =>
    (await import("lib/comps/form/field/table-edit/TableEdit")).TableEdit
);

const loading = lazifyMany({
  FieldLoading: async () =>
    (await import("lib/comps/ui/field-loading")).FieldLoading,
  Spinner: async () => (await import("lib/comps/ui/field-loading")).Spinner,
});

export const FieldLoading = loading.FieldLoading;
export const Spinner = loading.Spinner;

const form = lazifyMany({
  Form: async () => (await import("lib/comps/form/Form")).Form,
  Field: async () => (await import("lib/comps/form/field/Field")).Field,
});

export const Form = form.Form;
export const Field = form.Field;

/** Export - Import */
export const ImportExcel = lazify(
  async () => (await import("lib/comps/list/ImportExcel")).ImportExcel
);

export const ExportExcel = lazify(
  async () => (await import("lib/comps/list/ExportExcel")).ExportExcel
);

/** Filter */
export const MasterFilter = lazify(
  async () => (await import("lib/comps/filter/MasterFilter")).MasterFilter
);

export const FilterField = lazify(
  async () => (await import("lib/comps/filter/FilterField")).FilterField
);

export const HeaderProfile = lazify(
  async () => (await import("lib/comps/custom/HeaderProfile")).HeaderProfile
);

/** charts */
export const BarChart = lazify(
  async () => (await import("lib/comps/charts/bar")).BarChart
);
export const PieChart = lazify(
  async () => (await import("lib/comps/charts/pie")).PieChart
);
export const DoughnutChart = lazify(
  async () => (await import("lib/comps/charts/doughnut")).DoughnutChart
);
export const LineChart = lazify(
  async () => (await import("lib/comps/charts/line")).LineChart
);

export const ScrollArea = lazify(
  async () => (await import("lib/comps/ui/scroll-area")).ScrollArea
);

export const KeyValue = lazify(
  async () => (await import("lib/comps/form/field/type/KeyValue")).KeyValue
);
export const Pop = lazify(
  async () => (await import("lib/comps/dialog/Dialog")).Pop
);

export const Slide = lazify(
  async () => (await import("lib/comps/slide/Slide")).Slide
);

export const AspectRatio = lazify(
  async () => (await import("lib/comps/ui/aspect-ratio")).AspectRatio
); 
export const Import = lazify(
  async () => (await import("lib/comps/import/Import")).Import
);

export const Sheet = lazify(
  async () => (await import("lib/comps/sheet/sheet")).SheetCn
);

export const Layout = lazify(
  async () => (await import("lib/preset/menu/Layout")).Layout
);

export { formatBytes } from "lib/comps/import/lib/formatBytes";
export { fetchLinkParams, lastParams } from "lib/utils/fetch-link-params";
export { lang } from "lib/lang";
export { prasi_gen } from "./gen/prasi_gen";
export { guessLabel } from "./utils/guess-label";
import __get from "lodash.get";
import { sum } from "./utils/sum";
export { ImgThumb } from "lib/comps/form/field/type/FilePreview";
export { _post } from "./utils/post";
export { toast, Toaster } from "./comps/ui/toast";
export { NavLink } from "./comps/popup/NavLink";
export { kvToJSON } from "./utils/kv-to-json";
export { overrideNav } from "./utils/override-nav";
export { bulk_query } from "./utils/bulk-query";
export { get_user } from "./utils/get_user";
export { range_date } from "./utils/ranged_date";
export const _sum = sum;
export const _get = __get;

/** Generator */
export { generateFilter as generateFilter } from "lib/comps/filter/gen/gen-filter";
export { generateRelation } from "lib/comps/form/gen/gen-rel";
export { genTableEdit } from "lib/comps/form/gen/gen-table-edit";
export { generateMasterDetail } from "lib/comps/md/gen/md-gen";
export { parseGenField } from "lib/gen/utils";

/** ETC */
export { filterModifier } from "lib/comps/filter/utils/filter-modifier";
// export { generateField } from "lib/comps/form/gen/gen-field";
export { generateForm } from "lib/comps/form/gen/gen-form";
export { validate as validateField } from "lib/comps/form/utils/validate";
export { sortTree, treePrefix } from "lib/comps/list/utils/sort-tree";

export { getFilter } from "lib/comps/filter/utils/get-filter";
export type {
  fieldType,
  FieldTypeCustom,
  FMLocal,
} from "lib/comps/form/typings";
export { formType } from "lib/comps/form/typings";
export type { TableListType } from "lib/comps/list/utils/typings";
export { generateTableList as generateTableList } from "lib/comps/md/gen/gen-table-list";
export { generateSelect } from "lib/comps/md/gen/md-select";
export { MasterDetailType } from "lib/comps/md/utils/typings";
export { Button, FloatButton } from "lib/comps/ui/button";
export { baseurl, imgThumb } from "lib/utils/baseurl";
export { FormatValue } from "lib/utils/format-value";
export { GetValue } from "lib/utils/get-value";
export { password } from "lib/utils/password";
export { call_prasi_events, prasi_events } from "lib/utils/prasi-events";
export { Card } from "lib/comps/custom/Card";
export { registerSession } from "lib/preset/login/utils/register";
export { logout } from "lib/preset/login/utils/logout";
export { Login } from "lib/preset/login/Login";
/* MENU */
export { Menu, MenuIcon } from "lib/preset/menu/Menu";

/*Panel Tab*/
export { ShowHidePanel } from "lib/comps/custom/ShowHidePanel";
export { PanelBody } from "lib/comps/tab/parts/PanelBody";
export { PanelHeader } from "lib/comps/tab/parts/PanelHead";
export { PanelTab } from "lib/comps/tab/parts/PanelTab";

/*Popup*/
export { Popup } from "lib/comps/popup/PopUp";

export { Detail } from "lib/comps/custom/Detail";
export * from "lib/comps/ui/input";
export { ButtonUpload } from "lib/preset/profile/ButtonUpload";
export { Profile } from "lib/preset/profile/Profile";
export { generateProfile } from "lib/preset/profile/utils/generate";
export { formatTime, longDate, shortDate, timeAgo } from "lib/utils/date";
export { getBasename, getPathname } from "lib/utils/pathname";

export { formatMoney } from "lib/comps/form/field/type/TypeMoney";
export { Flow } from "lib/comps/ui/flow";
