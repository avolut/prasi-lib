import get from "lodash.get";

export const sum = (items: any[], keyName: string) => {
  return items.reduce(function (a, b) {
    return (Number(a) || 0) + (Number(get(b, keyName)) || 0);
  }, 0);
};
