import { GFCol } from "@/gen/utils";
import { ReactNode } from "react";

export type MDBreadcrumb = [string, string, string][];
export type MDActions = (
  | { text: ReactNode; onClick?: (e: any) => Promise<void> }
  | ReactNode
)[];

export type MDLocalInternal = {
  name: string;
  breadcrumb: MDBreadcrumb;
  actions: MDActions;
  selected: any;
  tab: {
    active: string;
    list: string[];
  };
  master: { internal: any; render: () => void; pk: null | GFCol };
  params: {
    hash: any;
    tabs: any;
  };
  props: {
    child_mode: "full" | "h-split" | "v-split";
    show_head: "always" | "only-master" | "only-child" | "hidden";
    tab_mode: "h-tab" | "v-tab" | "hidden";
  };
  childs: Record<
    string,
    {
      title: string;
      breadcrumb: MDBreadcrumb;
      actions: MDActions;
      hide: () => void;
      show: () => void;
      render: () => void;
      internal: any;
      data: any;
    }
  >;
};

export type MDLocal = MDLocalInternal & { render: (force?: boolean) => void };

export const MasterDetailType = `{
  breadcrumb: [string, string, string][];
  actions: (
    | { text: ReactNode; onClick?: (e: any) => Promise<void> }
    | ReactNode
  )[];
  selected: any;
  tab: {
    active: string;
    list: string[];
  };
  internal: { main: any; childs: any[] };
};`;
