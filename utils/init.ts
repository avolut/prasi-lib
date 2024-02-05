const w = window as any;
if (typeof isEditor === "undefined") {
  if (
    location.hostname === "prasi.avolut.com" &&
    location.pathname.startsWith("/ed")
  ) {
    w.isEditor = true;
  } else {
    w.isEditor = false;
  }
}
w.isMobile = false;
w.isDesktop = false;
