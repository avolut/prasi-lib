import { FMLocal, FieldInternal, FieldLocal, FieldProp } from "../typings";

export const fieldMapping: {
  [K in FieldProp["type"]]: {
    id: string;
    props?:
      | Record<string, any>
      | ((
          fm: FMLocal,
          field: FieldInternal<K> & {
            render: () => void;
          }
        ) => Record<string, any>);
  };
} = {
  text: { id: "ca7ac237-8f22-4492-bb9d-4b715b1f5c25", props: { type: "text" } },
  relation: {
    id: "69263ca0-61a1-4899-ad5f-059ac12b94d1",
    props: (fm, field) => {
      const rel = fm.field_def[field.name];
      if (rel) {
        if (field.prop && !field.prop.type) {
          return { type: rel.type };
        }
      }
      return {};
    },
  },
};
