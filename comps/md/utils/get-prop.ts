import get from "lodash.get";

export const getProp = (item: any, name: string) => {
  const built = get(item, `component.props.${name}.valueBuilt`);

  let value: any = "";
  eval(`value = ${built}`);

  if (typeof value === "function") return value();

  return value as any;
};
