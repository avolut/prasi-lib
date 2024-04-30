import { PropOptRaw, GenFn, parseGenField, parseOpt } from "../utils";
import { genForm } from "./gen-form";
import { genList } from "./gen-list";
import { GenMasterDetailArg } from "./utils";

const w = window as unknown as {
  generating_prasi_md: Record<string, true>;
};

export const gen_master_detail: GenFn<GenMasterDetailArg> = async (
  modify,
  data,
  arg
) => {
  w.generating_prasi_md = {
    "master_detail": true
  };
  const result: any = {};
  const fields = parseGenField(arg.gen_fields);
  modify(result);
  const should_gen = parseOpt<{
    list: { number: boolean; actions: boolean };
    form: boolean;
    view: boolean;
  }>(arg.gen_feature);

  if (should_gen.list) {
    await genList(arg, data);
  }
  if (should_gen.form) {
    await genForm(arg, data);
  }
  result.child = data.child;

  delete w.generating_prasi_md["master_detail"];
  modify(result);
  
  console.log("LAGI GENERATE");

};
