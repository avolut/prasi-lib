import { ReactNode } from "react";

export type PFTypes = {
  on_load: (arg: {
    params: any;
  }) => Promise<any>;
  detail: (item: any) => Record<string, [string, string, string]>;
  on_delete: () => Promise<void>;
  on_update: () => Promise<void>;
  child: ReactNode
  PassProp: any;
  pht__on_load: (item: any) => string;
  url_upload: string;
};
