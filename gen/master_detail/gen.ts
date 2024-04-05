import { PropOptRaw, GenFn, parseGenField, parseOpt } from "../utils";
import { genList } from "./gen-list";
import { GenMasterDetailArg } from "./utils";

export const gen_master_detail: GenFn<GenMasterDetailArg> = (
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
    genList(arg, fields, data);
  }
  result.child = data.child;

  modify(result);
};
