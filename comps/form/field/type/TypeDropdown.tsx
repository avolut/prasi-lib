import { useLocal } from "@/utils/use-local";
import { FC, useEffect } from "react";
import { Typeahead } from "../../../../..";
import { FMLocal, FieldLocal, FieldProp } from "../../typings";
import { FieldLoading } from "lib/comps/ui/field-loading";

export const TypeDropdown: FC<{
  field: FieldLocal;
  fm: FMLocal;
  arg: FieldProp;
}> = ({ field, fm, arg }) => {
  const local = useLocal({
    loaded: false,
    options: [],
  });
  let value = arg.opt_get_value({
    fm,
    name: field.name,
    options: local.options,
    type: field.type,
  });
  console.log({ value });
  useEffect(() => {
    if (typeof arg.on_load === "function") {
      const options = arg.on_load({ mode: "query" });
      console.log("Masuk");
      // console.log(options)
      if (options instanceof Promise) {
        options.then((res) => {
          console.log({ res });
          local.options = res;
          local.loaded = true;
          local.render();
        });
      } else {
        local.options = options;
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
  );
};
