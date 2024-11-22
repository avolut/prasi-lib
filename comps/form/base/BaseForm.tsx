import { useLocal } from "lib/utils/use-local";
import { ReactNode, useCallback, useEffect, useRef } from "react";
import { FieldLocal, FieldProp, FMLocal } from "../typings";
import { BaseFormLocal, default_base_form_local } from "./types";
import { FieldLoading } from "lib/comps/ui/field-loading";
import { editorFormWidth } from "../Form";
import { ConsoleLogWriter } from "drizzle-orm";

export type BaseFormProps<T> = {
  data: T;
  className?: string;
  on_submit?: (form: BaseFormLocal<T>) => Promise<any> | any;
  children: ReactNode | ((form: BaseFormLocal<T>) => ReactNode);
  render?: () => void;
  on_change?: (fm: FMLocal, name: string, new_value: any) => any;
  is_form?: boolean;
  name: string;
};
export const BaseForm = <T extends Record<string, any>>(
  props: BaseFormProps<T>
) => {
  const { data, children, className, on_submit, render, on_change } = props;
  const form = useLocal({
    ...default_base_form_local,
  }) as BaseFormLocal<T>;

  if (render) {
    form.render = render;
  }

  form.submit = useCallback(async () => {
    if (form.status === "ready") {
      form.status = "submitting";
      form.render();
      const result = await on_submit?.(form);

      setTimeout(() => {
        form.status = "ready";
        form.render();
      }, 1000);

      return result;
    }
  }, [on_submit]);

  form.createArg = (arg) => {
    const prop: FieldProp = {
      name: arg.name,
      on_load: arg.onLoad,
      sub_type: arg.subType,
    } as any;
    if (arg.onChange) prop.on_change = arg.onChange;
    return prop;
  };

  form.createField = (arg) => {
    if (form.fields[arg.name]) return form.fields[arg.name];

    if (form.fm) form.fm.fields = form.fields;
    const prop: FieldLocal = {
      name: arg.name,
      label: typeof arg.label !== "undefined" ? arg.label : arg.name,
      render: arg.render || form.render,
      width: "auto",
      prefix: arg.prefix,
    } as any;
    form.fields[arg.name] = prop;
    return prop;
  };

  form.createFm = useCallback(() => {
    if (form.fm) {
      form.fm.data = data;
      return form.fm;
    }
    let size = "full";

    if (form.internal.width > 650) {
      size = "half";
    }
    form.fm = {
      data: data,
      status: "ready",
      deps: {},
      props: { label_mode: "vertical" },
      error: {
        get: () => {
          return [];
        },
      },
      events: {
        on_change: (n: any, v: any) => {
          if (on_change && form.fm) {
            on_change(form.fm, n, v);
          }
        },
      },
      submit: () => on_submit?.(form),
      size: { field: size },
      render: form.render,
    } as any;
    return form.fm as any;
  }, [data]);

  form.fieldProps = (arg) => {
    return {
      fm: form.createFm(),
      arg: form.createArg(arg),
      field: form.createField(arg),
    };
  };

  const ref = useRef({
    el: null as null | HTMLFormElement,
    timer: null as any,
    rob: new ResizeObserver(async ([e]) => {
      let fm = form.fm;
      if (!fm) {
        if (ref.current.timer) {
          return;
        }
        ref.current.timer = await new Promise<void>((done) => {
          const ival = setInterval(() => {
            if (form.fm) {
              ref.current.timer = null;
              clearInterval(ival);
              done();
            }
          }, 100);
        });
        fm = form.fm;
      }

      if (e.contentRect.width > 0 && fm) {
        fm.size.height = e.contentRect.height;
        fm.size.width = e.contentRect.width;

        // if (fm.status === "ready" && !isEditor) fm.status = "resizing";

        if (fm.props.layout === "auto" || !fm.props.layout) {
          if (fm.size.width > 650) {
            fm.size.field = "half";
          } else {
            fm.size.field = "full";
          }
        } else {
          if (fm.props.layout === "1-col") fm.size.field = "full";
          if (fm.props.layout === "2-col") fm.size.field = "half";
        }

        if (isEditor) {
          editorFormWidth[props.name] = {
            w: fm.size.width,
            f: fm.size.field,
          };
        }
        fm.status = "ready";

        fm.render();
      }
    }),
  });

  useEffect(() => {
    if (form.internal.width === 0) {
      setTimeout(() => {
        form.render();
      }, 1000);
    }
  }, [data]);

  if (form.status === "init") {
    form.status = "ready";
  }

  if (!form.fm) {
    form.fm = form.createFm();
  }
  const fm = form.fm;

  if (typeof props.is_form === "boolean") {
    if (!props.is_form) {
      if (!form.fm.data) return <FieldLoading />;
      return <>{typeof children === "function" ? children(form) : children}</>;
    }
  }

  if (form.internal.width === 0) {
    if (form.internal.init_render > 30) {
      return <>Failed to render BaseForm</>;
    }
    setTimeout(() => {
      form.internal.init_render++;
      form.render();
    }, 50);
  }
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.submit();
      }}
      ref={(el) => {
        if (el) {
          if (!ref.current.el && fm && fm?.status !== "resizing") {
            ref.current.el = el;
            ref.current.rob.observe(el);
            if (fm.status === "ready") {
              fm.status = "resizing";
              fm.render();
            }
          }
        }
      }}
      className={cx(
        "form c-flex-1 c-flex c-flex-col c-w-full c-h-full c-relative c-overflow-auto",
        className
      )}
    >
      {fm?.status === "ready" && (
        <>
          <div
            className={cx(
              "form-inner c-flex-1 c-flex c-flex-row c-flex-wrap c-items-start c-content-start c-absolute c-inset-0",
              css`
                padding-right: 10px;
              `
            )}
            ref={(el) => {
              if (el?.offsetWidth) {
                form.internal.width = el?.offsetWidth;
                form.createFm();
              }
            }}
          >
            {form.internal.width > 0 && (
              <>{typeof children === "function" ? children(form) : children}</>
            )}
          </div>
        </>
      )}
    </form>
  );
};
