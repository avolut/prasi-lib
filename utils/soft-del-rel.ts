import { prasi_gen } from "lib/gen/prasi_gen";

export const sofDeleteField = async (
  table: string,
  field: string
) => {
  const result = {} as any;
  const fields =await prasi_gen.prop.fields(table);
  const value = fields.find((e: any) => {
    const val = JSON.parse(e.value);
    if (val.type === "has-one" || val.type === "has-many" || val.is_pk) {
      return false;
    }
    return (e.label === field);
  });
  if(value) return JSON.parse(value.value)
  return result;
};
