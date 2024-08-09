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

  list.forEach((node) => {
    const id = node[pk];
    nodes[id] = { ...node, __depth: 0, __children: [] };
  });

  let mode = "";
  const final = list;
  // .sort((a, b) => {
  //   if (!mode) mode = typeof a[pk];
  //   if (mode === "string")
  //     return (a?.[parent_key] || "").localeCompare(b?.[parent_key] || "");
  //   return (a?.[parent_key] || 0) - (b?.[parent_key] || 0);
  // });

  final.forEach((node, idx) => {
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

  const added = new Set<any>();

  // Function to flatten the tree
  function flattenTree(
    node: any,
    depth: number = 0,
    parent: any = null
  ): any[] {
    node.__depth = depth;
    const children = node.__children || [];
    node.__parent = parent;

    if (!added.has(node[pk])) {
      added.add(node[pk]);
    }

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
        .flatMap((child: any) => flattenTree(child, depth + 1, node)),
    ];
  }

  // Flatten and assign indices
  const flatResult = result.flatMap((node) => flattenTree(node));

  for (const item of list) {
    if (!added.has(item[pk])) {
      flatResult.push(item);
    }
  }

  flatResult.forEach((node, index) => {
    node.idx = index;
  });

  return flatResult;
};
