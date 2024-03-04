import { useLocal } from "@/utils/use-local";
import { FC, useEffect } from "react";
import { icon } from "../icon";

type TableProps = {
  map_val: Array<{ name: string }>;
};

export const Table: FC<TableProps> = (_args) => {
  const { map_val } = _args;

  const local = useLocal({
    list: [
      {
        name: "test1",
      },
      {
        name: "test2",
      },
    ] as { name: string }[],
    status: "init" as "init" | "loading" | "ready",
  });

  //   useEffect(() => {
  //     (async () => {
  //       if (local.status === "init") {
  //         local.status = "loading";
  //         local.render();

  //         local.list = await map_val;
  //         local.render();

  //         local.status = "ready";
  //         local.render();
  //       }
  //     })();
  //   }, [map_val]);

  console.log(local.list, "tes");

  return (
    <div className="c-overflow-x-auto c-w-full">
      <table className="c-table-auto c-w-full c-border-collapse c-rounded-lg c-border c-border-gray-300">
        <thead>
          <tr>
            <th className="c-px-4 c-py-2 c-text-center">Nomor</th>
            <th className="c-px-4 c-py-2 c-text-center">Header 1</th>
            <th className="c-px-4 c-py-2 c-text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {!!local.list &&
            local.list.map((item, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "c-bg-gray-100" : ""}
              >
                <td className="c-border c-px-4 c-py-2 c-text-center">
                  {index + 1}
                </td>
                <td className="c-border c-px-4 c-py-2">{item.name}</td>
                <td className="c-border c-px-4 c-py-2 c-flex c-flex-col c-justify-center c-items-center c-space-y-2">
                  <button className="c-w-[50px] c-rounded c-flex c-justify-center c-bg-blue-300">
                    <span className="c-p-2">{icon.update}</span>
                  </button>
                  <button className="c-w-[50px] c-rounded c-flex c-justify-center c-bg-red-300">
                    <span className="c-p-2">{icon.delete}</span>
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};
