import { useLocal } from "@/utils/use-local";
import { FieldLoading } from "lib/comps/ui/field-loading";
import { Typeahead } from "lib/comps/ui/typeahead";
import { FC, useEffect } from "react";
import { FMLocal, FieldLocal, FieldProp } from "../../typings";

export const TypeDropdown: FC<{
  field: FieldLocal;
  fm: FMLocal;
  arg: FieldProp;
}> = ({ field, fm, arg }) => {
  const local = useLocal({
    loaded: false,
    options: [] as { value: string; label: string; data: any }[],
  });
  let value =
    typeof arg.opt_get_value === "function"
      ? arg.opt_get_value({
          fm,
          name: field.name,
          options: local.options,
          type: field.type,
        })
      : fm.data[field.name];

  useEffect(() => {
    if (typeof arg.on_load === "function") {
      const options = arg.on_load({});
      if (options instanceof Promise) {
        options.then((res) => {
          if (Array.isArray(res)) {
            const list: any = res.map((e: any, idx: number) => {
              return {
                label: arg.opt_get_label(e, "list", {
                  prev: res[idx - 1],
                  next: res[idx + 1],
                }),
                tag: arg.opt_get_label(e, "label"),
                value: e.value,
                data: e.data,
              };
            });
            local.options = list;
          } else {
            local.options = res;
          }
          if (
            field.type === "single-option" &&
            !value &&
            field.required &&
            local.options.length > 0
          ) {
            arg.opt_set_value({
              fm,
              name: field.name,
              type: field.type,
              options: local.options,
              selected: [local.options[0]?.value],
            });
          } else if (field.type === "single-option" && value) {
            arg.opt_set_value({
              fm,
              name: field.name,
              type: field.type,
              options: local.options,
              selected: [value],
            });
          }

          local.loaded = true;
          local.render();
        });
      } else {
        local.loaded = true;
        local.options = Array.isArray(options) ? options : ([] as any);
        local.render();
      }
    }
  }, []);
  let popupClassName = "";

  if (arg.__props) {
    const { rel__feature, rel__id_parent } = arg.__props;
    if (
      typeof rel__feature !== "undefined" &&
      Array.isArray(rel__feature) &&
      rel__feature.includes("tree") &&
      typeof rel__id_parent === "string" &&
      rel__id_parent
    ) {
      popupClassName = cx(
        css`
          .opt-item {
            padding-top: 0px;
            padding-bottom: 0px;
            line-height: 15px;
            font-size: 12px;
            border: 0px;
            white-space: pre-wrap;
            font-family: monospace;
          }
        `,
        "c-font-mono"
      );
    }
  }

  if (!local.loaded) return <FieldLoading />;
  if (field.type === "single-option") {
    if (value === null) {
      fm.data[field.name] = undefined;
    }

    return (
      <>
        <Typeahead
          value={Array.isArray(value) ? value : [value]}
          popupClassName={popupClassName}
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
      </>
    );
  }

  return (
    <>
      <Typeahead
        value={value}
        onSelect={({ search, item }) => {
          return item?.value || search;
        }}
        note="dropdown"
        popupClassName={popupClassName}
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
