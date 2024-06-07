import { useLocal } from "@/utils/use-local";
import { Typeahead } from "lib/comps/ui/typeahead";
import { FC } from "react";
import { FMLocal, FieldLocal, FieldProp } from "../../typings";

export const FieldTag: FC<{
  field: FieldLocal;
  fm: FMLocal;
  arg: FieldProp;
}> = ({ field, fm, arg }) => {
  const local = useLocal({
    ref: null as any,
    focus: false as boolean,
    value: null as any,
  });
  let value: any = fm.data[field.name];

  return (
    <Typeahead
      value={value}
      onSelect={({ search, item }) => {
        return item?.value || search;
      }}
      allowNew
      focusOpen={false}
      placeholder={arg.placeholder}
      options={async () => {
        if (typeof arg.on_load === "function") return await arg.on_load({});;
        return [];
      }}
    />
  );
};
