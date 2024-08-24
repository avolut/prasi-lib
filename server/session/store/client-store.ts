import { SessionData } from "../type";

const w = window as unknown as { _prasi?: { site_id?: string } };

export const sessionClientStore = <T>() => ({
  async load(): Promise<null | SessionData<T>> {
    if (w._prasi?.site_id) {
      const cur = localStorage.getItem(`sid-${w._prasi?.site_id}`);
      try {
        return JSON.parse(cur || "");
      } catch (e) {}
    }
    return null;
  },
});
