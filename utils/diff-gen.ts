export const mapCompItemTree = (
  item: IItem,
  opt: {
    shouldAdd?: (arg: {
      parent_comp?: IItem;
      item: IItem;
    }) => "add" | "add-skip-children";
  },
  arg?: {
    parent_comp?: IItem;
    mapping: Record<string, Record<string, IItem>>;
  }
) => {
  const map = arg?.mapping || {};

  if (item.component?.id && item.component.props) {
    let skip_children = false;
    for (const [k, v] of Object.entries(item.component.props)) {
      if (k === "name") {
        let action = "add";

        if (opt.shouldAdd) {
          action = opt.shouldAdd({ parent_comp: arg?.parent_comp, item });
        }

        if (action === "add" || action === "add-skip-children") {
          if (!map[item.component.id]) map[item.component.id] = {};
          map[item.component.id][v.value] = item;

          if (action === "add-skip-children") {
            skip_children = true;
          }
        }
      }
    }

    if (skip_children) {
      for (const [k, v] of Object.entries(item.component.props)) {
        if (!!(v as any).content) {
          mapCompItemTree((v as any).content, opt, {
            parent_comp: item,
            mapping: map,
          });
        }
      }
    }
  }

  if (item.childs) {
    for (const c of item.childs) {
      mapCompItemTree(c, opt, { ...arg, mapping: map });
    }
  }
  return map;
};

export const copyProps = (from: IItem, to: IItem, prop_name: string[]) => {
  if (from.component && to.component) {
    for (const p of prop_name) {
      if (from.component.props[p]) {
        to.component.props[p] = from.component.props[p];
      }
    }
  }
};

export const reduceItemMapping = (
  item: IItem,
  map: ReturnType<typeof mapCompItemTree>,
  found?: (old_item: IItem, new_item: IItem) => IItem
) => {
  if (item.childs) {
    for (const [k, c] of Object.entries(item.childs)) {
      if (
        c.component?.id &&
        c.component.props.name &&
        c.component.props.name.value
      ) {
        if (map?.[c.component.id]?.[c.component.props.name.value]) {
          if (found) {
            item.childs[k as any] = found(
              c,
              map[c.component.id][c.component.props.name.value]
            );
          }

          delete map[c.component.id][c.component.props.name.value];
          continue;
        } else {
          if (c.component?.id && c.component.props) {
            for (const [k, v] of Object.entries(c.component.props)) {
              if (!!(v as any).content) {
                reduceItemMapping((v as any).content, map, found);
              }
            }
          }
        }
      }

      reduceItemMapping(c, map, found);
    }
  }
};

// export const mergeNewToOld = (
//   new_item: IItem,
//   old_item: IItem,
//   founds?: {
//     name: Record<string, IItem>;
//     comp: Record<string, Record<string, IItem>>;
//   }
// ) => {
//   const comp_founds = founds?.comp || {};
//   const name_founds = founds?.name || {};

//   let _founds = founds || {
//     comp: comp_founds,
//     name: name_founds,
//   };

//   for (const c of old_item.childs) {
//     if (c.component?.id && c.component.props.name) {
//       if (!comp_founds[c.component.id]) {
//         comp_founds[c.component.id] = {};
//       }
//       comp_founds[c.component.id][c.component.props.name.value] = c;
//     } else {
//       name_founds[c.name] = c;
//     }
//   }

//   for (const c of new_item.childs) {
//     if (c.component?.id && c.component.props.name) {
//       if (!comp_founds[c.component.id]?.[c.component.props.name.value]) {
//         old_item.childs.push(c);
//       } else {
//         mergeNewToOld(
//           c,
//           comp_founds[c.component.id]?.[c.component.props.name.value],
//           _founds
//         );
//       }
//     } else {
//       if (!name_founds[c.name]) {
//         old_item.childs.push(c);
//       } else {
//         mergeNewToOld(c, name_founds[c.name], _founds);
//       }
//     }
//   }
// };

export const propFromItem = (item: IItem) => {
  const result: Record<string, PropVal> = {};
  if (item.component?.props) {
    for (const [k, v] of Object.entries(item.component.props)) {
      const prop = v as any;

      if (prop.meta.type === "content-element") {
        result[k] = { mode: "jsx", value: prop.content };
      } else {
        result[k] = { mode: "raw", value: v.value };
      }
    }
  }
  return result;
};
