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
  modifiers?: any[];
}> = ({ filter, name, label, type, modifiers }) => {
  const internal = useLocal({
    render_timeout: null as any,
    search_timeout: null as any,
  });
  if (!name) return <>No Name</>;
  if (!filter.fm) return <div>Loading...</div>;

  const fm = filter.fm;
  filter.types[name] = type;

  const singleOptions = ["equal", "not_equal"];
  const multiOptions = ["includes", "excludes"];

  useEffect(() => {
    clearTimeout(internal.render_timeout);
    internal.render_timeout = setTimeout(() => {
      filter_window.prasiContext.render();
    }, 500);
  }, [fm]);

  let show_modifier = filter.mode !== "inline";
  const arg = {
    name: name || "",
    fm,
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
  };

  return (
    <BaseField
      fm={fm}
      label={label || name}
      name={name || ""}
      PassProp={filter.PassProp}
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
              <input
                type="search"
                value={field.fm?.data?.[name]}
                placeholder={field.field.label}
                onBlur={() => {
                  // clearTimeout(internal.search_timeout);
                  // filter.form?.submit();
                }}
                spellCheck={false}
                className="c-flex-1 c-transition-all c-bg-transparent c-outline-none c-px-2 c-text-sm c-w-full"
                onChange={(e) => {
                  field.fm.data[name] = e.currentTarget.value;
                  field.fm.render();
                  clearTimeout(internal.search_timeout);
                  if (!field.fm.data[name]) {
                    fm.submit();
                  } else {
                    internal.search_timeout = setTimeout(() => {
                      fm?.submit();
                    }, 1500);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    clearTimeout(internal.search_timeout);
                    fm?.submit();
                  }
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
                arg={arg}
                prop={{
                  type: "input",
                  sub_type: "text",
                }}
              />
            )}
            {type === "number" && (
              <>
                <FieldTypeInput
                  arg={arg}
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
                    arg={arg}
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
                  arg={arg}
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
                    arg={arg}
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
              <FieldCheckbox arg={arg} field={field.field} fm={field.fm} />
            )}
            {type === "options" && (
              <>
                {singleOptions.includes(filter.modifiers[name]) && (
                  <SingleOption arg={arg} {...field} />
                )}
                {multiOptions.includes(filter.modifiers[name]) && (
                  <MultiOption arg={arg} {...field} />
                )}
              </>
            )}
          </>
        );
      }}
    </BaseField>
  );
};
