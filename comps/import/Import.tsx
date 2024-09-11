import { useLocal } from "lib/utils/use-local";
import { FC, useEffect } from "react";
import * as XLSX from "xlsx";

export const Import: FC<{
  child: any;
  PassProp: any;
  props: any;
  sample: string;
  desc: string;
  title: string;
  task: (e: any) => Promise<any>;
  excel: any;
  done: (e: any) => void;
}> = ({ child, PassProp, props, title, desc, sample, task, excel, done }) => {
  const local = useLocal({
    ready: false,
    fase: "start" as "start" | "running" | "end",
    data: [] as any[],
    progress: 0 as number,
    props: {
      title,
      desc,
      sample,
    },
    file: {
      name: isEditor ? "sample" : (null as any),
      size: isEditor ? "sample" : (null as any),
    },
    excel: {
      failed: {
        data: [] as any[],
        download: () => {
          const ws = XLSX.utils.json_to_sheet(local.excel.failed.data);
          // Buat workbook dan tambahkan worksheet
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, "report");
          // Ekspor file
          XLSX.writeFile(wb, "failed_import.xlsx");
        }
      }
    },
    recap: {
      success: [] as any[],
      failed: [] as any[],
    },
    action: {
      run: () => {
        local.fase = "running";
        local.progress = 0;
        local.ready = false;
        local.render();
      },
      done: () => {
        local.fase = "end";
        local.render();
      }
    }
  });
  useEffect(() => {
    if (local.fase === "start") {
      local.ready = false;
      local.render();
    }
    setTimeout(() => {
      local.render();
    }, 1000);
  }, [local.fase]);
  useEffect(() => {
    if (local.ready) {
      const callback = () => {
        local.fase = "end";
        local.ready =false;
        local.render();
        if (typeof done === "function") {
          done(local);
        }
      };
      const sleep = (ms: number) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
      };
      const startImport = async ({
        list,
        task,
      }: {
        list: any[];
        task: (e: any) => Promise<void>;
      }) => {
        let n = 0;
        while (n < list.length) {
          if (!local.ready) {
            await new Promise((resolve) => {
              const interval = setInterval(() => {
                if (local.ready) {
                  clearInterval(interval);
                  resolve([]);
                }
              }, 100);
            });
          }

          await task(list[n]);
          await sleep(100);
          n++;
        }
      };
      let idx = 0;
      if (local.progress <= 0) {
        const res = startImport({
          list: local.data,
          task: async (e) => {
            if (typeof task === "function") {
              const result = await task({data: e, excel});
              if (typeof result === "boolean") {
                if (!result) {
                  local.recap.failed.push(e);
                  local.excel.failed.data.push(e);
                } else {
                  local.recap.success.push(e);
                }
              } else {
                local.recap.success.push(e);
              }
            }
            idx++;
            local.progress = (idx / local.data.length) * 100;
            local.render();
          },
        });

        if (res instanceof Promise) res.then(callback);
        else callback();
      }
    }
  }, [local.ready]);
  return (
    <div {...props} className={cx(props.className, "")}>
      <PassProp
        li={local}
      >
        {child}
      </PassProp>
    </div>
  );
};
