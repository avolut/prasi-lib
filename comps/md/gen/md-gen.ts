import { GenFn } from "lib/gen/utils";
import { generateMDForm } from "./md-form";
import { generateMDList } from "./md-list";
import capitalize from "lodash.capitalize";
const w = window as any;
export const generateMasterDetail: GenFn<{
  item: PrasiItem;
  table: string;
  fields: any;
}> = async (modify, data, arg) => {
  const { item } = arg;

  try {
    const fn_title = new Function(
      `return ${item.edit.props?.title?.value || "''"}`
    );
    const title = fn_title();
    if (!title && item.edit.props?.gen_table) {
      const table = { ...item.edit.props?.gen_table };
      table.value = `${capitalize(table.value as string)}`;
      item.edit.setProp("title", table);
    }
  } catch (e) {}

  await generateMDList(arg, data, false);
  await generateMDForm(arg, data, false);
  await item.edit.commit();
};
