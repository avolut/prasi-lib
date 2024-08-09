import { FieldLocal } from "lib/comps/form/typings";
import { MDLocal } from "lib/comps/md/utils/typings";
import { FMLocal } from "../..";
import { Prisma } from "../../typings/prisma";
import { set } from "./set";

const events = {
  form: {
    where: async (fm: FMLocal, where: any) => {},
    before_save: async (fm: FMLocal, record: any) => {},
    relation_before_save: async (table: string, record: any) => {},
    after_save: async (fm: FMLocal, record: any) => {},
    before_load: async (fm: FMLocal) => {},
    after_load: async (fm: FMLocal) => {},
    before_delete: async (md: MDLocal, fm: FMLocal) => {
      return {
        preventDelete: false as boolean,
        navigateBack: true as boolean,
      };
    },
  },
  field: {
    on_change: async (fm: FMLocal, field: FieldLocal) => {},
    relation_load: async (fm: FMLocal, field: FieldLocal) => {
      return {} as Record<string, any>;
    },
  },
  tablelist: {
    after_load: async <T extends Prisma.ModelName>(
      table: T,
      items: any[],
      modify: (items: any[]) => any[]
    ) => {},
    where: async <T extends Prisma.ModelName>(table: T, where: any) => {},
  },
};

type TriggerOnChange = {
  fm: FMLocal;
  md: any;
  where: any;
};
type PRASI_EVENT = typeof events;
export const prasi_events = <
  K extends keyof PRASI_EVENT,
  L extends keyof PRASI_EVENT[K]
>(
  k: K,
  l: L,
  fn?: PRASI_EVENT[K][L]
) => {
  const w = window as any;
  if (!w.__prasi_custom_events) {
    w.__prasi_custom_events = events;
  }
  if (fn) {
    set(w.__prasi_custom_events, `${k}.${l as string}`, fn);
  }
  return w.__prasi_custom_events?.[k]?.[l];
};
export const call_prasi_events = async <
  K extends keyof PRASI_EVENT,
  L extends keyof PRASI_EVENT[K]
>(
  k: K,
  l: L,
  args: any[]
) => {
  const fn = prasi_events(k, l);

  if (fn) {
    return await fn(...args);
  }
  return null;
};
