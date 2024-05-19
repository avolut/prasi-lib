import { BreadItem } from "@/comps/custom/Breadcrumb";
import { FMLocal } from "@/comps/form/typings";
import { GFCol } from "@/gen/utils";
import { ReactNode } from "react";

type ID_MASTER_DETAIL = string;
export const w = window as unknown as {
  generating_prasi_md: Record<string, true>;
  md_panel_master: any;
  md_active_tab: Record<ID_MASTER_DETAIL, string>;
  md_internal: Record<string, any>;
};

export type MDProps = {
  child: any;
  PassProp: any;
  name: string;
  mode: "full" | "h-split" | "v-split";
  show_head: "always" | "only-master" | "only-child" | "hidden";
  tab_mode: "h-tab" | "v-tab" | "hidden";
  editor_tab: string;
  gen_fields: any;
  gen_table: string;
  on_init: (md: MDLocal) => void;
  _item: PrasiItem;
};

export type MDActions = {
  action?: string;
  label: ReactNode;
  onClick?: (e: any) => Promise<void>;
}[];

export type MDLocalInternal = {
  name: string;
  breadcrumb: BreadItem[];
  actions: MDActions;
  selected: any;
  tab: {
    active: string;
    list: string[];
  };
  internal: { action_should_refresh: boolean };
  master: { internal: any; render: () => void };
  params: {
    hash: any;
    tabs: any;
    parse: () => void;
    apply: () => void;
  };
  pk?: GFCol;
  props: {
    mode: "full" | "h-split" | "v-split";
    show_head: "always" | "only-master" | "only-child" | "hidden";
    tab_mode: "h-tab" | "v-tab" | "hidden";
    editor_tab: string;
    gen_fields: any;
    gen_table: string;
    on_init: (md: any) => void;
  };
  childs: Record<
    string,
    {
      name: string;
      label: string;
      hide: () => void;
      show: () => void;
      render: () => void;
      internal: any;
      fm?: FMLocal;
      md?: MDLocal;
      list?: any;
    }
  >;
  panel: {
    size: number;
    min_size: number;
  };
};
export type MDRef = { PassProp: any; child: any };
export type MDLocal = MDLocalInternal & { render: (force?: boolean) => void };

export const MasterDetailType = `const md = {
  name: string;
  breadcrumb: {
    label: React.ReactNode;
    url?: string;
    onClick?: () => void;
  }[];
  actions: (
    { 
      action?: string;
      label: React.ReactNode; 
      onClick?: (e: any) => Promise<void>
    } 
  )[];
  selected: any;
  tab: {
    active: string;
    list: string[];
  };  
  params: {
    hash: any;
    tabs: any;
    parse: () => void;
    apply: () => void;
  };
  props: {
    mode: "full" | "h-split" | "v-split";
    show_head: "always" | "only-master" | "only-child" | "hidden";
    tab_mode: "h-tab" | "v-tab" | "hidden";
    editor_tab: string;
    gen_fields: any;
    gen_table: string;
    on_init: (md: any) => void;
  };
  internal: { action_should_refresh: boolean };
  render: () => void;
  master: { internal: any; render: () => void; };
  pk?: {
    name: string;
    type: string;
    is_pk: boolean;
    optional: boolean;
    relation?: {
      from: { table: string; fields: string[] };
      to: { table: string; fields: string[] };
      fields: GFCol[];
    };
  };
  childs: Record<
    string,
    {
      name: string;
      hide: () => void;
      show: () => void;
      render: () => void;
      internal: any;
      data: any;
      fm?: fm;
      md?: md;
    }
  >;
  panel: {
    size: number;
    min_size: number;
  };
};`;
