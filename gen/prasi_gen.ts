import { gen_action } from "./gen_action/gen_action";
import { gen_form } from "./gen_form/gen_form";
import { gen_relation } from "./gen_relation/gen_relation";
import { gen_table_list } from "./gen_table_list/gen_table_list";
import { gen_master_detail } from "./master_detail/gen";
import { gen_prop_fields } from "./prop/gen_prop_fields";
import { gen_props_table } from "./prop/gen_prop_table";
import { gen_object_rel } from "./prop/gen_object_rel";

export const prasi_gen = {
  actions_tab: gen_action,
  master_detail: gen_master_detail,
  table_list: gen_table_list,
  form: gen_form,
  relation: gen_relation,
  prop: {
    fields: gen_prop_fields,
    table: gen_props_table,
    rel: gen_object_rel,
  },
};
