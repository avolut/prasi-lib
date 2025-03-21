import { getPathname } from "lib/utils/pathname";
import { useLocal } from "lib/utils/use-local";
import get from "lodash.get";
import { FC, useEffect, useRef } from "react";
import { IMenu, MenuProp } from "./utils/type-menu";
import { icons } from "app/icons";
import { FieldLoading } from "lib/exports";
// import { icon } from "../../..";

const local_default = {
  open: new Set<string>(),
  active: "",
  mode: "full" as "full" | "mini",
  open_timeout: null as any,
  nav_timeout: null as any,
  pathname: "",
  loading: false,
  init: false,
  ready: false,
  menu: [] as any[],
};
type MLocal = typeof local_default & { render: () => void };

export const Menu: FC<MenuProp> = (props) => {
  const ref = useRef<HTMLDivElement>(null);
  const local = useLocal({ ...local_default }, ({ setDelayedRender }) => {
    setDelayedRender(true);
  });
  const imenu = props.menu;
  // useEffect(() => {
  // }, []);
  if (local.pathname !== getPathname()) {
    local.pathname = getPathname();
  }
  if (!local.init) {
    local.active = "";
    local.init = true;
  }

  useEffect(() => {
    local.mode = props.mode;
      local.ready = false;
      local.render();
      if (typeof imenu === "function") {
        const res = imenu();
        if (res instanceof Promise) {
          res.then((e) => {
            local.menu = e;
            local.render();
          })
        }else{
          local.menu = res;
          local.render();

        }
      } else {
        let role = props.role;
        role = props.on_init();
        let menu = get(imenu, role) || [];
        local.menu = menu;
      }
      local.ready = true;
      local.render();
  }, [props.mode]);
  if (!local.ready) return <FieldLoading />;
  return (
    <div
      className={cx("c-overflow-y-auto c-relative c-h-full c-w-full c-flex-1")}
      ref={ref}
    >
      <div className="sidebar-menu c-absolute c-inset-0 c-flex c-flex-col c-flex-grow c-px-3 c-py-4 ">
        <SideBar
          data={local.menu}
          local={local}
          pm={props}
          depth={0}
          mode={local.mode}
          activate={(label) => {
            if (typeof props.layout !== "undefined") {
              props.layout.current_menu = label;
              props.layout.render();
            }
          }}
        />
      </div>
    </div>
  );
};

const w = window as unknown as {
  prasi_menu: {
    nav_override: boolean;
    nav: any;
    pm: any;
  };
  navigate: any;
};
export const SideBar: FC<{
  data: IMenu[];
  local: MLocal;
  depth: number;
  pm: MenuProp;
  mode: "full" | "mini";
  activate: (label: string) => void;
  expanded?: boolean;
  parent?: string;
}> = ({ data: _data, local, depth, pm, mode, expanded, parent, activate }) => {
  const PassProp = pm.PassProp;
  w.prasi_menu = {
    ...w.prasi_menu,
    pm,
  };
  const data: IMenu[] = (typeof _data[0] === "string" ? [_data] : _data) as any;
  if (!data.length) {
    return <></>;
  }
  useEffect(() => {
    data.map((item) => {
      const menu = {
        label: item[0],
        icon: item[1],
        value: item[2],
        hash: hashMenu(item),
      };

      if (typeof item[2] === "string" && local.pathname === item[2]) {
        let should_render = false;

        if (local.active !== menu.hash) {
          local.active = menu.hash;
          activate(menu.label);
          should_render = true;
        }
        if (!local.open.has(menu.hash)) {
          local.open.add(menu.hash);
          should_render = true;
        }
        if (should_render) {
          local.render();
        }
      }

      if (
        Array.isArray(menu.value) &&
        menu.value.length === 1 &&
        !local.open.has(menu.hash)
      ) {
        if ((parent && local.open.has(parent)) || depth === 0) {
          local.open.add(menu.hash);
          local.render();
        }
      }

      if (local.open.has(menu.hash) && parent && !local.open.has(parent)) {
        local.open.add(parent);
        local.render();
      }
    });
  }, [getPathname({ hash: true })]);

  return (
    <div
      className={cx(
        "c-flex c-flex-col c-flex-grow",
        depth > 0 ? " c-overflow-hidden" : ""
      )}
    >
      {data.map((item) => {
        const menu = {
          label: item[0],
          icon: item[1],
          value: item[2],
          hash: hashMenu(item),
        };

        if (Array.isArray(menu.value) && typeof menu.value[0] === "string") {
          menu.value = [menu.value as any];
        }

        return (
          <div
            className={cx(
              "w-full c-flex c-flex-col c-overflow-hidden",
              depth > 0 && !expanded && "c-hidden"
            )}
          >
            <div
              onClick={async () => {
                if (!local.open.has(menu.hash)) {
                  local.open.add(menu.hash);
                } else {
                  local.open.delete(menu.hash);
                  if (Array.isArray(menu.value)) {
                    getChilds(menu.value).forEach((e) => {
                      local.open.delete(hashMenu(e));
                    });
                  }
                }

                local.loading = true;
                if (typeof menu.value === "string") {
                  local.active = menu.hash;

                  clearTimeout(local.nav_timeout);
                  local.nav_timeout = setTimeout(() => {
                    if (
                      typeof menu.value === "string" &&
                      getPathname() !== menu.value
                    ) {
                      if (!pm.on_load) {
                        navigate(menu.value);
                      }
                    }
                  }, 500);
                }
                local.render();

                if (
                  !Array.isArray(menu.value) &&
                  typeof menu.value === "string"
                ) {
                  activate(menu.label);
                  if (pm.on_load) {
                    if (preloaded(menu.value)) {
                      pm.on_load((exec) => {
                        if (typeof menu.value === "string")
                          navigate(menu.value);
                        exec();
                      });
                    } else {
                      let done = { exec: () => {} };
                      pm.on_load((exec) => {
                        done.exec = exec;
                      });
                      await preload(menu.value);
                      done.exec();
                      if (typeof menu.value === "string") navigate(menu.value);
                    }
                    return;
                  }
                  await preload(menu.value);
                  navigate(menu.value);
                }
              }}
            >
              <PassProp
                item={menu}
                depth={depth || 0}
                hasChild={Array.isArray(menu.value) && mode === "full"}
                selected={local.active === menu.hash}
                expand={local.open.has(menu.hash)}
                mode={mode}
              >
                {pm.child}
              </PassProp>
            </div>
            <div className="c-flex c-flex-col">
              {Array.isArray(menu.value) && mode === "full" ? (
                <>
                  <SideBar
                    data={menu.value}
                    local={local}
                    activate={activate}
                    depth={(depth || 0) + 1}
                    pm={pm}
                    mode={mode}
                    expanded={local.open.has(hashMenu(item))}
                    parent={menu.hash}
                  />
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const hashMenu = (menu: IMenu) => {
  if (!menu) return "";
  return `${menu[0]}${typeof menu[1]}${
    typeof menu[2] === "string"
      ? menu[2]
      : Array.isArray(menu[2])
      ? menu[2].length
      : "null"
  }`;
};

export const MenuIcon: FC<{ child: any }> = ({ child }) => {
  return <>{child}</>;
};

const getChilds = (data: Array<any>) => {
  let childs = [];
  childs.push(data);
  const children = data[2]; // array index ke-2 bisa berupa array atau string
  if (Array.isArray(children)) {
    for (let child of children) {
      childs.push(child);
      if (child && Array.isArray(child[2])) {
        const result: any = getChilds(child);
        childs = childs.concat(result);
      }
    }
  }
  return childs;
};
