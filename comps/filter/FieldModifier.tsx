import capitalize from "lodash.capitalize";
import { FC } from "react";
import { FilterFieldType, modifiers } from "./utils/types";

export const FieldModifier: FC<{
  type: FilterFieldType;
  modifier: string;
  onChange: (modifier: string) => void;
}> = ({ type, modifier, onChange }) => {
  if (!modifier && modifiers[type]) {
    onChange(Object.keys(modifiers[type])[0]);
  }

  return (
    <select
      onChange={(e) => {
        const val = e.currentTarget.value;
        onChange(val);
      }}
    >
      {modifiers[type]
        ? Object.entries(modifiers[type]).map(([value, label]) => {
            return (
              <option selected={modifier === value} value={value}>
                {label}
              </option>
            );
          })
        : null}
    </select>
  );
};
