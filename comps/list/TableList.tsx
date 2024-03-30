import { useLocal } from "@/utils/use-local";
import get from "lodash.get";
import { FC, useEffect } from "react";
import DataGrid, { ColumnOrColumnGroup } from "react-data-grid";
import "react-data-grid/lib/styles.css";
import { getProp } from "../md/utils/get-prop";

type TableListProp = {
  child: any;
  PassProp: any;
  name: string;
  on_load: () => Promise<any[]>;
  mode: "table" | "list" | "grid";
};

export const TableList: FC<TableListProp> = ({
  name,
  on_load,
  child,
  PassProp,
  mode,
}) => {
  const local = useLocal({
    el: null as null | HTMLDivElement,
    width: 0,
    height: 0,
    rob: new ResizeObserver(([e]) => {
      local.height = e.contentRect.height;
      local.width = e.contentRect.width;
      local.render();
    }),
    scrolled: false,
    data: [] as any[],
    status: "ready" as "loading" | "ready",
  });

  useEffect(() => {
    if (local.status === "ready") {
      local.status = "loading";
      local.render();

      const result = on_load();
      const callback = (data: any[]) => {
        local.data = data;
        local.render();
      };
      if (result instanceof Promise) result.then(callback);
      else callback(result);

      local.status = "ready";
      local.render();
    }
  }, [on_load]);

  const raw_childs = get(
    child,
    "props.meta.item.component.props.child.content.childs"
  );

  let childs: any[] = [];

  const mode_child = raw_childs.find((e: any) => e.name === mode);

  if (mode_child && mode_child.childs) {
    childs = mode_child.childs;
  }
  console.log(raw_childs);

  const columns: ColumnOrColumnGroup<any>[] = [];
  for (const child of childs) {
    const key = getProp(child, "name");
    const name = getProp(child, "title");
    const width = parseInt(getProp(child, "width"));
    columns.push({
      key,
      name,
      width: width > 0 ? width : undefined,
      resizable: true,
      renderCell(props) {
        return (
          <PassProp
            idx={props.rowIdx}
            row={props.row}
            col={{
              name: props.column.key,
              value: props.row[props.column.key],
            }}
            rows={local.data}
          >
            {child}
          </PassProp>
        );
      },
    });
  }

  return (
    <div
      className={cx(
        "c-w-full c-h-full",
        css`
          div[role="row"]:hover {
            background: #e2f1ff;
            .num-edit {
              display: flex;
            }
            .num-idx {
              display: none;
            }
          }
          div[role="columnheader"] span svg {
            margin: 12px 2px;
          }
          div[aria-selected="true"] {
            outline: none;
          }

          .row-selected {
            background: #e2f1ff;
          }
        `
      )}
      ref={(el) => {
        if (!local.el && el) {
          local.el = el;
          local.rob.observe(el);
        }
      }}
    >
      <DataGrid columns={columns} rows={local.data || []} />
    </div>
  );
};
