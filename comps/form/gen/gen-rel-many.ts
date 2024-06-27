import { generateSelect } from "lib/comps/md/gen/md-select";
import get from "lodash.get";
import { on_load_rel } from "./on_load_rel";

export const genRelMany = (prop: {
  table_parent: string;
  arg: any;
  rel: any;
}) => {
  const { table_parent, arg, rel } = prop;
  const parent = rel.find((e: any) => e.name === table_parent);
  const master = rel.find(
    (e: any) => e.name !== table_parent && e.type === "has-one"
  );
  const result = {} as Record<string, any>;
  // select master
  if (master) {
    const select = generateSelect(master.relation.fields);

    console.log(master);
    result.on_load = on_load_rel({
      pk: select.pk,
      table: master.name,
      select: select.select,
      pks: {},
      type: "typeahead",
    });
    const pk_master = master.relation.fields.find((e: any) => get(e, "is_pk"));
    const get_value = `\
    (arg: {
      options: { label: string; value: string; item?: string }[];
      fm: FMLocal;
      name: string;
      type: string;
    }) => {
      const { options, fm, name, type } = arg;
      if (isEditor) {
        return fm.data[name];
      }
      let result = null;
      result = fm.data[name];
      switch (type) {
        case "single-option":
          try {
            const data = fm.data[name];
            if (typeof data === "object") {
              if (typeof data?.connect?.id !== "undefined") {
                result = data.connect.id;
              }else if (typeof data?.id !== "undefined") {
                result = data.id;
              }
            }
          } catch (ex) { }
          break;
        case "multi-option":
          const selected = [];
          const data = fm.data[name];
          if (Array.isArray(data) && data.length) {
            data.map((e) => {
              try {
                if (typeof e === "object") {
                  if (typeof e["${master.name}"].connect?.${pk_master.name} === "string") {
                    selected.push(e["${master.name}"].connect.${pk_master.name});
                  } else if (typeof e["${master.name}"]?.${pk_master.name} === "string") {
                    selected.push(e["${master.name}"].${pk_master.name});
                  }
                }
              } catch (ex) { }
            })
          }
          return selected;
          break;
      }
      return result;
    }
    `;
    const set_value = `\
    (arg: {
      selected: any[];
      options: { label: string; value: string; item?: string }[];
      fm: FMLocal;
      name: string;
      type: string;
    }) => {
      const { selected, options, fm, name, type } = arg;
      switch (type) {
        case "single-option":
          fm.data[name] = {
            connect: {
              id: selected[0],
            },
          };
          break;
        case "multi-option":
          let parent = {} as any;
          try {
            parent = {
              ${arg.relation.from.table}: {
                connect: {
                  ${arg.relation.from.fields[0]}: fm.data.id || null,
                },
              },
            };
          } catch (e) {}
          fm.data[name] = selected.map((e) => {
            return {
              ${master.name}: {
                connect: {
                  id: e,
                },
              },
              ...parent,
            };
          });
          break;
        default:
          fm.data[name] = selected.map((e) => e);
      }
      fm.render();
    }
    `;
    const cols = getColumn(select) || [];
    const get_label = `\
(row: { value: string; label: string; data?: any }) => {
  const cols = ${JSON.stringify(cols)};
  
  if (isEditor) {
    return row.label;
  }

  const is_tree =
  typeof rel__feature !== "undefined" &&
  Array.isArray(rel__feature) &&
  rel__feature.includes("tree") &&
  typeof rel__id_parent === "string" &&
  rel__id_parent;

  let prefix = "";
  if (is_tree) {
    for (let i = 0; i < row.data.__depth; i++) {
      prefix += "···";
    }
    prefix += " ";
  }

  const result = [];
  if (!!row.data && !row.label && !Array.isArray(row.data)) {
    if(cols.length > 0){
      cols.map((e) => {
        if (row.data[e]) {
          result.push(row.data[e]);
        }
      });
      return prefix + result.join(" - ");
    } else {
      const fields = parseGenField(rel__gen_fields);
      return prefix + fields
        .filter((e) => !e.is_pk)
        .map((e) => row.data[e.name])
        .filter((e) => e)
        .join(" - ");
    }
  }
  return prefix + row.label;
}
`;

    result.get_label = get_label;
    result.get_value = get_value;
    result.set_value = set_value;
  } else {
    result.get_label = `\
  (row: { value: string; label: string; item?: any }) => {
    return row.label;
  }
  `;

    result.get_value = `\
  (arg: {
    options: { label: string; value: string; item?: string }[];
    fm: FMLocal;
    name: string;
    type: string;
  }) => {
    const { options, fm, name, type } = arg;
    if (isEditor) {
      return fm.data[name];
    }
    let result = null;
    result = fm.data[name];
    switch (type) {
      case "single-option":
        try {
          const data = fm.data[name];
          if (typeof data === "object") {
            if (typeof data?.connect?.id !== "undefined") {
              result = data.connect.id;
            }else if (typeof data?.id !== "undefined") {
              result = data.id;
            }
          }
        } catch (ex) { }
        break;
    }
    return result;
  }
  `;
    result.set_value = `\
  (arg: {
    selected: any[];
    options: { label: string; value: string; item?: string }[];
    fm: FMLocal;
    name: string;
    type: string;
  }) => {
    
    fm.render();
  }
  `;
  }
  return result;
};
export const getColumn = (data: any) => {
  const cols = [];

  for (const [k, v] of Object.entries(data.select) as any) {
    if (k !== data.pk && typeof v !== "object") {
      cols.push(k);
    }
  }
  return cols;
};
