import { sortTree } from "@/comps/list/utils/sort-tree";
import { useLocal } from "@/utils/use-local";
import { FC, useEffect } from "react";
import { FMLocal, FieldLocal } from "../../typings";
// import { OptionItem, RawDropdown } from "../raw/Dropdown";
import { FieldLoading } from "../../../ui/field-loading";

export type PropTypeRelation = {
  type: "has-one" | "has-many";
  on_load: (opt: { value?: any }) => Promise<{ items: any[]; pk: string }>;
  label: (item: any, pk: string) => string;
  id_parent: string;
  has_many: "checkbox" | "typeahead";
  has_many_list: (opt: {
    value?: any;
  }) => Promise<{ value: string; label: string }[]>;
};
export const FieldTypeRelation: FC<{
  field: FieldLocal;
  fm: FMLocal;
  prop: PropTypeRelation;
  PassProp: any;
  child: any;
}> = (props) => {
  if (props.prop.type === "has-one") return <HasOne {...props} />;
  return <HasMany {...props} />;
};

const HasMany: FC<{
  field: FieldLocal;
  fm: FMLocal;
  prop: PropTypeRelation;
  PassProp: any;
  child: any;
}> = ({ field, fm, prop, PassProp, child }) => {
  const input = useLocal({
    list: null as null | any[],
    many: [] as { value: string; label: string }[],
    pk: "",
  });
  const name = field.name;
  const value = fm.data[name];
  field.input = input;
  field.prop = prop;

  useEffect(() => {
    if (!isEditor && input.list === null) {
      field.status = "loading";
      field.render();

      const callback = (arg: { items: any[]; pk: string }) => {
        input.list = arg.items;
        input.pk = arg.pk;
        field.status = "ready";
        input.render();
      };
      const res = prop.on_load({ field });
      if (res instanceof Promise) res.then(callback);
      else callback(res);

      const many_list_loaded = (arg: { value: string; label: string }[]) => {
        input.many = arg;
        input.render();
      };
      const many_res = prop.has_many_list({ value });
      if (res instanceof Promise) many_res.then(many_list_loaded);
      else many_list_loaded(res);
    }
  }, []);

  if (isEditor) {
    input.many = [
      { value: "sample 1", label: "sample 1" },
      { value: "sample 2", label: "sample 2" },
    ];
  }

  return (
    <div className="c-flex c-flex-col c-p-2 c-items-stretch">
      {input.many.map((e, idx) => {
        return (
          <label key={idx} className="c-flex c-items-center c-space-x-1">
            <input type="checkbox" value={e.value} />
            <div className="c-flex-1">{e.label}</div>
          </label>
        );
      })}
    </div>
  );
};

const HasOne: FC<{
  field: FieldLocal;
  fm: FMLocal;
  prop: PropTypeRelation;
  PassProp: any;
  child: any;
}> = ({ field, fm, prop, PassProp, child }) => {
  return <>1223</>
  // const input = useLocal({
  //   list: null as null | any[],
  //   pk: "",
  // });
  // const name = field.name;
  // const value = fm.data[name];
  // field.input = input;
  // field.prop = prop;

  // useEffect(() => {
  //   if (!isEditor && input.list === null) {
  //     field.status = "loading";
  //     field.render();

  //     const callback = (arg: { items: any[]; pk: string }) => {
  //       input.list = arg.items;
  //       input.pk = arg.pk;
  //       field.status = "ready";
  //       input.render();
  //     };
  //     const res = prop.on_load({ value });
  //     if (res instanceof Promise) res.then(callback);
  //     else callback(res);
  //   }
  // }, []);

  // let list: OptionItem[] = [];
  // if (input.list && input.pk && input.list.length) {
  //   if (fm.field_def[name]?.optional) {
  //     list.push({
  //       value: null,
  //       label: "-",
  //     });
  //   }

  //   let sorted = input.list;
  //   if (prop.id_parent && input.pk) {
  //     sorted = sortTree(sorted, prop.id_parent, input.pk);
  //   }

  //   for (const item of sorted) {
  //     if (typeof item !== "object") continue;
  //     let label = "";

  //     if (typeof prop.label === "function") {
  //       label = prop.label(item, input.pk);

  //       if (!label) {
  //         const label_arr: string[] = [];

  //         for (const [k, v] of Object.entries(item)) {
  //           if (k !== input.pk) label_arr.push(v as any);
  //         }
  //         label = label_arr.join(" ");
  //       }
  //     } else {
  //       const label_arr: string[] = [];

  //       for (const [k, v] of Object.entries(item)) {
  //         if (k !== input.pk) label_arr.push(v as any);
  //       }
  //       label = label_arr.join(" ");
  //     }

  //     list.push({
  //       value: item[input.pk],
  //       label,
  //       el: <PassProp item={item}>{child}</PassProp>,
  //     });
  //   }
  // }

  // let selected = null;
  // if (value && typeof value === "object") {
  //   if (input.pk) selected = value[input.pk];
  // } else {
  //   selected = value;
  // }

  // return (
  //   <>
  //     {field.status === "loading" ? (
  //       <FieldLoading />
  //     ) : (
  //       <RawDropdown
  //         options={list}
  //         value={selected}
  //         onChange={(val) => {
  //           if (val === null) {
  //             fm.data[name] = null;
  //             fm.render();
  //             return;
  //           }
  //           if (input.list && input.pk) {
  //             for (const item of input.list) {
  //               if (item[input.pk] === val) {
  //                 fm.data[name] = item;
  //                 fm.render();
  //                 break;
  //               }
  //             }
  //           }
  //         }}
  //         className="c-flex-1 c-bg-transparent c-outline-none c-px-2 c-text-sm c-w-full c-h-full"
  //         disabled={field.disabled}
  //         onFocus={() => {
  //           field.focused = true;
  //           field.render();
  //         }}
  //         onBlur={() => {
  //           field.focused = false;
  //           field.render();
  //         }}
  //       />
  //     )}
  //   </>
  // );
};
