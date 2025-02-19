import { FC } from "react";
import { FMLocal, FieldLocal, FieldProp } from "../../typings";
import { PropTypeInput } from "./TypeInput";
import { FieldUploadMulti } from "./TypeUploadMulti";
import { FieldUploadSingle } from "./TypeUploadSingle";

export const FieldUpload: FC<{
  field: FieldLocal;
  fm: FMLocal;
  prop: PropTypeInput;
  styling?: string;
  arg: FieldProp;
}> = (pass) => {
  const { field, fm, prop, arg } = pass;
  let mode = field.prop.upload?.mode || "single-file";
  if (mode === "single-file") {
    return <FieldUploadSingle {...pass} />;
  }
  return <FieldUploadMulti {...pass} />;
};
