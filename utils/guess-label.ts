import { validate } from "uuid";

export const guessLabel = (_obj: Record<string, any>, key?: string) => {
  let label = "";
  let obj = _obj;
  if (key) obj = _obj[key];

  const label_key =
    Object.keys(obj)
      .map((e) => e.toLowerCase())
      .find((e) => e.includes("name") || e.includes("nama")) || "";

  label = obj[label_key];
  if (obj.length > 1) {
    for (const v of Object.values(obj)) {
      if (typeof v === "string" && v.length >= 2 && !validate(v)) {
        label = v;
      }
    }
  }

  if (typeof label === "string" && label.length > 10) {
    label = label.substring(0, 10) + "…";
  }

  return label;
};
