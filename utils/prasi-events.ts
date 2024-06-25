import { FMLocal } from "../..";

const events = {
  form: {
    where: async (fm: FMLocal, where: any) => {},
    before_update: async (fm: FMLocal) => {},
    after_update: async (fm: FMLocal) => {},
    before_insert: async (fm: FMLocal) => {},
    after_insert: async (fm: FMLocal) => {},
    before_load: async (fm: FMLocal) => {},
    after_load: async (fm: FMLocal) => {},
  },
  tablelist: { where: async (where: any) => {} },
};

let w = null as any;
if (typeof window !== "undefined") {
  w = window;
  if (!w.prasi_events) {
    w.prasi_events = events;
  }
}

type PRASI_EVENT = typeof events;
export const prasi_events: PRASI_EVENT = w.prasi_events;
export const call_prasi_events = async <
  K extends keyof PRASI_EVENT,
  L extends keyof PRASI_EVENT[K]
>(
  k: K,
  l: L,
  args: any[]
) => {
  const fn = prasi_events?.[k]?.[l] as any;

  if (fn) {
    await fn(...args);
  }
};
