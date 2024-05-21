export const generateMasterDetail = async (item: PrasiItem) => {
  const childs = item.edit.childs[0].edit.childs;

  const master = childs.find(
    (e) => e.component?.id === "c68415ca-dac5-44fe-aeb6-936caf8cc491"
  );

  if (master) {
    master.edit.setProp("on_load", {
      mode: "raw",
      value: `async (text: string) => {
        alert("ASdas");
      }`,
    });

    await master.edit.commit();
  }
};
