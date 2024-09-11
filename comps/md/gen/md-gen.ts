import { formatName, GenFn } from "lib/gen/utils";
import { generateMDForm } from "./md-form";
import { generateMDList } from "./md-list";

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
    const title = formatName(fn_title());
    if (!title && item.edit.props?.gen_table) {
      const table = { ...item.edit.props?.gen_table };
      table.value = `${formatName(table.value as string)}`;
      item.edit.setProp("title", table.value);
    }
  } catch (e) {}

  if (!arg.fields && data?.gen_fields?.valueBuilt) {
    eval(`arg.fields = ${data.gen_fields.valueBuilt}`);
  }

  if (!arg.table && data?.gen_table?.valueBuilt) {
    eval(`arg.table = ${data.gen_table.valueBuilt}`);
  }

  await generateMDList(arg, data, false);
  await generateMDForm(arg, data, false);
  await item.edit.commit();
};
