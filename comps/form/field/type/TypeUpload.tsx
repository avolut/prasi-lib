import { useLocal } from "@/utils/use-local";
import get from "lodash.get";
import { Loader2, Paperclip, Trash2, Upload } from "lucide-react";
import { FC } from "react";
import * as XLSX from "xlsx";
import { FMLocal, FieldLocal, FieldProp } from "../../typings";
import { FilePreview } from "./FilePreview";
import { PropTypeInput } from "./TypeInput";
const w = window as unknown as {
  serverurl: string;
};

export const FieldUpload: FC<{
  field: FieldLocal;
  fm: FMLocal;
  prop: PropTypeInput;
  styling?: string;
  arg: FieldProp;
  on_change: (e: any) => void | Promise<void>;
}> = ({ field, fm, prop, on_change, arg }) => {
  console.log(field.prop.upload);
  return <></>;
};
