import { useLocal } from "lib/utils/use-local";
import { FC, ReactNode } from "react";
import { FMLocal, GenField } from "../form/typings";
import { FilterContent } from "./FilterContent";
import { getFilter } from "./utils/get-filter";
import { default_filter_local } from "./utils/types";
import { FieldLoading } from "../ui/field-loading";

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

  if (!isEditor) {
    const wf = getFilter(name);
    if (wf) {
      if (wf.filter.ref[_item.id]) {
        filter.data = wf.filter.ref[_item.id].data;
      } else {
        if (mode === "raw" && onLoad) {
          if (filter.raw_status === "init") {
            filter.raw_status = "loading";
            filter.data = onLoad();
            filter.raw_status = "ready";
            filter.render();
          }

          if (filter.raw_status !== "ready") {
            return <FieldLoading />;
          }
        }
      }
      wf.filter.ref[_item.id] = filter;
      wf.list.render();
    }
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
