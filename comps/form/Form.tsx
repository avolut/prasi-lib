import { Form as FForm } from "@/comps/ui/form";
import { Toaster } from "@/comps/ui/sonner";
import { useLocal } from "@/utils/use-local";
import { FC, useEffect } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormHook } from "./utils/utils";
import { AlertTriangle, Check, Loader2 } from "lucide-react";
import { cn } from "@/utils";
import { Skeleton } from "../ui/skeleton";

export const Form: FC<{
  on_init: (arg: { submit: any; reload: any }) => any;
  on_load: () => any;
  on_submit: (arg: { form: any; error: any }) => Promise<any>;
  body: any;
  form: FormHook;
  PassProp: any;
  cache: () => any;
  layout: "auto" | "1-col" | "2-col";
}> = ({
  on_init,
  on_load,
  body,
  form,
  PassProp,
  on_submit,
  cache,
  layout: _layout,
}) => {
  const form_hook = useForm<any>({
    defaultValues: {},
  });

  const local = useLocal({
    el: null as any,
    submit_timeout: null as any,
    layout: "unknown" as "unknown" | "2-col" | "1-col",
    init: false,
  });

  form.hook = form_hook;
  if (!form.cache && typeof cache === "function") {
    try {
      form.cache = cache() || {};
    } catch (e) {}
  }
  if (!form.cache) form.cache = {};

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
    local.submit_timeout = setTimeout(async () => {
      toast.loading(
        <>
          <Loader2 className="c-h-4 c-w-4 c-animate-spin" />
          Processing ...
        </>,
        {
          dismissible: true,
          className: css`
            background: #e4f7ff;
          `,
        }
      );
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

      await on_submit({
        form: data,
        error: form.hook.formState.errors,
      });
      toast.dismiss();

      if (Object.keys(form.hook.formState.errors).length > 0) {
        toast.error(
          <div className="c-flex c-text-red-600 c-items-center">
            <AlertTriangle className="c-h-4 c-w-4 c-mr-1" />
            Save Failed, please correct{" "}
            {Object.keys(form.hook.formState.errors).length} errors.
          </div>,
          {
            dismissible: true,
            className: css`
              background: #ffecec;
              border: 2px solid red;
            `,
          }
        );
      } else {
        toast.success(
          <div className="c-flex c-text-blue-700 c-items-center">
            <Check className="c-h-4 c-w-4 c-mr-1 " />
            Done
          </div>,
          {
            className: css`
              background: #e4f5ff;
              border: 2px solid blue;
            `,
          }
        );
      }
    }, 300);
  };

  if (!local.init) {
    local.init = true;
    on_init({
      submit,
      reload: () => {
        local.init = false;
        form.unload = () => {
          form.hook.clearErrors();
          form.hook.reset();
          delete form.unload;
          local.render();
        };
        local.render();
      },
    });
    const res = on_load();
    const loaded = (values: any) => {
      setTimeout(() => {
        toast.dismiss();
      });
      if (!!values) {
        for (const [k, v] of Object.entries(values)) {
          form.hook.setValue(k, v);
        }
      }
      local.render();
    };
    if (res instanceof Promise) {
      setTimeout(() => {
        if (!isEditor) {
          toast.loading(
            <>
              <Loader2 className="c-h-4 c-w-4 c-animate-spin" />
              Loading data...
            </>
          );
        }
        res.then(loaded);
      });
    } else {
      loaded(res);
    }
  }

  form.submit = submit;

  if (document.getElementsByClassName("prasi-toaster").length === 0) {
    const elemDiv = document.createElement("div");
    elemDiv.className = "prasi-toaster";
    document.body.appendChild(elemDiv);
  }
  const toaster_el = document.getElementsByClassName("prasi-toaster")[0];

  if (form.unload)
    return (
      <div className="c-p-6 c-flex c-flex-col c-space-y-2 c-w-full c-flex-1 c-items-start">
        <Skeleton className="c-h-3 c-w-[50%]" />
        <Skeleton className="c-h-3 c-w-[40%]" />
      </div>
    );

  return (
    <FormInternal {...form_hook} form={form}>
      {toaster_el && createPortal(<Toaster cn={cn} />, toaster_el)}
      <form
        className={
          "flex-1 flex flex-col w-full items-stretch relative overflow-auto"
        }
        ref={(el) => {
          if (el) form.ref = el;
        }}
        onSubmit={(e) => {
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
    </FormInternal>
  );
};

const FormInternal = (props: any) => {
  useEffect(() => {
    return () => {
      if (props.form && props.form.unload) {
        props.form.unload();
      }
    };
  }, []);
  return <FForm {...props} />;
};
