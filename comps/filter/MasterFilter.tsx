import { useLocal } from "lib/utils/use-local";
import { FC, ReactNode, useEffect } from "react";
import { FMLocal, GenField } from "../form/typings";
import { FilterContent } from "./FilterContent";
import { getFilter } from "./utils/get-filter";
import { default_filter_local } from "./utils/types";
import { FieldLoading } from "lib/exports";

type FilterMode = "raw" | "inline";

type FilterProps = {
  gen_fields: GenField[];
  gen_table: string;
  name: string;
  value: any;
  mode: FilterMode;
  children?: ReactNode;
  onClose?: () => void;
  onSubmit?: (fm: FMLocal | null) => Promise<any>;
  onLoad?: () => Promise<any>;
  PassProp: any;
  child: any;
  _item: PrasiItem;
};

export const MasterFilter: FC<FilterProps> = ({
  gen_fields,
  gen_table,
  name,
  value,
  mode,
  PassProp,
  child,
  onClose,
  _item,
  onSubmit,
  onLoad,
}): ReactNode => {
  const filter = useLocal({ ...default_filter_local });
  filter.name = name;
  filter.mode = mode;
  useEffect(() => {
    if (!isEditor) {
      const wf = getFilter(name);
      if (wf) {
        if (wf.filter.ref?.[_item.id]) {
          filter.data = wf.filter.ref[_item.id].data;
          filter.raw_status = "ready";
          filter.render();
        } else {
          filter.data = {};
          if (mode === "raw" && onLoad) {
            if (filter.raw_status === "init") {
              filter.raw_status = "loading";
              const data = onLoad();
              if (data instanceof Promise) {
                data.then((e) => {
                  filter.data = e;
                  if (typeof onSubmit === "function") {
                    const data = onSubmit({ data: e } as any);

                    if (data instanceof Promise) {
                      data.then((ex) => {
                        filter.data = {
                          __status: "submit",
                          ...e,
                          _where: ex,
                        };
                        filter.render();
                      });
                    }
                    console.log({ data });
                  }
                  filter.raw_status = "ready";
                  filter.render();
                  
                });
              } else {
                filter.raw_status = "ready";
                filter.data = data;
                filter.render();
              }
            }
          }
        }
        wf.filter.ref[_item.id] = filter;
        wf.list.render();
      }
    } else {
      filter.raw_status = "ready";
      filter.render();
    }
  }, []);

  if (mode === "raw" && filter.raw_status !== "ready") {
    return <FieldLoading />;
  }
  return (
    <>
      <FilterContent
        onSubmit={onSubmit}
        PassProp={PassProp}
        _item={_item}
        child={child}
        mode={mode}
        filter={filter}
      />
    </>
  );
};
