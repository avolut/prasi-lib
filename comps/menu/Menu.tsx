
import get from "lodash.get";
import { ChevronDown, ChevronRight } from "lucide-react";
import { FC, ReactNode, useEffect } from "react";
import { MenuProp } from "../../preset/menu/utils/type-menu";

export const Menu: FC<MenuProp> = (props) => {
  const imenu = props.menu;
  console.log(imenu)
  let role = props.role;
  role = props.on_init() as string;

  const PassProp = props.PassProp;
  let menu = imenu[role] || [];
  const pathname = getPathname();
  const local = useLocal({
    open: [] as Array<any>,
    cache: false,
    active: null as any,
  });
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
        props.mode === "mini" ? "c-max-w-[35px]" : "",
        "c-h-full c-w-full c-flex c-flex-row c-flex-grow c-px-3 c-py-4 c-overflow-y-auto c-rounded "
      )}
    >
      <SideBar data={menu} local={local} pm={props} />
    </div>
  );
};
export const SideBar: FC<{
  data: IMenu[];
  local: any;
  dept?: number;
  pm: MenuProp;
}> = ({ data, local, dept, pm }) => {
  const PassProp = pm.PassProp;
  console.log({ data });
  return (
    <div className="c-flex c-flex-col c-flex-grow">
      {data.map((item) => {
        const menu = {
          label: item[0],
          icon: item[1],
          value: item[2],
        };
        return <div key={item[0]}>asdas {typeof menu.icon}</div>;
        const find_child = findChild(item, (e: any) => local.open.includes(e));
        let expand = find_child;
        if (find_child && !local.open.includes(item)) local.open.push(item);
        return (
          <div className="w-full c-flex c-flex-col">
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
              }}
            >
              <PassProp
                item={menu}
                dept={dept || 0}
                hasChild={Array.isArray(menu.value)}
                selected={local.active === item}
                expand={expand}
                mode={pm.mode}
              >
                {pm.child}
              </PassProp>
            </div>
            <div className="c-flex c-flex-col">
              {Array.isArray(menu.value) && expand ? (
                <>
                  <SideBar
                    data={menu.value}
                    local={local}
                    dept={(dept || 0) + 1}
                    pm={pm}
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
  return (
    <div className="c-flex c-flex-col c-gap-2 c-flex-grow">
      {data.map((e) => {
        const label: string = e[0];
        const child: any = e[2];
        const hasChildren = Array.isArray(child);
        const predicate = (item: MenuActive) => {
          if (hasChildren) {
            return item.label === e[0] && item.path === "";
          } else {
            return item.label === e[0] && item.path === child;
          }
        };
        const found_local = local.open.find(predicate);
        let expand = get(found_local, "expand") ? true : false;
        const selected = found(e, (menu: any) =>
          local.open.some(
            (item: MenuActive) =>
              item.label === menu[0] || item.path === menu[2]
          )
        );
        if (selected && !found_local) {
          local.open.push({
            label: e[0],
            path: hasChildren ? "" : e[2],
            expand: hasChildren,
          });
          expand = true;
        }

        return (
          <div
            className={cx(
              "c-flex c-flex-col c-w-full c-gap-1 c-items-center c-rounded c-pb-0"
            )}
          >
            <div
              className={cx(
                "c-flex c-w-full c-gap-1 c-flex-grow c-items-center c-rounded c-p-2 sidebar-row"
              )}
              onClick={() => {
                const found_local = local.open.find(predicate);
                console.log(found_local);
                if (found_local) {
                  found_local.expand = !found_local.expand;
                  // local.open = local.open.filter((item: MenuActive) => {
                  //   if (hasChildren) {
                  //     return item.label !== e[0] && item.path === "";
                  //   } else {
                  //     return item.label !== e[0] && item.path !== child;
                  //   }
                  // });
                  local.render();
                } else {
                  local.open = [
                    {
                      label: e[0],
                      path: hasChildren ? "" : e[2],
                      expand: hasChildren,
                    },
                  ];
                }
                local.render();
                console.log(local.open);
              }}
            >
              <PassProp
                item={e}
                dept={dept || 0}
                hasChild={hasChildren}
                selected={selected}
              >
                {pm.child}
              </PassProp>
            </div>
            {hasChildren && selected && expand ? (
              <div className="sidebar-child c-flex c-w-full  c-pb-0 c-gap-1 c-pl-2 c-flex-grow c-items-center c-rounded c-py-2">
                <SideBar
                  data={child}
                  local={local}
                  dept={(dept || 0) + 1}
                  pm={pm}
                />
              </div>
            ) : (
              <></>
            )}
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
