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
    clear(name) {
      if (name) delete this._internal[name];
      else this._internal = {};
    },
    get(name) {
      return this._internal[name] || [];
    },
    set(name, error) {
      this._internal[name] = error;
    },
  } as FMLocal["error"] & {
    _internal: Record<string, string[]>;
  };
  return error;
};
