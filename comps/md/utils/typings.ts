import { BreadItem } from "@/comps/custom/Breadcrumb";
import { GFCol } from "@/gen/utils";
import { ReactNode } from "react";

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
      data: any;
    }
  >;
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
    }
  >;
};`;
