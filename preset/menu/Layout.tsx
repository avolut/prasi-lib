import { overrideNav } from "lib/utils/override-nav";
import { getPathname } from "lib/utils/pathname";
import { useLocal } from "lib/utils/use-local";
import { FC, ReactNode, useLayoutEffect } from "react";
import { loadSession } from "../login/utils/load";
import { FieldLoading } from "lib/comps/ui/field-loading";

const w = window as any;
const initResponsive = function () {
  let mode = "desktop";
  if (isEditor) {
    const mode = localStorage.getItem("prasi-editor-mode");
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
  default_layout: ReactNode;
  exception?: ((path: string) => boolean) | Array<string>;
  blank_layout: ReactNode;
  login_url: string;
  PassProp: any;
};

export const Layout: FC<LYTChild> = (props) => {
  const local = useLocal({ loading: false, current_menu: "" });
  const render = local.render;
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

  initResponsive();
  const path = getPathname({ hash: true });
  const no_layout = props.exception;

  overrideNav({ local });

  if (
    !isEditor &&
    (typeof no_layout === "function"
      ? no_layout!(path)
      : Array.isArray(no_layout) &&
        no_layout.find((rule) => wildcardMatch(path, rule)))
  ) {
    return <>{props.blank_layout}</>;
  } else {
    if (!w.user) {
      local.loading = true;
      isMobile
        ? loadSession(props.login_url || "/m/auth/login")
        : loadSession(props.login_url || "/auth/login");

      local.loading = false;
    }
  }

  if (path === props.login_url) return props.blank_layout;
  if (!w.user && !isEditor && !isMobile) {
    return (
      <div
        className={cx(
          "c-w-full c-h-full c-flex c-items-center c-justify-center c-flex-1"
        )}
      >
        <FieldLoading />
      </div>
    );
  }

  return (
    <props.PassProp
      is_loading={local.loading}
      page_load={(on_load: (done: () => void) => void) => {
        local.loading = true;
        local.render();
        on_load(() => {
          local.loading = false;
          local.render();
        });
      }}
      layout={local}
      current_menu={local.current_menu}
    >
      {props.default_layout}
    </props.PassProp>
  );
};

function wildcardMatch(str: string, rule: string): boolean {
  const escapeRegex = (str: string): string =>
    str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  return new RegExp(
    "^" + rule.split("*").map(escapeRegex).join(".*") + "$"
  ).test(str);
}
