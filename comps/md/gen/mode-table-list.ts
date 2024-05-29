export const modeTableList = (mode: string) => {
  let sub_name = "fields";
  switch (mode) {
    case "table":
      sub_name = "tbl-col";
      break;
    case "list":
      sub_name = "md-list";
      break;
  }
  return sub_name;
};
