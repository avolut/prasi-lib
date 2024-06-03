import { FC, useEffect } from "react";
import { BaseField } from "../form/base/BaseField";
import { FilterFieldType, FilterLocal, filter_window } from "./utils/types";
import { FieldTypeText } from "../form/field/type/TypeText";
import { FieldModifier } from "./FieldModifier";
import { useLocal } from "lib/utils/use-local";
import { FieldCheckbox } from "../form/field/type/TypeCheckbox";
import { SingleOption } from "../form/field/type/TypeSingleOption";

export const FilterField: FC<{
  filter: FilterLocal;
  name?: string;
  label?: string;
  type: FilterFieldType;
}> = ({ filter, name, label, type }) => {
  const internal = useLocal({ render_timeout: null as any });
  if (!name) return <>No Name</>;
  if (!filter.form) return <div>Loading...</div>;

  filter.types[name] = type;

  useEffect(() => {
    clearTimeout(internal.render_timeout);
    internal.render_timeout = setTimeout(() => {
      filter_window.prasiContext.render();
    }, 500);
  }, [filter.form?.data[name]]);

  return (
    <BaseField
      {...filter.form.fieldProps({
        name: name || "",
        label: label || name || "",
        render: internal.render,
        prefix: () => (
          <FieldModifier
            onChange={(modifier) => {
              filter.modifiers[name] = modifier;
              filter.render();
              filter_window.prasiContext.render();
            }}
            modifier={filter.modifiers[name]}
            type={type}
          />
        ),
        onLoad() {
          return [{ label: 'halo', 'value': 'asda' }]
        },
        subType: "dropdown"
      })}
    >
      {(field) => (
        <>
          {type === "text" && (
            <FieldTypeText
              {...field}
              prop={{
                type: "text",
                sub_type: "text",
                prefix: "",
                suffix: "",
              }}
            />
          )}
          {type === "number" && (
            <FieldTypeText
              {...field}
              prop={{
                type: "text",
                sub_type: "number",
                prefix: "",
                suffix: "",
              }}
            />
          )}
          {type === "date" && (
            <>
              <FieldTypeText
                {...field}
                prop={{
                  type: "text",
                  sub_type: "date",
                  prefix: "",
                  suffix: "",
                }}
              />
              {filter.modifiers[name] === 'between' && (
                <FieldTypeText
                  {...field}
                  prop={{
                    type: "text",
                    sub_type: "date",
                    prefix: "",
                    suffix: "",
                  }}
                />
              )}
            </>
          )}
          {type === "boolean" && (
            <FieldCheckbox arg={field.arg} field={field.field} fm={field.fm} />
          )}
          {type === "options" && (
            <p>Haloha</p>
          )}
        </>
      )}
    </BaseField >
  );
};
