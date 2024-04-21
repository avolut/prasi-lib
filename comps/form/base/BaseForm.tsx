import { useLocal } from "@/utils/use-local";
import { FC } from "react";
import { BaseField } from "./BaseField";
import { initSimpleForm as initBaseForm } from "./utils/init";
import { BaseFieldProps, BaseFormProps } from "./utils/type/field";

type Children<T extends Record<string, any>> = Exclude<
  BaseFormProps<T>["children"],
  undefined
>;

export const BaseForm = <T extends Record<string, any>>(
  arg: BaseFormProps<T>
) => {
  const fm = useLocal<FMInternal>({ status: "init" } as any);
  const local = useLocal({
    Field: null as null | FC<BaseFieldProps<T>>,
    children: null as unknown as Children<T>,
  });

  if (fm.status === "init") {
    local.Field = (props) => {
      return <BaseField fm={fm} {...props} />;
    };
    if (arg.children) local.children = arg.children;
    else {
      local.children = ({ Field }) => {
        const data = Object.entries(fm.data);
        return (
          <>
            {data.map(([key, value]) => {
              return <Field name={key} />;
            })}
          </>
        );
      };
    }
    initBaseForm(fm, arg);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        fm.submit();
      }}
    >
      {local.Field && local.children({ Field: local.Field })}
    </form>
  );
};
