import { PropOptRaw } from "lib/gen/utils";

export type GenMasterDetailArg = {
  mode: "full" | "h-split" | "v-split";
  show_head: "always" | "only-master" | "only-child" | "hidden";
  tab_mode: "h-tab" | "v-tab" | "hidden";
  gen_feature: PropOptRaw;
  gen_table: string;
  gen_fields: PropOptRaw;
  child:any
};