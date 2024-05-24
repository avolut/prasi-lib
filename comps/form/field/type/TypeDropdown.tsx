import { FC, useEffect } from "react";
import { FMLocal, FieldLocal, FieldProp } from "../../typings";
import { useLocal } from "@/utils/use-local";
import { OptionItem, RawDropdown } from "../raw/Dropdown";
import { FieldLoading } from "../raw/FieldLoading";
import get from "lodash.get";

export const TypeDropdown: FC<{
  field: FieldLocal;
  fm: FMLocal;
  arg: FieldProp;
}> = ({ field, fm, arg }) => {
  const input = useLocal({
    list: null as null | any[],
    pk: "",
  });
  const value = fm.data[field.name];
  field.input = input;
  useEffect(() => {
    if (!isEditor && input.list === null) {
      field.status = "loading";
      input.pk = arg.pk;
      field.render();
      const callback = (arg: any[]) => {
        input.list = arg;
        field.status = "ready";
        input.render();
      };
      const res = arg.on_load();
      if (res instanceof Promise) res.then(callback);
      else callback(res);
    }
  }, []);

  let list: OptionItem[] = [];
  if (input.list && input.list.length) {
    input.list.map((e: any) => {
      let id = null;
      try {
        id = e[arg.pk];
      } catch (ex: any) {
        console.error(
          "Error: PK Invalid atau tidak ditemukan, cek lagi keys yang ingin dijadikan value"
        );
      }
      list.push({
        value: id,
        label: arg.on_row(e),
      });
    });
  }
  let selected = null;
  if (value && typeof value === "object") {
    if (input.pk) selected = value[input.pk];
  } else {
    selected = value;
  }
  console.log({selected})
  return (
    <>
      {field.status === "loading" ? (
        <FieldLoading />
      ) : (
        <RawDropdown
          options={list}
          value={selected}
          onChange={(val) => {
            if (val === null) {
              fm.data[field.name] = null;
              fm.render();
              return;
            }
            if (input.list && input.pk) {
              for (const item of input.list) {
                if (item[input.pk] === val) {
                  fm.data[field.name] = val;
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
