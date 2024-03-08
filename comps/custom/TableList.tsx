import { useLocal } from "@/utils/use-local";
import { FC, ReactNode, useEffect } from "react";
import { icon } from "../icon";
import { Skeleton } from "../ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/comps/ui/table";

type TableListProps = {
  mapping: () => Promise<Column[]>;
  on_load: () => Promise<any[]>;
};

type Column = {
  name: string;
  title?: string;
  jsx?: ReactNode;
  type?: "number" | "default";
};

export const TableList: FC<TableListProps> = (_args) => {
  const { mapping, on_load } = _args;

  const local = useLocal({
    columns: [] as Column[],
    list: [] as Record<string, any>[],
    status: "init" as "init" | "loading" | "ready",
  });

  useEffect(() => {
    (async () => {
      if (local.status === "init") {
        local.status = "loading";
        local.render();

        local.columns = await mapping();
        local.list = await on_load();
        local.render();

        local.status = "ready";
        local.render();
      }
    })();
  }, [mapping]);

  console.log(local.columns, local.list, "s");

  return (
    <div className="c-overflow-x-auto c-w-full">
      {local.status !== "ready" ? (
        <Skeleton className="c-h-4 c-w-[80%]" />
      ) : (
        <>
          <Table>
            {/* /** ini header */}
            {!!local.columns && (
              <TableHeader className="c-w-full">
                <TableRow>
                  {local.columns.map((item: Column, index: number) => {
                    return (
                      <TableHead key={index} className="c-text-center">
                        {item.name}
                      </TableHead>
                    );
                  })}
                </TableRow>
              </TableHeader>
            )}
            <TableBody>
              {!!local.list &&
                local.list.map((item, idx) => (
                  <TableRow key={idx} className="c-flex c-flex-col">
                    {local.columns.map((col, col_idx) => (
                      <TableCell
                        key={col_idx}
                        className="c-flex c-flex-col c-text-center"
                      >
                        {!!col.title
                          ? col.title
                          : !!col.jsx
                          ? col.jsx
                          : item[col.name]}   
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </>
      )}
    </div>
  );
};
