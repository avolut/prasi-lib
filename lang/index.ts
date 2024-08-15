import { AvailableLang, LangKeyword } from "./type";

export const lang = {
  async init(current: AvailableLang) {
    this.current = current;
    if (current === "en") this.base = (await import("./en")).langEn as any;
    if (current === "id") this.base = (await import("./id")).langId as any;
  },
  current: "en" as AvailableLang,
  t(keyword: LangKeyword, args?: Record<string, string>): string {
    let final = this.base?.[keyword] || keyword;
    if (args) return final.replace(/{(.*?)}/g, (_, offset) => args[offset]);
    return final;
  },
  base: null as null | Record<LangKeyword, string>,
};

export const translate = lang.t;