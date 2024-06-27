export const treePrefix = (props: any) => {
  if (!props) return "";
  const { rel__feature, rel__id_parent, row, mode } = props;

  if (props.mode !== "list") return "";

  if (!rel__feature || !rel__id_parent || !row) return "";

  const is_tree =
    typeof rel__feature !== "undefined" &&
    Array.isArray(rel__feature) &&
    rel__feature.includes("tree") &&
    typeof rel__id_parent === "string" &&
    rel__id_parent;

  let prefix = ``;
  if (is_tree && row.data && row.data.__depth) {
    for (let i = 0; i < row.data.__depth; i++) {
      if (i === 0) {
        if (row.data.__depth === 1) {
          prefix += "└";
        } else {
          prefix += "  ";
        }
      } else {
        if (row.data.__depth - 1 !== i) {
          prefix += "  ";
        } else {
          prefix += "└";
        }
      }
    }
    prefix += " ";
  }
  return prefix;
};

export const sortTree = (list: any, parent_key: string, pk: string) => {
  let meta = {} as Record<
    string,
    { item: any; idx: string; depth: number; id_parent: any }
  >;

  if (list.length > 0 && !isEditor) {
    const new_list = [];
    const unlisted = {} as Record<string, any>;
    for (const item of list) {
      if (item[parent_key] === null) {
        if (!meta[item[pk]]) {
          meta[item[pk]] = {
            item,
            idx: new_list.length + "",
            depth: 0,
            id_parent: null,
          };
          item.__depth = 0;
          new_list.push(item);
        }
      } else {
        unlisted[item[pk]] = item;
      }
    }

    let cyclic = {} as Record<string, number>;
    while (Object.values(unlisted).length > 0) {
      for (const item of Object.values(unlisted)) {
        const parent = meta[item[parent_key]];
        if (!cyclic[item[pk]]) {
          cyclic[item[pk]] = 1;
        } else {
          cyclic[item[pk]]++;
        }
        if (cyclic[item[pk]] > 5) {
          item.__depth = 0;
          meta[item[pk]] = {
            item,
            depth: 0,
            idx: new_list.length + "",
            id_parent: null,
          };
          new_list.push(item);
          delete unlisted[item[pk]];
          continue;
        }

        if (item[parent_key] === item[pk]) {
          item.__depth = 0;

          meta[item[pk]] = {
            item,
            depth: 0,
            idx: new_list.length + "",
            id_parent: null,
          };
          new_list.push(item);
          delete unlisted[item[pk]];
          continue;
        }

        if (parent) {
          if (parent.item.id === "f43ac927-9c0d-4241-a837-c0bf1c6a5245") {
            console.log(parent, item);
          }
          item.__depth = parent.depth + 1;

          meta[item[pk]] = {
            item,
            depth: parent.depth + 1,
            idx: parent.idx + ".",
            id_parent: item[parent_key],
          };
          delete unlisted[item[pk]];
        }
      }
    }
    const sorted = Object.values(meta)
      .sort((a, b) => a.idx.localeCompare(b.idx))
      .map((e) => e.item);

    return sorted;
  }

  return list;
};
