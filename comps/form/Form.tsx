import { Form as FForm } from "@/comps/ui/form";
import { useLocal } from "@/utils/use-local";
import { FC } from "react";
import { useForm } from "react-hook-form";

export const Form: FC<{
  on_load: () => any;
  on_submit: (arg: { form: any; error: any }) => any;
  body: any;
  form: { hook: any; render: () => void };
  PassProp: any;
  layout: "auto" | "1-col" | "2-col";
}> = ({ on_load, body, form, PassProp, on_submit, layout: _layout }) => {
  const form_hook = useForm<any>({
    defaultValues: on_load,
  });

  const local = useLocal({
    el: null as any,
    layout: "unknown" as "unknown" | "2-col" | "1-col",
  });

  form.hook = form_hook;

  let layout = _layout || "auto";
  if (layout !== "auto") local.layout = layout;

  return (
    <FForm {...form_hook}>
      <form
        className={
          "flex-1 flex flex-col w-full items-stretch relative overflow-auto"
        }
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          on_submit({ form: form.hook.getValues(), error: {} });
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
          <PassProp
            submit={() => {
              on_submit({ form: form.hook.getValues(), error: {} });
            }}
          >
            {body}
          </PassProp>
        </div>
      </form>
    </FForm>
  );
};
