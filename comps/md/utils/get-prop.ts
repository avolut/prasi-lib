import get from "lodash.get";

export const getProp = (item: any, name: string, arg: any = {}) => {
  const built = get(item, `component.props.${name}.valueBuilt`);
  const __result = { value: "" as any };

  try {
    const fn = new Function(
      ...Object.keys(arg),
      "__result",
      `__result.value = ${built}`
    );
    fn(...Object.values(arg), __result);

    if (typeof __result.value === "function") return __result.value(arg);
  } catch (e) {
    console.log(e, built, arg);
  }

  return __result.value as any;
};
