export const getPathname = (url?: string) => {
  if (["prasi.avolut.com"].includes(location.hostname)) {
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
  }
  return location.pathname;
};

export const getBasename = () => {
  if (location.pathname.startsWith("/prod")) {
    return location.pathname.split("/").slice(0, 3).join("/");
  }
  return "";
};
