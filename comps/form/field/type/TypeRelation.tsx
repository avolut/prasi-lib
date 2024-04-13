import { useLocal } from "@/utils/use-local";
import { FC } from "react";
import { FMLocal, FieldLocal } from "../../typings";
import { RawDropdown } from "../raw/Dropdown";

export type PropTypeRelation = {
  type: "has-one" | "has-many";
};
export const FieldTypeRelation: FC<{
  field: FieldLocal;
  fm: FMLocal;
  prop: PropTypeRelation;
}> = ({ field, fm, prop }) => {
  const input = useLocal({});
  const value = fm.data[field.name];
  field.input = input;
  field.prop = prop;

  return (
    <>
      <RawDropdown
        options={[{ label: "Halo", value: "halo" }]}
        value={"halo"}
        className="c-flex-1 c-bg-transparent c-outline-none c-px-2 c-text-sm c-w-full c-h-full"
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
