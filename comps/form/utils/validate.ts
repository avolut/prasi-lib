import { FMLocal, FieldLocal } from "../typings";

export const validate = (field: FieldLocal, fm: FMLocal) => {
  if (field.required && typeof field.required_msg === "function") {
    const error_msg = field.required_msg(field.name);
    const error_list = fm.error.get(field.name).filter((e) => e !== error_msg);
    if (fm.data[field.name]) {
      fm.error.set(field.name, [error_msg, ...error_list]);
    } else {
      fm.error.set(field.name, error_list);
    }
  }
};
