import { set } from "lib/utils/set";

const cache: any = [];

export const gen_object_rel =  (rels: Array<any>) => {
  let result = {} as Record<string,any>;
  if(rels.length){
    rels.map((rel) => {
      if(typeof rel === "string"){
        let col = JSON.parse(rel);
        set(result, col.name, true);
      }else{
        if(typeof rel === "object"){
          let relation = gen_object_rel(rel.checked);
          let val = JSON.parse(rel.value);
          set(result, val.name, relation);
        }
      }
    })
  }
  return result;
};
