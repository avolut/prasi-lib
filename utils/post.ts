export const _post = async (
  path: string,
  data: any,
  arg?: { mode: "auto" | "always-prod" }
) => {
  const final_path = path.startsWith("/") ? path : `/${path}`;

  let _url = baseurl(final_path);

  if (
    location.hostname === "prasi.avolut.com" ||
    location.host === "localhost:4550"
  ) {
    if (arg?.mode === "always-prod") {
      const newurl = new URL(location.href);
      newurl.pathname = `/_proxy/${_url}`;
      _url = newurl.toString();
    }
  }

  const res = await fetch(_url, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return await res.json();
};
