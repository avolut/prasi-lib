export const baseurl = (url: string) => {
  if (location.hostname === "prasi.avolut.com") {
    const id_site = location.pathname.split("/")[2];
    if (url.startsWith("/")) return `/prod/${id_site}${url}`;
    else return `/prod/${id_site}/${url}`;
  }
  return url;
};
