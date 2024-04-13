import { gen_form } from "./gen_form/gen_form";
import { gen_relation } from "./gen_relation/gen_relation";
import { gen_table_list } from "./gen_table_list/gen_table_list";
import { gen_master_detail } from "./master_detail/gen";
import { gen_prop_fields } from "./prop/gen_prop_fields";
import { gen_props_table } from "./prop/gen_prop_table";

export const prasi_gen = {
  master_detail: gen_master_detail,
  table_list: gen_table_list,
  form: gen_form,
  relation: gen_relation,
  prop: {
    fields: gen_prop_fields,
    table: gen_props_table,
  },
};
