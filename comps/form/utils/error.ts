import { FMLocal } from "../typings";

export const formError = (fm: FMLocal) => {
  const error = {
    _internal: {},
    get list() {
      const res = Object.entries(this._internal).map(([name, error]) => {
        return { name, error };
      });

      return res;
    },
    get object() {
      const result: any = {};
      Object.entries(this._internal).map(([name, error]) => {
        result[name] = error.join("\n");
      });
      return {};
    },
    clear(name) {
      if (name) delete this._internal[name];
      else this._internal = {};
    },
    get(name) {
      if (fm.status && fm.status !== "ready") return [];
      return this._internal[name] || [];
    },
    set(name, error) {
      this._internal[name] = error as any;
    },
  } as FMLocal["error"] & {
    _internal: Record<string, string[]>;
  };
  return error;
};
