import { ReactNode, useCallback, useEffect, useState } from "react";
import { BaseFormLocal, default_base_form_local } from "./types";
import { useLocal } from "lib/utils/use-local";
import { FieldLocal, FieldProp } from "../typings";

export type BaseFormProps<T> = {
  data: T;
  className?: string;
  on_submit?: (form: BaseFormLocal<T>) => Promise<any> | any;
  children: ReactNode | ((form: BaseFormLocal<T>) => ReactNode);
  render?: () => void;
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
      sub_type: arg.subType
    } as any;
    if (arg.onChange) prop.on_change = arg.onChange;
    return prop;
  };

  form.createField = (arg) => {
    const prop: FieldLocal = {
      name: arg.name,
      label: typeof arg.label !== "undefined" ? arg.label : arg.name,
      render: arg.render || form.render,
      width: "auto",
      prefix: arg.prefix,
    } as any;
    return prop;
  };

  form.createFm = () => {
    return {
      data: form.data,
      props: { label_mode: "vertical" },
      error: {
        get: () => {
          return [];
        },
      },
      size: { field: "full" },
      render: form.render,
    } as any;
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
  }, [data]);

  if (form.status === "init") {
    form.status = "ready";
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.submit();
      }}
      className={cx(
        "form c-flex-1 c-flex-col c-w-full c-h-full c-relative c-overflow-auto",
        className
      )}
    >
      <div
        className={cx(
          "form-inner c-flex c-flex-1 c-flex-wrap c-items-start c-content-start c-absolute c-inset-0",
          css`
            padding-right: 10px;
          `
        )}
      >
        {typeof children === "function" ? children(form) : children}
      </div>
    </form>
  );
};