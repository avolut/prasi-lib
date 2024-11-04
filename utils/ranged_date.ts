export const range_date = (param: { data: any, name: any }) => {
    const {data, name} = param;
    let result = null as any;
    Object.keys(data).map((e) => {
      if (["lte", "gte", "gt", "lt"].includes(e)) {
        if (data?.[e] instanceof Date) {
          const today = data?.[e];
          const day = new Date(today);
          if (["lte", "lt"].includes(e)) {
            day.setHours(23, 59, 59, 999); // Mengatur waktu ke 23:59:59
          } else if (["gte", "gt"].includes(e)) {
            day.setHours(0, 0, 0, 0); // Mengatur waktu ke 00:00:
          }
          result = {
            ...result,
            [e]: day,
          };
        }
      }
    });
    if (result)
      return {
        [name]: result,
      };
    return result;
    
};
