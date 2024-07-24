import * as XLSX from "xlsx";
import { TableListProp } from "../TableList";
import { filterWhere } from "lib/comps/filter/parser/filter-where";
import { call_prasi_events } from "lib/exports";

export const export_excel = async ({
  list,
  tbl,
  on_load,
}: {
  list: TableListProp;
  tbl: {
    columns: any[];
    sort: {
      columns: any;
      orderBy: any;
    };
    render: () => void;
  };
  on_load: () => any;
}) => {
  const where = filterWhere(list.filter_name, list.__props);

  call_prasi_events("tablelist", "where", [list.__props?.gen__table, where]);
  const orderBy = tbl.sort.orderBy || undefined;
  const load_args: any = {
    async reload() {},
    orderBy,
    where,
    paging: {},
  };
  if (typeof list.on_load === "function") {
    const result = await list.on_load({ ...load_args, mode: "query" });
    const data = [] as any[];
    const res = [
      {
        id: "ff4105af-aa81-4432-847b-1c97fc9eb505",
        name_goal: "Top Down",
        definition: null,
        threshold: 1,
        description: "Top Down",
        goal_employee: [
          {
            id: "440dd52c-1a18-4b53-b0da-a45f47251f36",
          },
        ],
      },
    ];
    const l = document.getElementsByClassName("rdg-row");
    if (res.length) {
      res.map((e, id) => {
        if (tbl.columns.length) {
          tbl.columns.map((ex, idx) => {
            const r = null;
            console.log({ r });
          });
        }
      });
    }
  }
};
