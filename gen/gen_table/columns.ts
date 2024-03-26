import { GFCol, formatName } from "../utils";

export const gen_columns = (cols: GFCol[]) => {
  return `async (): Promise<
    { key: string; name: string; width?: number; frozen?: boolean }[]
  > => {
    return [
      { key: "id", name: "#", width: 60, frozen: true },
${cols
  .filter((e) => {
    if (e.is_pk) return false;
    return true;
  })
  .map((e) => {
    return (
      "      " +
      JSON.stringify({
        key: e.name,
        name: formatName(e.name),
      })
    );
  })
  .join(",\n")}
    ];
  }`;
};
