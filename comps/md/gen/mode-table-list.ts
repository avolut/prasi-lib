export const modeTableList = (mode: string) => {
  let sub_name = "tbl-col";
  switch (mode) {
    case "table":
      sub_name = "tbl-col";
      break;
    case "list":
      sub_name = "list-row";
      break;
  }
  return sub_name;
};
