import { useLocal } from "@/utils/use-local";
import { FC, useEffect } from "react";
import { FMLocal, FieldLocal } from "../../typings";
import { RawDropdown } from "../raw/Dropdown";
import { Loader2 } from "lucide-react";

export type PropTypeRelation = {
  type: "has-one" | "has-many";
  on_load: () => Promise<any[]>;
};
export const FieldTypeRelation: FC<{
  field: FieldLocal;
  fm: FMLocal;
  prop: PropTypeRelation;
}> = ({ field, fm, prop }) => {
  const input = useLocal({
    list: null as null | any[],
  });
  const value = fm.data[field.name];
  field.input = input;
  field.prop = prop;

  useEffect(() => {
    if (input.list === null) {
      field.status = "loading";
      field.render();
    }
  }, []);

  return (
    <>
      {field.status === "loading" ? (
        <div className="c-w-full c-h-full c-items-center c-flex c-px-2">
          <Loader2 className="c-h-4 c-w-4 c-animate-spin" />
        </div>
      ) : (
        <RawDropdown
          options={[{ label: "Halo", value: "halo" }]}
          value={"halo"}
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
