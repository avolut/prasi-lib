import { useLocal } from "@/utils/use-local";
import { ElementType, FC, ReactElement, ReactNode, useEffect } from "react";
import { NodeRendererProps, Tree as Arborist, NodeApi } from "react-arborist";

export type TreeItem = {
  id: string;
  text: string;
  id_parent?: string;
  sort_idx?: number;
  children?: TreeItem[];
};

export const Tree = <T extends TreeItem>({
  tree,
  renderRow,
  className,
  rowHeight,
  onChange,
  drag,
}: {
  className: string;
  tree: T[];
  drag?: boolean;
  onChange?: (rows: T[]) => Promise<void> | void;
  rowHeight?: number;
  renderRow: (arg: { row: T; style: any; dragHandle: any }) => ReactNode;
}) => {
  const local = useLocal({
    update: {} as Record<string, T>,
    timeout: null as any,
    children: generateTreeChildren({
      renderRow,
      updateNode: (data, arg) => {
        for (const [k, v] of Object.entries(arg)) {
          (data as any)[k] = v;
        }
        local.update[data.id] = { ...data };

        clearTimeout(local.timeout);
        local.timeout = setTimeout(async () => {
          if (onChange) {
            await onChange(Object.values(local.update));
            local.update = {};
          }
        }, 300);
      },
    }),
    tree: formatTree(tree),
    width: 0,
    height: 0,
    rob: new ResizeObserver(([el]) => {
      local.width = el.contentRect.width;
      local.height = el.contentRect.height;
      local.render();
    }),
  });

  useEffect(() => {
    return () => {
      local.rob.disconnect();
    };
  }, []);

  return (
    <div
      className={cx(
        className,
        css`
          position: relative;
          > div {
            position: absolute;
            left: 0;
            bottom: 0;
            right: 0;
            top: 0;
          }
        `
      )}
      ref={(el) => {
        if (el) {
          local.rob.observe(el);
          const bound = el.getBoundingClientRect();
          if (local.height === 0) {
            local.width = bound.width;
            local.height = bound.height;
            local.render();
          }
        }
      }}
    >
      {local.width > 0 && local.height > 0 && (
        <Arborist
          initialData={local.tree}
          width={local.width}
          indent={10}
          rowHeight={rowHeight}
          height={local.height}
          disableDrag={drag === false}
          children={local.children}
        />
      )}
    </div>
  );
};

const formatTree = <T extends TreeItem>(tree: T[]) => {
  const res: T[] = [];
  const ftree = tree
    .filter((e) => e.id)
    .sort((a, b) => (a.sort_idx || 0) - (b.sort_idx || 0))
    .map((e) => ({
      ...e,
      id: e.id,
      text: e.text,
      children: e.children,
      id_parent: e.id_parent || null,
      sort_idx: e.sort_idx || "0",
    })) as TreeItem[];

  const scan = (id_parent: null | string, parent: T) => {
    for (const s of ftree) {
      if (s.id_parent === id_parent) {
        if (!parent.children) {
          parent.children = [];
        }

        if (!parent.children.find((e) => e.id === s.id)) {
          parent.children.push(s);
          scan(s.id, s as T);
        }
      }
    }
  };

  scan(null, {
    id: "root",
    id_parent: "",
    sort_idx: 0,
    text: "",
    children: res as TreeItem[],
  } as T);

  return res;
};

const generateTreeChildren = <T extends TreeItem>(arg: {
  renderRow: (arg: { row: T; style: any; dragHandle: any }) => ReactNode;
  updateNode: (data: T, new_data: Partial<T>) => void;
}) => {
  const { renderRow, updateNode } = arg;
  return (({ node, style, dragHandle }) => {
    let sort_idx = node.data.sort_idx;
    if (typeof sort_idx === "string") sort_idx = parseInt(sort_idx);

    let parent_id: any = node.parent?.id;
    if (parent_id === "__REACT_ARBORIST_INTERNAL_ROOT__") parent_id = null;
    if (!node.isDragging) {
      if (sort_idx !== node.rowIndex) {
        updateNode(node.data, { sort_idx: node.rowIndex } as Partial<T>);
      }
      if (parent_id !== node.data.id_parent) {
        updateNode(node.data, { id_parent: parent_id } as Partial<T>);
      }
    }

    return renderRow({ row: node.data, style, dragHandle });
  }) as ElementType<NodeRendererProps<T>>;
};
