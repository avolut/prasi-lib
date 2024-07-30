export const treePrefix = (props: any) => {
  if (!props) return "";
  const { rel__feature, rel__id_parent, row, opt } = props;

  if (props.mode !== "list") return "";
  const next = opt?.next?.data?.__depth;
  const prev = opt?.prev?.data?.__depth;

  if (!rel__feature || !rel__id_parent || !row) return "";

  const is_tree =
    typeof rel__feature !== "undefined" &&
    Array.isArray(rel__feature) &&
    rel__feature.includes("tree") &&
    typeof rel__id_parent === "string" &&
    rel__id_parent;

  let prefix = ``;
  if (is_tree && row.data && row.data.__depth) {
    const cur = row.data.__depth;
    let is_last = false;
    if (cur !== next) {
      is_last = true;
    }

    for (let i = 0; i < row.data.__depth; i++) {
      if (i === 0) {
        if (row.data.__depth === 1) {
          prefix += is_last ? "└" : "├";
        } else {
          prefix += "  ";
        }
      } else {
        if (row.data.__depth - 1 !== i) {
          prefix += "  ";
        } else {
          prefix += is_last ? "└" : "├";
        }
      }
    }
    prefix += " ";
  }
  return prefix;
};

export const sortTree = (list: any[], parent_key: string, pk: string) => {
  const nodes: { [id: string]: any } = {};
  const result: any[] = [];

  // First pass: Create nodes
  list.forEach((node) => {
    const id = node[pk];
    nodes[id] = { ...node, __depth: 0, __children: [] };
  });

  // Second pass: Build the tree structure
  list.forEach((node) => {
    const id = node[pk];
    const parentId = node[parent_key];
    if (parentId === null || parentId === undefined) {
      result.push(nodes[id]);
    } else {
      if (nodes[parentId]) {
        nodes[parentId].__children.push(nodes[id]);
      } else {
        // Handle the case where a parent is missing
        result.push(nodes[id]);
      }
    }
  });

  // Function to flatten the tree
  function flattenTree(node: any, depth: number = 0): any[] {
    node.__depth = depth;
    const children = node.__children || [];
    delete node.__children;
    return [
      node,
      ...children
        .sort((a: any, b: any) => {
          if (
            a.__children.length === 0 &&
            b.__children.length === 0 &&
            a.name &&
            b.name
          ) {
            return a.name.localeCompare(b.name);
          }

          return (b.__children?.length || 0) - (a.__children?.length || 0);
        })
        .flatMap((child: any) => flattenTree(child, depth + 1)),
    ];
  }

  // Flatten and assign indices
  const flatResult = result.flatMap((node) => flattenTree(node));
  flatResult.forEach((node, index) => {
    node.idx = index;
  });

  return flatResult;
};

// export const sortTree = (list: any[], parent_key: string, pk: string) => {
//   let meta = {} as Record<
//     string,
//     { item: any; idx: string; depth: number; id_parent: any }
//   >;

//   let mode = "" as "" | "str" | "num";
//   let _list = list.sort((a, b) => {
//     if (!mode) {
//       mode = typeof a[pk] === "string" ? "str" : "num";
//     }

//     if (mode === "str") return b[pk].toLocaleString(a[pk]);

//     return a[pk] - b[pk];
//   });

//   if (_list.length > 0 && !isEditor) {
//     const new_list = [];
//     const unlisted = {} as Record<string, any>;
//     for (const item of _list) {
//       if (item[parent_key] === null) {
//         if (!meta[item[pk]]) {
//           meta[item[pk]] = {
//             item,
//             idx: new_list.length + "",
//             depth: 0,
//             id_parent: null,
//           };
//           item.__depth = 0;
//           new_list.push(item);
//         }
//       } else {
//         unlisted[item[pk]] = item;
//       }
//     }

//     let cyclic = {} as Record<string, number>;
//     while (Object.values(unlisted).length > 0) {
//       for (const item of Object.values(unlisted)) {
//         const parent = meta[item[parent_key]];
//         if (!cyclic[item[pk]]) {
//           cyclic[item[pk]] = 1;
//         } else {
//           cyclic[item[pk]]++;
//         }
//         if (cyclic[item[pk]] > 5) {
//           item.__depth = 0;
//           meta[item[pk]] = {
//             item,
//             depth: 0,
//             idx: new_list.length + "",
//             id_parent: null,
//           };
//           new_list.push(item);
//           delete unlisted[item[pk]];
//           continue;
//         }

//         if (item[parent_key] === item[pk]) {
//           item.__depth = 0;

//           meta[item[pk]] = {
//             item,
//             depth: 0,
//             idx: new_list.length + "",
//             id_parent: null,
//           };
//           new_list.push(item);
//           delete unlisted[item[pk]];
//           continue;
//         }

//         if (parent) {
//           item.__depth = parent.depth + 1;

//           meta[item[pk]] = {
//             item,
//             depth: parent.depth + 1,
//             idx: parent.idx + ".",
//             id_parent: item[parent_key],
//           };
//           delete unlisted[item[pk]];
//         }
//       }
//     }
//     const sorted = Object.values(meta)
//       .sort((a, b) => a.idx.localeCompare(b.idx))
//       .map((e) => e.item);

//     return sorted;
//   }

//   return _list;
// };
