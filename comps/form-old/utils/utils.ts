import { UseFormReturn } from "react-hook-form";

type ModifyOpt = {
  value?: any;
  options?: (string | { value: any; label: string })[];
};

export const modify = function (
  this: { form: FormHook; change_hook?: (opt: ModifyOpt) => void },
  field_name: string,
  opt: ModifyOpt
) {
  const f = this.form;

  const keys = Object.keys(opt);
  if (keys.includes("value")) {
    f.hook.setValue(field_name, opt.value);
  }
  if (this.change_hook) this.change_hook(opt);
};

export type FormHook = {
  hook: UseFormReturn<any, any, undefined>;
  ref: HTMLFormElement;
  submit: any;
  label: Record<string, string>;
  cache: any;
  validation: Record<string, "required">;
  render: () => void;
  unload?: () => void;
};
