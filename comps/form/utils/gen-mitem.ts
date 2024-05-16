import { newField } from "@/gen/gen_form/new_field";
import { FMLocal, FieldLocal } from "../typings";
import get from "lodash.get";
import { fieldMapping } from "../field/mapping";
import { createItem } from "@/gen/utils";

export const genFieldMitem = (arg: {
  _meta: any;
  _item: any;
  _sync: any;
  fm: FMLocal;
  field: FieldLocal;
}) => {
  const { _meta, _item, _sync, fm, field } = arg;
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
      let component = fieldMapping[field.type as "text"];

      if (!component) {
        component = fieldMapping["text"];
      }

      if (component) {
        const item = createItem({
          component: component as any,
        });

        _sync(childs, [...childs.toJSON(), item]);
      }
    }
  }
};

export const updateFieldMItem = (_meta: any, _item: any, _sync: any) => {
  const m = _meta[_item.id];
  if (m) {
    const mitem = m.mitem;
    if (mitem) {
      _sync(mitem, _item);
    }
  }
};
