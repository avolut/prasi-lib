import { gen_object_rel } from "./prop/gen_object_rel";
import { gen_prop_fields } from "./prop/gen_prop_fields";
import { gen_props_table } from "./prop/gen_prop_table";

export const prasi_gen = {
  prop: {
    fields: gen_prop_fields,
    table: gen_props_table,
    rel: gen_object_rel,
  },
};
