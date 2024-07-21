export const modeTableList = (mode: string) => {
  let sub_name = "table: columns";
  switch (mode) {
    case "table":
      sub_name = "table: columns";
      break;
    case "list":
      sub_name = "list: rows";
      break;
  }
  return sub_name;
};
