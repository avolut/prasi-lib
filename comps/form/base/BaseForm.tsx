import { ReactNode, useCallback, useEffect, useState } from "react";
import { BaseFormLocal, default_base_form_local } from "./types";
import { useLocal } from "lib/utils/use-local";
import { FieldLocal, FieldProp, fieldType } from "../typings";

export type BaseFormProps<T> = {
  data: T;
  className?: string;
  on_submit?: (form: BaseFormLocal<T>) => Promise<any> | any;
  children: ReactNode | ((form: BaseFormLocal<T>) => ReactNode);
  render?: () => void;
  is_form?: boolean;
};
export const BaseForm = <T extends Record<string, any>>(
  props: BaseFormProps<T>
) => {
  const { data, children, className, on_submit, render } = props;
  const form = useLocal({ ...default_base_form_local }) as BaseFormLocal<T>;

  if (render) {
    form.render = render;
  }

  form.submit = useCallback(async () => {
    console.log("CEK");
    if (form.status === "ready") {
      form.status = "submitting";
      form.render();
      console.log("CEK");
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

  form.createFm = () => {
    if (form.fm) {
      form.fm.data = form.data;
      return form.fm;
    }
    let size = "full";

    if (form.internal.width > 650) {
      size = "half";
    }
    form.fm = {
      data: form.data,
      props: { label_mode: "vertical" },
      error: {
        get: () => {
          return [];
        },
      },
      submit: () => on_submit?.(form),
      size: { field: size },
      render: form.render,
    } as any;
    return form.fm as any;
  };

  form.fieldProps = (arg) => {
    return {
      fm: form.createFm(),
      arg: form.createArg(arg),
      field: form.createField(arg),
    };
  };

  useEffect(() => {
    form.data = data;
    form.render();

    if (form.internal.width === 0) {
      setTimeout(() => {
        form.render();
      }, 1000);
    }
  }, [data]);

  if (form.status === "init") {
    form.status = "ready";
  }

  if (typeof props.is_form === "boolean") {
    if (!props.is_form) {
      return (
        <div
          className={cx(
            "form c-flex-1 c-flex-col c-w-full c-h-full c-relative c-overflow-auto c-contents",
            className
          )}
        >
          <div
            className={cx(
              "form-inner c-flex-1 c-flex-wrap c-items-start c-content-start c-absolute c-inset-0 c-contents",
              css`
                padding-right: 10px;
              `
            )}
          >
            {typeof children === "function" ? children(form) : children}
          </div>
        </div>
      );
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
      className={cx(
        "form c-flex-1 c-flex c-flex-col c-w-full c-h-full c-relative c-overflow-auto",
        className
      )}
    >
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
    </form>
  );
};
