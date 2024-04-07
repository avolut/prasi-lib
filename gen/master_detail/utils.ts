import { PropOptRaw } from "../utils";

export type GenMasterDetailArg = {
  mode: "full" | "h-split" | "v-split";
  show_head: "always" | "only-master" | "only-child" | "hidden";
  tab_mode: "h-tab" | "v-tab" | "hidden";
  gen_feature: PropOptRaw;
  gen_table: string;
  gen_fields: PropOptRaw;
};

export const codeBuild = async <K extends Record<string, string>>(input: K) => {
  const result = {} as any;

  //@ts-ignore
  const res = await _api.code_build(input);
  if (res) {
    for (const [k, v] of Object.entries(res) as any) {
      result[k] = [input[k], v];
    }
  }

  return result as Record<keyof K, [string, string]>;
};
