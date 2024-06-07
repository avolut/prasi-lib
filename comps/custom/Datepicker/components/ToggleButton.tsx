import React from "react";

import { CloseIcon, DateIcon } from "./utils";

interface ToggleButtonProps {
  isEmpty: boolean;
}

const ToggleButton: React.FC<ToggleButtonProps> = (
  e: ToggleButtonProps
): JSX.Element => {
  return e.isEmpty ? (
    <DateIcon className="c-h-5 c-w-5" />
  ) : (
    <CloseIcon className="c-h-5 c-w-5" />
  );
};

export default ToggleButton;
