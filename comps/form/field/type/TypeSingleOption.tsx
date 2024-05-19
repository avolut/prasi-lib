import { FC } from "react";
import { FMLocal, FieldLocal, FieldProp } from "../../typings";
import { FieldButton } from "./TypeButton";
import { TypeDropdown } from "./TypeDropdown";
import { FieldRadio } from "./TypeRadio";
import { FieldToggle } from "./TypeToggle";

export const SingleOption: FC<{
  field: FieldLocal;
  fm: FMLocal;
  arg: FieldProp;
}> = ({ field, fm, arg }) => {
  return (
    <>
      {arg.sub_type === "dropdown" ? (
        <TypeDropdown arg={arg} field={field} fm={fm} />
      ) : arg.sub_type === "toogle" ? (
        <FieldToggle arg={arg} field={field} fm={fm} />
      ) : arg.sub_type === "button" ? (
        <FieldButton arg={arg} field={field} fm={fm} />
      ) : arg.sub_type === "radio" ? (
        <FieldRadio arg={arg} field={field} fm={fm} />
      ) : (
        <></>
      )}
    </>
  );
};
