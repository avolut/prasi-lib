import { getPathname } from "lib/utils/pathname";
import { FC, ReactNode, useLayoutEffect, useState } from "react";
import { loadSession } from "../login/utils/load";

const w = window as any;
const fn = function () {
  const mode = localStorage.getItem("prasi-editor-mode");
  if (isEditor) {
    setTimeout(() => {
      if (mode === "mobile") {
        w.isMobile = true;
        w.isDesktop = false;
      } else {
        w.isMobile = false;
        w.isDesktop = true;
      }
    }, 50);
  } else {
    if (mode === "desktop") {
      if (window.matchMedia("screen and (max-width: 768px)").matches) {
        w.isMobile = true;
        w.isDesktop = false;
      } else {
        w.isMobile = false;
        w.isDesktop = true;
      }
    }
  }
};
type LYTChild = {
  mobile?: ReactNode;
  desktop?: ReactNode;
  tablet?: ReactNode;
  child?: ReactNode;
  children: ReactNode;
  exception?: Array<string>;
};

export const Layout: FC<LYTChild> = (props) => {
  const [_, set] = useState({});
  const render = () => set({});
  useLayoutEffect(() => {
    if (!isEditor) {
      window.addEventListener("resize", render);
      return () => {
        window.removeEventListener("resize", render);
      };
    } else {
      const el = document.querySelector(".main-editor-content");

      if (el) {
        const rx = new ResizeObserver(render);
        rx.observe(el);
        return () => {
          rx.disconnect();
        };
      }
    }
  }, []);

  fn();
  console.log({props})
  const path = getPathname();
  const no_layout = ["/dev/auth"];
  if (Array.isArray(no_layout))
    if (no_layout.length) {
      if (no_layout.includes(path)) {
        return <>{props.children}</>;
      }
    }
  loadSession("/dev/auth");
  return <>{props.children}</>;
  // // const no_layout = ["/login", "/"];
  //
  // // if (no_layout.includes(path) || path.startsWith("/dev")) return children;
  // if (Array.isArray(props.exception))
  //   if (props.exception.length) {
  //     if(props.exception.includes(path)){
  //       return <>{props.children}</>
  //     }
  //   }
  // if (w.isMobile) return <>{props.mobile}</>;
  // return <>{props.desktop}</>;
};
