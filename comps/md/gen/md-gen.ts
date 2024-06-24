import { GenFn } from "lib/gen/utils";
import { generateMDForm } from "./md-form";
import { generateList } from "./md-list";

const w = window as any;
export const generateMasterDetail: GenFn<{
  item: PrasiItem;
  table: string;
  fields: any;
}> = async (modify, data, arg) => {
  const { item } = arg;

  await generateList(arg, data, false);
  await generateMDForm(arg, data, false);
  await item.edit.commit();
};
