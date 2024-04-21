import { FMLocal } from "../../typings";
import { formError } from "../../utils/error";
import { reloadBaseForm } from "./reload";
import { submitBaseForm } from "./submit";
import { BaseFormProps } from "./type/field";

export const initSimpleForm = <T extends Record<string, any>>(
  fm: FMLocal,
  arg: BaseFormProps<T>
) => {
  fm.data = {};
  fm.error = formError(fm);
  fm.events = {
    on_change(name, new_value) {},
  };
  fm.field_def = {};
  fm.fields = {};
  fm.internal = {
    submit: { done: [], promises: [], timeout: null as any },
    reload: { done: [], promises: [], timeout: null as any },
  };
  fm.props = {} as any;
  fm.reload = async () => {
    await reloadBaseForm(fm, arg);
  };
  fm.size = {
    width: 0,
    height: 0,
    field: "full",
  };
  fm.submit = () => {
    return submitBaseForm(fm, arg);
  };
  fm.status = "ready";
};
