import { on_load } from "../on_load";
import { GenFormArgs } from "./types";

export const genFormOnLoad = ({
  result,
  pk,
  pks,
  table,
  select,
  is_md,
}: GenFormArgs) => {
  result.on_load = {
    mode: "raw",
    value: on_load({
      pk,
      table,
      select,
      pks,
      opt: is_md
        ? {
            after_load: `\
      if (typeof md === "object") {
        opt.fm.status = "ready";
        md.selected = opt.fm.data;
        if (!md.selected) {
          md.tab.active = "master";
          alert("Data Not Found");
          md.params.apply();
        }
        md.header.render();
        md.render();
      }`,
            is_md: true,
          }
        : { is_md },
    }),
  };
};
