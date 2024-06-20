import { getPathname } from "lib/utils/pathname";
import { filter_window } from "./types";

export const getFilter = (name: string) => {
  if (!filter_window.prasi_filter) {
    filter_window.prasi_filter = {};
  }
  const pf = filter_window.prasi_filter;
  if (pf) {
    const pathname = getPathname();
    if (!pf[pathname]) pf[pathname] = {};
    if (!pf[pathname][name])
      pf[pathname][name] = {
        filter: {
          ref: {},
          render: () => {},
        },
        list: {
          ref: {},
          render: () => {},
          reload() {
            for (const [k, v] of Object.entries(this.ref)) {
              v.reload();
            }
          },
        },
      };
    return pf[pathname][name];
  }
};
