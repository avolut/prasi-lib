import { ReactNode } from "react";

export type PTProp = {
  name?: string;
  child?: ReactNode;
  header?: ReactNode;
  body?: ReactNode;
  on_click?: () => void;
  tab: "string";
  PassProp: any;
  item: PrasiItem;
  pt: PTLocalInternal
};

export type PTLocalInternal = {
  mode: string;
};
export type PTLocal = PTLocalInternal & { render: (force?: boolean) => void };
