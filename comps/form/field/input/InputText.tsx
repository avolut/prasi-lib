import { FC } from "react";
import { FMLocal, FieldLocal } from "../../typings";

export const InputText: FC<{ field: FieldLocal; fm: FMLocal }> = ({
  field,
  fm,
}) => {
  const value = fm.data[field.name];
  return (
    <input
      type="text"
      onChange={(ev) => {
        fm.data[field.name] = ev.currentTarget.value;
        fm.render();
      }}
      value={value}
      disabled={field.disabled}
      className="c-flex-1 c-rounded c-bg-transparent c-outline-none c-px-2 c-text-sm"
      spellCheck={false}
      onFocus={() => {
        field.focused = true;
        field.render();
      }}
      onBlur={() => {
        field.focused = false;
        field.render();
      }}
    />
  );
};
