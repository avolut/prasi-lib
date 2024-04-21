export const getPathname = (url?: string) => {
  // if (["localhost", "prasi.avolut.com"].includes(location.hostname)) {
  if (
    location.pathname.startsWith("/vi") ||
    location.pathname.startsWith("/prod") ||
    location.pathname.startsWith("/deploy")
  ) {
    const hash = location.hash;
    if (url?.startsWith("/prod")) {
      return "/" + url.split("/").slice(3).join("/");
    }

    if (hash !== "") {
      return "/" + location.pathname.split("/").slice(3).join("/") + hash;
    } else {
      return "/" + location.pathname.split("/").slice(3).join("/");
    }
  }
  // }
  return location.pathname;
};
