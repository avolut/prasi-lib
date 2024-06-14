import { getPathname } from "lib/utils/pathname";
import { useLocal } from "lib/utils/use-local";
import get from "lodash.get";
import { FC, ReactNode, useEffect } from "react";
import { IMenu, MenuProp } from "./utils/type-menu";
// import { icon } from "../../..";

export const Menu: FC<MenuProp> = (props) => {
  const imenu = props.menu;
  let role = props.role;
  role = props.on_init();
  let menu = get(imenu, role) || [];
  const pathname = getPathname();
  const local = useLocal({
    open: [] as Array<any>,
    cache: false,
    active: null as any,
    mode: "full" as "full" | "mini",
  });
  useEffect(() => {
    local.mode = props.mode;
    local.render();
  }, [props.mode]);
  if (!local.open.length && !local.cache) {
    const result = findChildMenu(menu, (e: any) => e[2] === pathname);
    if (Array.isArray(result)) {
      local.open.push(result);
      local.active = result;
      local.cache = true;
      local.render();
    }
  }
  return (
    <div
      className={cx(
        props.mode === "mini" ? "" : "c-overflow-y-auto",
        "c-h-full c-w-full c-flex c-flex-col c-flex-grow c-px-3 c-py-4 c-overflow-y-auto  c-rounded "
      )}
    >
      <SideBar
        data={menu}
        local={local}
        pm={props}
        depth={0}
        mode={local.mode}
      />
    </div>
  );
};
export const SideBar: FC<{
  data: IMenu[];
  local: any;
  depth: number;
  pm: MenuProp;
  mode: "full" | "mini";
}> = ({ data, local, depth, pm, mode }) => {
  const PassProp = pm.PassProp;
  return (
    <div
      className={cx(
        "c-flex c-flex-col c-flex-grow c-mb-1",
        depth > 0 ? " c-overflow-hidden" : ""
      )}
    >
      {data.map((item) => {
        const menu = {
          label: item[0],
          icon: item[1],
          value: item[2],
        };
        const find_child = findChild(item, (e: any) => local.open.includes(e));
        let expand = find_child;
        if (find_child && !local.open.includes(item)) local.open.push(item);
        return (
          <div className="w-full c-flex c-flex-col c-overflow-hidden">
            <div
              onClick={() => {
                const childs = getChilds(item) || [];
                if (local.open.includes(item)) {
                  local.open = local.open.filter(
                    (e: any) => e !== item && !childs.includes(e)
                  );
                } else {
                  local.open.push(item);
                }
                local.active = item;
                local.render();
                if (
                  !Array.isArray(menu.value) &&
                  typeof menu.value === "string"
                ) {
                  navigate(menu.value);
                }
              }}
            >
              <PassProp
                item={menu}
                depth={depth || 0}
                hasChild={Array.isArray(menu.value) && mode === "full"}
                selected={local.active === item}
                expand={expand && Array.isArray(menu.value) && mode === "full"}
                mode={mode}
              >
                {pm.child}
              </PassProp>
            </div>
            <div className="c-flex c-flex-col">
              {Array.isArray(menu.value) && expand && mode === "full" ? (
                <>
                  <SideBar
                    data={menu.value}
                    local={local}
                    depth={(depth || 0) + 1}
                    pm={pm}
                    mode={mode}
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

const getChilds = (data: Array<any>) => {
  let childs = [];
  childs.push(data);
  const children = data[2]; // array index ke-2 bisa berupa array atau string
  if (Array.isArray(children)) {
    for (let child of children) {
      childs.push(child);
      if (Array.isArray(child[2])) {
        const result: any = getChilds(child);
        childs = childs.concat(result);
      }
    }
  }
  return childs;
};

const found = (data: Array<any>, predicate: any) => {
  const result = findChild(data, predicate);
  return result ? true : false;
};
const findChild = (data: Array<any>, predicate: any) => {
  const children = data[2]; // array index ke-2 bisa berupa array atau string
  if (predicate(data)) {
    // kalau data ada yang cocok dari prediksi maka true, kalau gk jalankan false
    return data;
  } else {
    if (Array.isArray(children)) {
      // jika ada children, loop anaknya dan cari hingga sesuai prediksi
      for (let child of children) {
        const result: any = findChild(child, predicate);
        if (result) return result;
      }
    } else {
      // jika data tidak mengandung children maka cari sesuai prediksi
      if (predicate(data)) {
        return data;
      }
      return null;
    }
  }
  return null;
};
const findChildMenu = (data: Array<any>, predicate: any) => {
  let result = null as any;
  if (data.length) {
    data.map((e) => {
      let found = findChild(e, predicate);
      if (found) {
        result = found;
      }
    });
  }
  return result;
};

export const MenuIcon: FC<{ child: any }> = ({ child }) => {
  return <>{child}</>;
};
