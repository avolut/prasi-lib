import { FC, useEffect } from "react";
import { FMLocal, FieldLocal, FieldProp } from "../../typings";
import { useLocal } from "@/utils/use-local";
import parser from "any-date-parser";
import { AutoHeightTextarea } from "@/comps/custom/AutoHeightTextarea";
import { M } from "src/data/unitShortcuts";
import { format } from "date-fns";
import get from "lodash.get";

export const FieldToggle: FC<{
  field: FieldLocal;
  fm: FMLocal;
  arg: FieldProp;
}> = ({ field, fm, arg }) => {
  const local = useLocal({
    list: [] as any[],
    value:[] as any[]
  });
  useEffect(() => {
    const callback = (res: any[]) => {
      local.list = res;
      if(Array.isArray(res)){
        local.value = res.map((e) => get(e, arg.pk))
      }
      local.render();
    };
    const res = arg.on_load();
    if (res instanceof Promise) res.then(callback);
    else callback(res);
  }, []);
  let listValue = []
  let value: any = fm.data[field.name];
  let checked = local.value.indexOf(value) > 0 ? true: false;
  
  if(local.list.length < 2){
    return <>Minimum dan maksimal 2 Data</>
  }
  return (
    <>
      <div
        className={cx(
          "c-flex c-items-center c-justify-start c-w-full"
        )}
      >
        <label className="c-flex c-items-center c-cursor-pointer">
        <div className="c-mr-3 c-text-gray-700 c-font-medium">{get(local,"list[0].label")}</div>
          <div
            className={cx(
              "c-relative",
              css`
                input:checked ~ .dot {
                  transform: translateX(100%);
                  background-color: #48bb78;
                }
              `
            )}
          >
            <input type="checkbox" id="toggleB" checked={checked} className="c-sr-only" onChange={(e) =>  {
              const check = e.target.checked;
              
              if(check){
                fm.data[field.name] = local.value[1];
              }else{
                fm.data[field.name] = local.value[0];
              }
              fm.render();
              console.log({data: fm.data})
              // if(val) value = local.list[0];
              // value = local.list[1]
            }}/>
            <div className="c-block c-bg-gray-600 c-w-8 c-h-5 c-rounded-full"></div>
            <div
              className={cx(
                "dot c-absolute c-left-1 c-top-1 c-bg-white c-w-3 c-h-3 c-rounded-full c-transition"
              )}
            ></div>
          </div>
          <div className="c-ml-3 c-text-gray-700 c-font-medium">{get(local,"list[1].label")}</div>
        </label>
      </div>
    </>
  );
};
