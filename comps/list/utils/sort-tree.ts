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

  // First pass: Create nodes
  list.forEach((node) => {
    const id = node[pk];
    nodes[id] = { ...node, __depth: 0, __children: [], __parent: null };
  });

  // Second pass: Build relationships
  list.forEach((node) => {
    const id = node[pk];
    const parentId = node[parent_key];
    
    if (parentId && parentId !== id && nodes[parentId]) {
      nodes[id].__parent = nodes[parentId];
      nodes[parentId].__children.push(nodes[id]);
    }
  });

  // Function to calculate depth
  const calculateDepth = (node: any, visited: Set<string> = new Set()): number => {
    if (visited.has(node.id)) return 0; // Prevent cycles
    visited.add(node.id);
    
    if (!node.__parent) return 0;
    return 1 + calculateDepth(node.__parent, visited);
  };

  // Calculate depths
  Object.values(nodes).forEach((node: any) => {
    node.__depth = calculateDepth(node);
  });

  // Sort nodes
  const sortedNodes = Object.values(nodes).sort((a: any, b: any) => {
    if (a.__depth !== b.__depth) return a.__depth - b.__depth;
    if (a.__children.length !== b.__children.length) {
      return b.__children.length - a.__children.length;
    }
    return a.name.localeCompare(b.name);
  });

  // Assign indices
  sortedNodes.forEach((node: any, index: number) => {
    node.idx = index;
  });

  return sortedNodes;
};