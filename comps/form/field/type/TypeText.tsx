import { FC } from "react";
import { FMLocal, FieldLocal } from "../../typings";
import { useLocal } from "@/utils/use-local";
import parser from "any-date-parser";

export type PropTypeText = {
  type: "text" | "password" | "number" | "date" | "datetime";
};

const parse = parser.exportAsFunctionAny("en-US");

export const FieldTypeText: FC<{
  field: FieldLocal;
  fm: FMLocal;
  prop: PropTypeText;
}> = ({ field, fm, prop }) => {
  const input = useLocal({});
  let value: any = fm.data[field.name];
  field.input = input;
  field.prop = prop;

  if (["date", "datetime"].includes(prop.type)) {
    if (typeof value === "string") {
      let date = parse(value);
      if (typeof date === "object" && date instanceof Date) {
        if (prop.type === "date") value = date.toISOString().substring(0, 10);
        else if (prop.type === "datetime") value = date.toISOString();
      }
    }
  }

  return (
    <>
      <input
        type={prop.type}
        onChange={(ev) => {
          fm.data[field.name] = ev.currentTarget.value;
          fm.render();
        }}
        value={value || ""}
        disabled={field.disabled}
        className="c-flex-1 c-bg-transparent c-outline-none c-px-2 c-text-sm c-w-full"
        spellCheck={false}
        onFocus={() => {
          field.focused = true;
          field.render();
        }}
        onBlur={() => {
          field.focused = false;
          field.render();
        }}
      />
    </>
  );
};
