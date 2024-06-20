import { GenFn } from "lib/gen/utils";
import { generateMDForm } from "./md-form";
import { generateList } from "./md-list";

const w = window as unknown as {
  generating_prasi_md: Record<string, true>;
};

export const generateMasterDetail: GenFn<{
  item: PrasiItem;
  table: string;
  fields: any;
}> = async (modify, data, arg) => {
  const { item } = arg;
  // w.generating_prasi_md = {
  //   master_detail: true,
  // };
  // const result: any = {};
  // modify(result);
  await generateList(arg, data, false);
  await generateMDForm(arg, data, false);
  await item.edit.commit();
  // delete w.generating_prasi_md["master_detail"];
  // modify({});
};
