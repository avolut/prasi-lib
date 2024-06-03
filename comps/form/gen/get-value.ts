export const get_value = ({
  pk,
  table,
  select
}: {
  pk: string;
  table: string;
  select: any;
}) => {
  const sample = {} as any;
  const cols = [];
  for (const [k, v] of Object.entries(select) as any) {
    if (k !== pk && typeof v !== "object") {
      cols.push(k);
    }
  }
  return `\
    (arg: {
      options: { label: string; value: string; item?: string }[];
      fm: FMLocal;
      name: string;
      type: string;
    }) => {
      const { options, fm, name, type } = arg;
      if(isEditor){
        return fm.data[name];
      }
      let result = null;
      result =  fm.data[name];
      try{
        const data = fm.data[${table}];
        if(typeof data === "object"){
          if(typeof data?.connect?.${pk} === "string"){
            result = data.connect.${pk};
          }
        }
      }catch(ex){
      }
      return result;
    }
  `;
};
