import { FMLocal } from "../../typings";
import { BaseFormProps } from "./type/field";

export const submitBaseForm = async <T extends Record<string, any>>(
  fm: FMLocal,
  arg: BaseFormProps<T>
) => {
  return true;
};
