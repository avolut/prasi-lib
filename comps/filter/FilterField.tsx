import { FC, useEffect } from "react";
import { BaseField } from "../form/base/BaseField";
import { FilterFieldType, FilterLocal, filter_window } from "./utils/types";
import { FieldTypeInput } from "../form/field/type/TypeInput";
import { FieldModifier } from "./FieldModifier";
import { useLocal } from "lib/utils/use-local";
import { FieldCheckbox } from "../form/field/type/TypeCheckbox";
import { SingleOption } from "../form/field/type/TypeSingleOption";
import { MultiOption } from "../form/field/type/TypeMultiOption";

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

  const singleOptions = ["equal", "not_equal"];
  const multiOptions = ["includes", "excludes"];

  useEffect(() => {
    clearTimeout(internal.render_timeout);
    internal.render_timeout = setTimeout(() => {
      filter_window.prasiContext.render();
    }, 500);
  }, [filter.form?.data[name]]);

  let show_modifier = filter.mode !== "inline";

  return (
    <BaseField
      {...filter.form.fieldProps({
        name: name || "",
        label: label || name || "",
        render: internal.render,
        prefix: show_modifier
          ? () => (
              <FieldModifier
                onChange={(modifier) => {
                  filter.modifiers[name] = modifier;
                  filter.render();
                  filter_window.prasiContext.render();
                }}
                modifier={filter.modifiers[name]}
                type={type}
              />
            )
          : undefined,
        onLoad() {
          return [{ label: "halo", value: "asda" }];
        },
        subType: singleOptions.includes(filter.modifiers[name])
          ? "dropdown"
          : "typeahead",
      })}
    >
      {(field) => {
        if (type === "search-all") {
          return (
            <div className={cx("search-all c-flex items-center")}>
              <div className="c-pl-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>
              <FieldTypeInput
                {...field}
                prop={{
                  type: "input",
                  sub_type: "search",
                  placeholder: "Search...",
                  onBlur(e) {
                    filter.form?.submit();
                  },
                }}
              />
            </div>
          );
        }

        return (
          <>
            {type === "text" && (
              <FieldTypeInput
                {...field}
                prop={{
                  type: "input",
                  sub_type: "text",
                }}
              />
            )}
            {type === "number" && (
              <>
                <FieldTypeInput
                  {...field}
                  field={{
                    ...field.field,
                    name:
                      filter.modifiers[name] === "between"
                        ? name
                        : `${name}_from`,
                  }}
                  prop={{
                    type: "input",
                    sub_type: "number",
                  }}
                />
                {filter.modifiers[name] === "between" && (
                  <FieldTypeInput
                    {...field}
                    field={{ ...field.field, name: `${name}_to` }}
                    prop={{
                      type: "input",
                      sub_type: "number",
                    }}
                  />
                )}
              </>
            )}
            {type === "date" && (
              <>
                <FieldTypeInput
                  {...field}
                  field={{
                    ...field.field,
                    name:
                      filter.modifiers[name] === "between"
                        ? name
                        : `${name}_from`,
                  }}
                  prop={{
                    type: "input",
                    sub_type: "date",
                  }}
                />
                {filter.modifiers[name] === "between" && (
                  <FieldTypeInput
                    {...field}
                    field={{ ...field.field, name: `${name}_to` }}
                    prop={{
                      type: "input",
                      sub_type: "date",
                    }}
                  />
                )}
              </>
            )}
            {type === "boolean" && (
              <FieldCheckbox
                arg={field.arg}
                field={field.field}
                fm={field.fm}
              />
            )}
            {type === "options" && (
              <>
                {singleOptions.includes(filter.modifiers[name]) && (
                  <SingleOption {...field} />
                )}
                {multiOptions.includes(filter.modifiers[name]) && (
                  <MultiOption {...field} />
                )}
              </>
            )}
          </>
        );
      }}
    </BaseField>
  );
};
