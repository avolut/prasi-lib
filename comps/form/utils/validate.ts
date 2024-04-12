import { FMLocal, FieldLocal } from "../typings";

export const validate = (field: FieldLocal, fm: FMLocal) => {
  if (fm.status !== "ready") return;

  let msg = (name: string) => {
    return `${name} harus diisi`;
  };
  if (typeof field.required_msg === "function") {
    msg = field.required_msg;
  }
  if (field.required) {
    const error_msg = msg(field.name);
    const error_list = fm.error.get(field.name).filter((e) => e !== error_msg);
    if (!fm.data[field.name]) {
      fm.error.set(field.name, [error_msg, ...error_list]);
    } else {
      fm.error.set(field.name, error_list);
    }
  }
};
