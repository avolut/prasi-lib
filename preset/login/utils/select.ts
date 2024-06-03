import { set } from "lib/utils/set";

export const select = (rel: any) => {
    const result = {};
    Object.entries(rel).map(([key, value]) => {
        if(typeof value === "object"){
            const res = select(value);
            set(result, `${key}.select`, res);
        }else{
            set(result, key, value)
        }
    })
    return result;
}