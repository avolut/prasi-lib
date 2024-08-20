export const kvToJSON = (input: [string, unknown][]) => {
  return input
    .filter(([k, v]) => {
      return true; // some irrelevant conditions here
    })
    .reduce((accum: any, [k, v]) => {
      accum[k] = v;
      return accum;
    }, {}) as Record<string, any>;
};
