import { ReactNode } from "react";

export type IMenu = [string, any, string | IMenu[]];
export type MenuProp = {
  role: string;
  on_init: () => string;
  menu: Array<Record<string, IMenu[]>>;
  PassProp: any;
  child: ReactNode;
  mode: "full" | "mini";
  item: PrasiItem;
  style: "navbar" | "sidebar"
};
export type MenuActive = {
  data: any;
  label?: string;
  path?: string;
  expand?: boolean;
  active?: true;
};

export type IMenuItem = {
  data: IMenu[];
  child: ReactNode
}