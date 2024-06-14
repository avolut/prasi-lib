import { modifiers } from "./types";

export const filterModifier = (type: keyof typeof modifiers) => {
  return Object.entries(modifiers[type] || {}).map(([k, v]) => {
    return {
      label: v,
      value: k,
    };
  });
};
