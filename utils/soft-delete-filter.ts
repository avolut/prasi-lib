export const softDeleteFilter = (
  where: any,
  soft: {
    field: string;
    type: "boolean" | "nullable";
  }
) => {
  console.log({ where });
  const defaultParam = typeof where === "object" ? where : {};
  const result = {
    AND: [
      typeof where === "object"
        ? { ...defaultParam }
        : {
            [soft.field]:
              soft.type === "boolean"
                ? true
                : {
                    not: null,
                  },
          },
    ],
  };
  console.log(result);
  return result;
};
