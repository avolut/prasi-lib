import { LinkParam } from "lib/comps/form/field/type/TypeLink";
import { hashSum } from "lib/utils/hash-sum";
import { getPathname } from "lib/utils/pathname";

const w = window as any;

export const overrideNav = (arg?: { local?: any }) => {
  if (!w.prasi_menu && !isEditor) {
    w.prasi_menu = { nav_override: true, nav: w.navigate, pm: null };
    w.navigate = (async (_href, params) => {
      if (!_href) {
        console.error("Failed to navigate, empty url");
        return;
      }
      if (_href.startsWith("/")) {
        const url = new URL(location.href);
        const newurl = new URL(`${url.protocol}//${url.host}${_href}`);
        const pathname = newurl.pathname;

        _href = baseurl(_href);
        if (params) {
          const prefix: LinkParam["prefix"] =
            params.breads?.map((e) => {
              return {
                label: e.label,
                url: e.url || getPathname({ hash: true }),
              };
            }) || [];

          const values: LinkParam = {
            name: params.name,
            url: getPathname({ hash: true }),
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
          if (arg?.local) {
            arg.local.loading = true;
            arg.local.render();
          }
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
};
