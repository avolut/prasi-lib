import { FormHook } from "../form-old/utils/utils";

export type FMProps = {
  on_init: (arg: { submit: any; reload: any }) => any;
  on_load: () => any;
  on_submit: (arg: { form: any; error: any }) => Promise<any>;
  body: any;
  form: FormHook;
  PassProp: any;
  sonar: "on" | "off";
  layout: "auto" | "1-col" | "2-col";
};

export type FMInternal = {
  status: "init" | "loading" | "saving" | "ready";
  data: any;
  reload: () => Promise<void>;
  error: {
    list: { name: string; error: string }[];
    set: (name: string, error: string) => void;
    get: (name: string, error: string) => void;
    clear: () => void;
  };
  internal: {
    reload: {
      timeout: ReturnType<typeof setTimeout>;
      promises: Promise<void>[];
      done: any[];
    };
  };
  props: Exclude<FMProps, "body" | "PassProp">;
};
export type FMLocal = FMInternal & { render: () => void };

export const FormType = `{
  status: "init" | "loading" | "saving" | "ready"
}`;
