import { FieldProp } from "../typings";

export const fieldMapping: Record<
  FieldProp["type"],
  { id: string; props: any }
> = {
  text: { id: "ca7ac237-8f22-4492-bb9d-4b715b1f5c25", props: { type: "text" } },
  number: {
    id: "ca7ac237-8f22-4492-bb9d-4b715b1f5c25",
    props: { type: "number" },
  },
} as any;
