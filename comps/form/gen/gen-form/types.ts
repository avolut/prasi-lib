export type GenFormArgs = {
  result: any;
  pk: string;
  pks: Record<string, string>;
  table: string;
  is_md: boolean;
  select: any;
  rel_many: {
    table: string;
    fk: string;
  }[];
};
