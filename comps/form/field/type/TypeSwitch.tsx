import { useLocal } from "lib/utils/use-local";
import { FC } from "react";

export type PropTypeSwitch = {};
export const FieldTypeSwitch: FC<{
  valueName: string;
  description?: string;
  label?: string;
}> = ({ valueName, description, label }) => {
  const local = useLocal({ checked: false });
  return (
    <div
      onClick={() => {
        local.checked = !local.checked;
        local.render();
      }}
    >
      {JSON.stringify(local.checked)}
    </div>
  );
};
