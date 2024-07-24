import { getPathname } from "lib/utils/pathname";
import { FC, ReactNode, useEffect, useLayoutEffect, useState } from "react";
import { loadSession } from "../login/utils/load";
import { useLocal } from "lib/utils/use-local";
import { FieldLoading } from "lib/exports";
import { LinkParam } from "lib/comps/form/field/type/TypeLink";
import { hashSum } from "lib/utils/hash-sum";

const w = window as any;
const initResponsive = function () {
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
  default_layout: ReactNode;
  exception?: Array<string>;
  blank_layout: ReactNode;
  login_url: string;
  PassProp: any;
};

export const Layout: FC<LYTChild> = (props) => {
  const local = useLocal({ loading: false });
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
  const path = getPathname();
  const no_layout = props.exception;

  if (!w.prasi_menu && !isEditor) {
    w.prasi_menu = { nav_override: true, nav: w.navigate, pm: null };
    w.navigate = (async (_href, params) => {
      if (_href.startsWith("/")) {
        const url = new URL(location.href);
        const newurl = new URL(`${url.protocol}//${url.host}${_href}`);
        const pathname = newurl.pathname;

        let link_params = "";
        if (params) {
          const prefix: LinkParam["prefix"] =
            params.breads?.map((e) => {
              return { label: e.label, url: e.url || getPathname() };
            }) || [];

          const values: LinkParam = {
            url: getPathname({ hash: false }),
            prefix,
            hash: "",
            create: params.create,
            update: params.update,
            where: params.where,
          };

          const vhash = hashSum(values);
          values.hash = vhash;

          await api._kv("set", vhash, values);

          const lnk = location.hash
            .split("#")
            .find((e) => e.startsWith("lnk="));
          let prev_link = "";
          if (lnk) {
            prev_link = lnk.split("=").pop() || "";
            if (prev_link) prev_link = prev_link + "+";
          }
          _href = `${_href}#lnk=${prev_link + vhash}`;
        }

        if (preloaded(pathname)) {
          w.prasi_menu.nav(_href);
        } else if (w.prasi_menu.pm?.on_load) {
          let done = { exec: () => {} };
          w.prasi_menu.pm?.on_load((exec: any) => {
            done.exec = exec;
          });
          await preload(pathname);
          setTimeout(() => {
            w.prasi_menu.nav(_href);
            done.exec();
          }, 500);
        } else {
          await preload(pathname);
          w.prasi_menu.nav(_href);
        }
      }
    }) as typeof navigate;
  }

  if (
    !isEditor &&
    Array.isArray(no_layout) &&
    no_layout.find((rule) => wildcardMatch(path, rule))
  ) {
    return <>{props.blank_layout}</>;
  } else {
    if (!w.user) {
      local.loading = true;
      loadSession(props.login_url || "/auth/login");
      console.log(w.user);
    }
  }

  if (path === props.login_url) return props.blank_layout;
  if (!w.user && !isEditor) {
    return (
      <div
        className={cx(
          "c-w-full c-h-full c-flex c-items-center c-justify-center c-flex-1"
        )}
      >
        <FieldLoading />
      </div>
    );
  } else {
    local.loading = false;
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
