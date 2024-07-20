export const getPathname = (opt?: { hash?: boolean }) => {
  if (
    ["prasi.avolut.com"].includes(location.hostname) ||
    location.host === "localhost:4550"
  ) {
    if (
      location.pathname.startsWith("/vi") ||
      location.pathname.startsWith("/prod") ||
      location.pathname.startsWith("/deploy")
    ) {
      const hash = location.hash;

      if (hash !== "" && opt?.hash !== false) {
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
