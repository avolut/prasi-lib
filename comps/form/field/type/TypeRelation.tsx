import { useLocal } from "@/utils/use-local";
import { FC, useEffect } from "react";
import { FMLocal, FieldLocal } from "../../typings";
import { OptionItem, RawDropdown } from "../raw/Dropdown";
import { FieldLoading } from "../raw/FieldLoading";

export type PropTypeRelation = {
  type: "has-one" | "has-many";
  on_load: (opt: { value?: any }) => Promise<{ items: any[]; pk: string }>;
};
export const FieldTypeRelation: FC<{
  field: FieldLocal;
  fm: FMLocal;
  prop: PropTypeRelation;
  PassProp: any;
  child: any;
}> = ({ field, fm, prop, PassProp, child }) => {
  const input = useLocal({
    list: null as null | any[],
    pk: "",
  });
  const value = fm.data[field.name];
  field.input = input;
  field.prop = prop;

  useEffect(() => {
    if (input.list === null) {
      field.status = "loading";
      field.render();

      const callback = (arg: { items: any[]; pk: string }) => {
        input.list = arg.items;
        input.pk = arg.pk;
        field.status = "ready";
        input.render();
      };
      const res = prop.on_load({});
      if (res instanceof Promise) res.then(callback);
      else callback(res);
    }
  }, []);

  let list: OptionItem[] = [];
  if (input.list && input.pk && input.list.length) {
    for (const item of input.list) {
      if (typeof item !== "object") continue;
      const label: string[] = [];

      for (const [k, v] of Object.entries(item)) {
        if (k !== input.pk) label.push(v as any);
      }

      list.push({
        value: item[input.pk],
        label: label.join(" "),
        el: <PassProp item={item}>{child}</PassProp>,
      });
    }
  }

  let selected = null;
  if (typeof value === "object") {
    if (input.pk) selected = value[input.pk];
  } else {
    selected = value;
  }

  return (
    <>
      {field.status === "loading" ? (
        <FieldLoading />
      ) : (
        <RawDropdown
          options={list}
          value={selected}
          onChange={(val) => {
            if (input.list && input.pk) {
              for (const item of input.list) {
                if (item[input.pk] === val) {
                  fm.data[field.name] = item;
                  fm.render();
                  break;
                }
              }
            }
          }}
          className="c-flex-1 c-bg-transparent c-outline-none c-px-2 c-text-sm c-w-full c-h-full"
          disabled={field.disabled}
          onFocus={() => {
            field.focused = true;
            field.render();
          }}
          onBlur={() => {
            field.focused = false;
            field.render();
          }}
        />
      )}
    </>
  );
};
