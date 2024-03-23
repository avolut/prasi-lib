export type FieldOptions = (opt: {
  data: any;
  current_name: string;
  where?: { values: string[] }
}) => Promise<(string | FieldListItem)[]>

export type FieldListItem = { value: string; label: string }