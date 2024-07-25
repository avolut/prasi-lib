import { GenFormArgs } from "./types";

export const genFormOnInit = ({
  result,
  pk,
  pks,
  table,
  select,
  is_md,
}: GenFormArgs) => {
  result.on_init = {
    mode: "raw",
    value: `\
        ({ submit, reload, fm }: Init) => {
          // on init
          if (!isEditor) {
            if (typeof md === "object") {
              md.childs["form"] = {
                fm: fm
              };
            }
          }
        };
        
        type Init = { submit: () => Promise<boolean>; reload: () => void; fm: FMLocal }
        `,
  };
};
