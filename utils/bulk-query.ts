export const bulk_query = async ({
  list,
  task,
}: {
  list: any[];
  task: (e: any, index?: number) => Promise<void>;
}) => {
  const recursive = async (data: any, list: Array<any>, index: number) => {
    if (list.length) {
      await task(data, index);
      index++;
      if (index <= list.length - 1) {
        await recursive(list[index], list, index);
      }
    }
  };
  await recursive(list[0], list, 0);
};
