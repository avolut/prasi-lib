import { GenFn } from "lib/gen/utils";
import { generateList } from "./md-list";

const w = window as unknown as {
  generating_prasi_md: Record<string, true>;
};

export const generateMasterDetail: GenFn<{ item: PrasiItem, table: string, fields: any }> = async (
  modify,
  data,
  arg
) => {
  const {item} = arg;
  // loading generate MD
  w.generating_prasi_md = {
    master_detail: true,  
  };

  await generateList(arg, data, false);
  // const childs = item.edit.childs[0].edit.childs;

  // const master = childs.find(
  //   (e) => e.component?.id === "c68415ca-dac5-44fe-aeb6-936caf8cc491"
  // );

  // if (master) {
  //   master.edit.setProp("on_init", {
  //     mode: "raw",
  //     value: `async (text: string) => {
  //     }`,
  //   });

  //  
  // }
  await item.edit.commit();
  console.log({item})
};
