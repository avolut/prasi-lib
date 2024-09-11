import type { LinkParam } from "lib/comps/form/field/type/TypeLink";
export const link_cache = {} as Record<string, any>;

export const fetchLinkParams = async (
  parsed_link?: ReturnType<typeof parseLink>
) => {
  const parsed = parsed_link || parseLink();

  return await Promise.all(
    parsed.map(async (e) => {
      if (link_cache[e]) {
        return link_cache[e] as LinkParam;
      }

      const result = await api._kv("get", e);
      link_cache[e] = result;
      return result as unknown as LinkParam;
    })
  );
};

export const parseLink = () => {
  const lnk = location.hash.split("#").find((e) => e.startsWith("lnk="));

  if (lnk) {
    const res = lnk.split("=").pop() || "";
    if (res) {
      return res.split("+");
    }
  }
  return [];
};

export const lastParams = async () => {
  const parsed = parseLink();
  if (parsed.length > 0) {
    const res = await fetchLinkParams([parsed.pop() || ""]);
    return res[0];
  }
  return null;
};
