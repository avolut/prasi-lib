export const getPathname = () => {
  if (["localhost", "prasi.avolut.com"].includes(location.hostname)) {
    if (location.pathname.startsWith("/vi")) {
      return '/' + location.pathname.split("/").slice(3).join('/');
    }
  }
  return location.pathname
};
