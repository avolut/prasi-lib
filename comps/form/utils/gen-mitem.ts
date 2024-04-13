import { FMLocal, FieldLocal } from "../typings";

export const genFieldMitem = (arg: {
  _meta: any;
  _item: any;
  fm: FMLocal;
  field: FieldLocal;
}) => {
  const { _meta, _item, fm, field } = arg;
  const m = _meta[_item.id];
  if (m) {
    const mitem = m.mitem;
    if (mitem) {
      const childs = mitem
        .get("component")
        ?.get("props")
        ?.get("child")
        ?.get("content")
        ?.get("childs");

      // console.log(field.name, childs);
    }
  }
};
export const updateFieldMItem = (_meta: any, _item: any) => {
  const m = _meta[_item.id];
  if (m) {
    const mitem = m.mitem;
    if (mitem) {
      
    }
  }
};
