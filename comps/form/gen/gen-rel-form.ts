import { generateSelect } from "lib/comps/md/gen/md-select";
import { get_rel_many } from "./get_rel_many";
import { parseGenField } from "lib/gen/utils";

export const genRelForm = (rel: any) => {
    const raw_fields = JSON.parse(rel) as (
        | string
        | { value: string; checked: string[] }
      )[];
  const fields = parseGenField(raw_fields);
  const res = generateSelect(fields);
  const rel_many = get_rel_many(fields);
}