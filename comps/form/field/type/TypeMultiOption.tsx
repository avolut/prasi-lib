import { FC } from "react";
import { FMLocal, FieldLocal, FieldProp } from "../../typings";
import { FieldButton } from "./TypeButton";
import { FieldCheckbox } from "./TypeCheckbox";
import { TypeDropdown } from "./TypeDropdown";
import { FieldTag } from "./TypeTag";

export const MultiOption: FC<{
  field: FieldLocal;
  fm: FMLocal;
  arg: FieldProp;
}> = ({ field, fm, arg }) => {
  return (
    <>
      {arg.sub_type === "typeahead" ? (
        <TypeDropdown field={field} fm={fm} arg={arg}/>
      ):arg.sub_type === "checkbox" ? (
        <FieldCheckbox field={field} fm={fm} arg={arg}/>
      ): arg.sub_type === "button" ? (
        <FieldButton arg={arg} field={field} fm={fm} />
      ): arg.sub_type === "tag" ? (
        <FieldTag arg={arg} field={field} fm={fm} />
      ) : (
        <></>
      )}
    </>
  );
};
