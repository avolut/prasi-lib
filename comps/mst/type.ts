import { GFCol } from "@/gen/utils";
import { ReactElement, ReactNode } from "react";

export type MasterDetailProp = {
  header: any;
  PassProp: any;
  master: any;
  detail: any;
  mode: "breadcrumb" | "vertical" | "horizontal";
  title: string;
  actions: (md: any) => MasterDetailAction[];
  gen_fields: any;
  name: string;
};

type MasterDetailAction = {
  label: string;
  onClick?: () => Promise<void>;
  type?: "default" | "ghost" | "secondary" | "destructive";
  icon?: string;
};

export type MasterDetailLocal = {
  name: string;
  mode: MasterDetailProp["mode"];
  selected: null | Record<string, any>;
  active_tab: string;
  ui: {
    back: boolean;
    title: string;
    breadcrumb: ([string, string] | string)[];
    default_actions: MasterDetailAction[];
    actions: MasterDetailAction[];
  };
  cache: (name: string, opt?: { reset: boolean }) => any;
  pk: null | GFCol;
};

export type MasterDetailConfig = MasterDetailLocal & { render: () => void };

const action_type = `{
  label: string;
  onClick?: () => Promise<void>;
  type?: "default" | "ghost" | "secondary" | "destructive";
  icon?: string;
}`;

export const master_detail_typings = {
  md: `{ 
    mode: "breadcrumb" | "vertical" | "horizontal";
    selected: null | Record<string, any>;
    active_tab: string;
    render: () => void;
    ui: {
      back: boolean;
      title: string;
      breadcrumb: ([string, string] | string)[];
      default_actions: ${action_type}[];
      actions: ${action_type}[];
    };
    cache: (name: string, opt?: { reset: boolean }) => any;
    pk: null | any
  }`,
  action_type,
};
