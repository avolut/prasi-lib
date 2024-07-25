export const walkGenForm = (
  new_childs: IItem[],
  existing_childs: PrasiItem[]
) => {
  const fields = {} as Record<string, PrasiItem>;

  for (const item of new_childs[0].childs) {
    const name = item.component?.props?.name;
    console.log(name);
  }
  //   for (const item of existing_childs) {
  //     walk(item);
  //   }
};

const walk = (item: IItem) => {
  if (item.component?.id) {
    console.log(item);
  }

  for (const child of item.childs) {
    walk(child);
  }
};
