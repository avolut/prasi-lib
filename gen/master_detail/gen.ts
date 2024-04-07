import { PropOptRaw, GenFn, parseGenField, parseOpt } from "../utils";
import { genForm } from "./gen-form";
import { genList } from "./gen-list";
import { GenMasterDetailArg } from "./utils";

export const gen_master_detail: GenFn<GenMasterDetailArg> = async (
  modify,
  data,
  arg
) => {
  const fields = parseGenField(arg.gen_fields);
  const should_gen = parseOpt<{
    list: { number: boolean; actions: boolean };
    form: boolean;
    view: boolean;
  }>(arg.gen_feature);

  const result: any = {};
  if (should_gen.list) {
    await genList(arg, data);
  }
  if (should_gen.form) {
    await genForm(arg, data);
  }
  result.child = data.child;

  modify(result);
};
