import { Form as FForm } from "@/comps/ui/form";
import { useLocal } from "@/utils/use-local";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { FormHook } from "./utils/utils";

export const Form: FC<{
  on_init: (arg: { submit: any }) => any;
  on_load: () => any;
  on_submit: (arg: { form: any; error: any }) => any;
  body: any;
  form: FormHook;
  PassProp: any;
  layout: "auto" | "1-col" | "2-col";
}> = ({
  on_init,
  on_load,
  body,
  form,
  PassProp,
  on_submit,
  layout: _layout,
}) => {
  const form_hook = useForm<any>({
    defaultValues: on_load,
  });

  const local = useLocal({
    el: null as any,
    submit_timeout: null as any,
    layout: "unknown" as "unknown" | "2-col" | "1-col",
    init: false,
  });

  form.hook = form_hook;
  if (!form.validation) {
    form.validation = {};
  }
  if (!form.label) {
    form.label = {};
  }

  let layout = _layout || "auto";
  if (layout !== "auto") local.layout = layout;

  const submit = () => {
    clearTimeout(local.submit_timeout);
    local.submit_timeout = setTimeout(() => {
      const data = form.hook.getValues();
      form.hook.clearErrors();
      for (const [k, v] of Object.entries(form.validation)) {
        if (v === "required") {
          if (!data[k]) {
            const error = {
              type: "required",
              message: `${form.label[k] || k} is required.`,
            };
            form.hook.formState.errors[k] = error;
            form.hook.setError(k, error);
          }
        }
      }

      on_submit({
        form: data,
        error: form.hook.formState.errors,
      });
    }, 300);
  };

  if (!local.init) {
    local.init = true;
    on_init({ submit });
  }

  form.submit = submit;

  return (
    <FForm {...form_hook}>
      <form
        className={
          "flex-1 flex flex-col w-full items-stretch relative overflow-auto"
        }
        ref={(el) => {
          if (el) form.ref = el;
        }}
        onSubmit={(e) => {
          console.log("on submit");
          e.preventDefault();
          e.stopPropagation();
          submit();
        }}
      >
        <div
          ref={(el) => {
            if (el && layout === "auto" && local.layout === "unknown") {
              let cur: any = el;
              let i = 0;
              while (
                cur.parentNode &&
                cur.getBoundingClientRect().width === 0
              ) {
                cur = cur.parentNode;
                i++;
                if (i > 10) {
                  break;
                }
              }

              if (cur.getBoundingClientRect().width < 500) {
                local.layout = "1-col";
              } else {
                local.layout = "2-col";
              }
              local.render();
            }
          }}
          className={cx(
            local.layout === "unknown" && "c-hidden",
            local.layout === "2-col" &&
              css`
                > div {
                  flex-direction: row;
                  flex-wrap: wrap;
                  > div {
                    width: 50%;
                  }
                }
              `
          )}
        >
          <PassProp submit={submit} data={form_hook.getValues()}>
            {body}
          </PassProp>
        </div>
      </form>
    </FForm>
  );
};
