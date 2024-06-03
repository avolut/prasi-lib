import { useLocal } from "@/utils/use-local";
import { FC, useEffect } from "react";
import { FMLocal, FieldLocal, FieldProp } from "../../typings";
import { FieldLoading } from "lib/comps/ui/field-loading";
import { Typeahead } from "lib/comps/ui/typeahead";

export const TypeDropdown: FC<{
  field: FieldLocal;
  fm: FMLocal;
  arg: FieldProp;
}> = ({ field, fm, arg }) => {
  const local = useLocal({
    loaded: false,
    options: [],
  });
  let value = typeof arg.opt_get_value === "function" ? arg.opt_get_value({
    fm,
    name: field.name,
    options: local.options,
    type: field.type,
  }) : fm.data[field.name];;
  useEffect(() => {
    if (typeof arg.on_load === "function") {
      const options = arg.on_load({});
      if (options instanceof Promise) {
        options.then((res) => {
          if (Array.isArray(res)) {
            const list: any = res.map((e: any) => {
              return {
                label: arg.opt_get_label(e),
                value: e.value,
              };
            });
            local.options = list;
          } else {
            local.options = res;
          }
          local.loaded = true;
          local.render();
        });
      } else {
        local.loaded = true;
        local.options = [];
        local.render();
      }
    }
  }, []);
  if (!local.loaded) return <FieldLoading />;
  if (field.type === "single-option")
    return (
      <Typeahead
        value={value}
        onSelect={({ search, item }) => {
          if (item) {
            arg.opt_set_value({
              fm,
              name: field.name,
              type: field.type,
              options: local.options,
              selected: [item.value],
            });
          }
          return item?.value || search;
        }}
        allowNew={false}
        autoPopupWidth={true}
        focusOpen={true}
        mode={"single"}
        placeholder={arg.placeholder}
        options={() => {
          return local.options;
        }}
      />
    );

  return (
    <>
      <Typeahead
        value={value}
        onSelect={({ search, item }) => {
          return item?.value || search;
        }}
        onChange={(values) => {
          arg.opt_set_value({
            fm,
            name: field.name,
            type: field.type,
            options: local.options,
            selected: values,
          });
        }}
        allowNew={false}
        autoPopupWidth={true}
        focusOpen={true}
        mode={"multi"}
        placeholder={arg.placeholder}
        options={() => {
          return local.options;
        }}
      />
    </>
  );
};
