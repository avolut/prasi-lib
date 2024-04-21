import { useLocal } from "@/utils/use-local";
import { FMLocal } from "../../typings";
import {
  BaseFieldInternal,
  BaseFieldLocal,
  BaseFieldProps,
} from "./type/field";
import { formatName } from "@/gen/utils";

export const useField = <T extends Record<string, any>>(
  arg: BaseFieldProps<T> & { fm: FMLocal }
) => {
  const fm = arg.fm;
  const local = useLocal<BaseFieldInternal<T>>({
    status: "init",
  } as any) as BaseFieldLocal<T>;

  if (local.status === "init") {
    local.name = arg.name;
    local.label = arg.label || formatName(arg.name as string);
    local.type = arg.type || "text";
    local.desc = arg.desc || "";
    local.status = "ready";
    local.width = arg.width || fm.size.field === "full" ? "full" : "1/2";
  }

  return local as BaseFieldLocal<T>;
};
