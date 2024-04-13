import { FC } from "react";
import { FMLocal, FieldLocal } from "../../typings";
import { useLocal } from "@/utils/use-local";

export type PropTypeText = {
  type: "text" | "password" | "number";
};

export const FieldTypeText: FC<{
  field: FieldLocal;
  fm: FMLocal;
  prop: PropTypeText;
}> = ({ field, fm, prop }) => {
  const input = useLocal({});
  const value = fm.data[field.name];
  field.input = input;
  field.prop = prop;

  return (
    <input
      type={prop.type}
      onChange={(ev) => {
        fm.data[field.name] = ev.currentTarget.value;
        fm.render();
      }}
      value={value || ""}
      disabled={field.disabled}
      className="c-flex-1 c-bg-transparent c-outline-none c-px-2 c-text-sm"
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
  );
};
