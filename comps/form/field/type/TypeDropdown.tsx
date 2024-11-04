import { useLocal } from "lib/utils/use-local";
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

  const reload = async (callback?: () => void) => {
    if (typeof arg.on_load === "function") {
      local.loaded = false;
      local.render();
      let options: any = null;
      options = arg.on_load({ field });
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
            let v =
              typeof arg.opt_get_value === "function"
                ? arg.opt_get_value({
                    fm,
                    name: field.name,
                    options: local.options,
                    type: field.type,
                  })
                : fm.data[field.name];
            if (field.type === "single-option") {
              let f = list.find((ex: any) => ex.value === v);

              if (!f) {
                arg.opt_set_value({
                  fm,
                  name: field.name,
                  type: field.type,
                  options: local.options,
                  selected: [],
                });
              }
            }
            local.options = list;
          } else {
            local.options = res;
          }
          local.render();

          value =
            typeof arg.opt_get_value === "function"
              ? arg.opt_get_value({
                  fm,
                  name: field.name,
                  options: local.options,
                  type: field.type,
                })
              : fm.data[field.name];

          if (field.type === "single-option") {
            if (!value && local.options.length > 0) {
              arg.opt_set_value({
                fm,
                name: field.name,
                type: field.type,
                options: local.options,
                selected: [local.options[0]?.value],
              });
            } else if (value) {
              arg.opt_set_value({
                fm,
                name: field.name,
                type: field.type,
                options: local.options,
                selected: [value],
              });
            }
          }

          local.loaded = true;
          local.render();
          callback?.();
        });
      } else {
        local.loaded = true;
        local.options = Array.isArray(options) ? options : ([] as any);
        local.render();
        callback?.();
      }
    }
  };
  field.reload_options = () => {
    return new Promise((done) => {
      reload(done);
    });
  };

  useEffect(() => {
    if (isEditor) {
      local.loaded = true;
      local.render();
      return;
    }
    reload();
  }, []);

  useEffect(() => {
    if (fm.save_status === 'saved') { 
      reload();
    }
  }, [fm.save_status]);

  let value =
    typeof arg.opt_get_value === "function"
      ? arg.opt_get_value({
          fm,
          name: field.name,
          options: local.options,
          type: field.type,
        })
      : fm.data[field.name];

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
            padding-top: 4px;
            padding-bottom: 4px;
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
  const disabled =
    typeof field.disabled === "function" ? field.disabled() : field.disabled;
  const disabled_search =
    typeof field.disabled_search === "function"
      ? field.disabled_search()
      : typeof field.disabled_search === "string"
      ? field.disabled_search === "n"
        ? true
        : false
      : field.disabled_search;
  if (!local.loaded) return <FieldLoading />;

  if (field.type === "single-option") {
    if (value === null) {
      fm.data[field.name] = undefined;
    }
    const typeahead_val = (Array.isArray(value) ? value : [value]).filter(
      (e) => e
    );

    return (
      <>
        <Typeahead
          value={typeahead_val}
          disabledSearch={disabled_search ? true : false}
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
          disabled={disabled}
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
        disabled={disabled}
        placeholder={arg.placeholder}
        options={() => {
          return local.options;
        }}
      />
    </>
  );
};
