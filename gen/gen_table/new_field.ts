import { createId } from "@paralleldrive/cuid2";

export const newField = (select: any, pks: Record<string, string>) => {
  const result = [];

  for (const [k, v] of Object.entries(select) as any) {
    if (typeof v === "object") {
      const res = Object.keys(v.select)
        .filter((e) => e !== pks[k])
        .map((e) => `cell.value?.["${k}"]?.["${e}"] || ''`)
        .join('+ " " +');

      result.push({
        id: createId(),
        adv: {
          js: `\
<>
  {cell.key === "${k}" && (
    <div {...props} className={cx(props.className, "")}>
      {Array.isArray(cell.value) ? cell.value.length + ' items' : ${res}}
    </div>
  )}
</>`,
          css: "",
          jsBuilt: `\
render(
  React.createElement(
    React.Fragment,
    null,
    cell.key === "${k}" &&
      React.createElement(
        "div",
        Object.assign({}, props, { className: cx(props.className, "") }),
        ${res}
      )
  )
)`,
        },
        dim: {
          h: "full",
          w: "full",
        },
        name: k,
        type: "item",
        childs: [],
        script: {},
      });
    } else {
      result.push({
        id: createId(),
        adv: {
          js: `\
<>
  {cell.key === "${k}" && (
    <div {...props} className={cx(props.className, "")}>
      {cell.value}
    </div>
  )}
</>`,
          css: "",
          jsBuilt: `\
render(
  React.createElement(
    React.Fragment,
    null,
    cell.key === "${k}" &&
      React.createElement(
        "div",
        Object.assign({}, props, { className: cx(props.className, "") }),
        cell.value
      )
  )
)`,
        },
        dim: {
          h: "full",
          w: "full",
        },
        name: k,
        type: "item",
        childs: [],
        script: {},
      });
    }
  }

  return result;
};
