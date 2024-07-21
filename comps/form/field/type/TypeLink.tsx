import { BreadItem } from "lib/comps/custom/Breadcrumb";
import { MDLocal } from "lib/comps/md/utils/typings";
import { FieldLoading, Spinner } from "lib/comps/ui/field-loading";
import { hashSum } from "lib/utils/hash-sum";
import { getPathname } from "lib/utils/pathname";
import { useLocal } from "lib/utils/use-local";
import { ArrowUpRight, Construction, Cuboid, Loader } from "lucide-react";
import { FC, ReactNode, useEffect } from "react";
import { FMLocal, FieldLocal, FieldProp } from "../../typings";

const link_cache = {} as Record<string, any>;

export const FieldLink: FC<{
  field: FieldLocal;
  fm: FMLocal;
  arg: FieldProp;
}> = ({ field, fm, arg }) => {
  const local = useLocal({
    text: "",
    init: false,
    custom: false,
    md: null as null | MDLocal,
  });

  const Link = ({
    children,
  }: {
    children: (arg: { icon: any }) => ReactNode;
  }) => {
    const link_local = useLocal({
      navigating: false,
    });

    const pk = Object.values(fm.field_def).find((e) => e.is_pk);
    if (!pk) {
      return <>No Primary Key</>;
    }

    if (!fm.data[pk.name]) {
      return (
        <div
          className={cx(
            css`
              color: #999;
            `,
            "c-flex c-space-x-2 items-center"
          )}
        >
          <div
            className={cx(
              css`
                border: 1px solid #ececeb;
              `,
              "c-rounded c-flex c-space-x-1 items-center c-px-2"
            )}
          >
            <Construction size={12} /> <div>Unsaved</div>
          </div>
          <div>No Item</div>
        </div>
      );
    }

    return (
      <div
        className={cx(
          "c-my-1 c-px-2 c-rounded-md c-flex c-items-center cursor-pointer c-space-x-1 c-transition-all",
          css`
            border: 1px solid #bbb;
            &:hover {
              border: 1px solid rgb(126, 167, 203);
              background: rgb(220, 237, 252);
              color: #001080;
            }
          `
        )}
        onClick={async () => {
          if (!isEditor) {
            link_local.navigating = true;
            link_local.render();
            if (!(await navigateLink(arg.link, field, fm.deps.md))) {
              link_local.navigating = false;
              link_local.render();
            }
          }
        }}
      >
        {children({
          icon: link_local.navigating ? (
            <Spinner
              className={cx(
                css`
                  padding-left: 4px;
                `
              )}
            />
          ) : (
            <ArrowUpRight size={15} />
          ),
        })}
      </div>
    );
  };

  useEffect(() => {
    if (arg.link && !local.init) {
      if (typeof arg.link.text === "string") {
        local.text = arg.link.text;
        local.init = true;
      } else if (typeof arg.link.text === "function") {
        local.custom = true;
        const res = arg.link.text({
          field,
          Link,
        });
        if (res instanceof Promise) {
          res.then((text) => {
            local.text = text;
            local.init = true;
            local.render();
          });
        } else {
          local.text = res;
          local.init = true;
        }
      }
    }

    local.render();
  }, [arg.link.params]);

  return (
    <div className={cx("c-px-2 c-flex-1 c-flex")}>
      {!local.init ? (
        <FieldLoading height="short" />
      ) : (
        <>
          {local.custom ? (
            local.text
          ) : (
            <Link>
              {({ icon }) => {
                return (
                  <>
                    <div>{local.text}</div>
                    {icon}
                  </>
                );
              }}
            </Link>
          )}
        </>
      )}
    </div>
  );
};

export type LinkParam = {
  url: string;
  where: any;
  create: any;
  update: any;
  hash: any;
  prefix: {
    label: any;
    url: string;
    md?: { name: string; value: any };
  }[];
};

const navigateLink = async (
  link: FieldProp["link"],
  field: FieldLocal,
  md?: MDLocal
) => {
  let params = link.params(field) as { where: any; create: any; update: any };

  if (typeof params === "object") {
    if (params instanceof Promise) {
      params = await params;
    }
  }

  const prefix: LinkParam["prefix"] = [];

  if (md) {
    let bread: BreadItem[] = [];
    if (md.selected && md.header.child.breadcrumb) {
      bread = md.header.child.breadcrumb();
    } else if (!md.selected && md.header.master.breadcrumb) {
      bread = md.header.master.breadcrumb();
    }
    if (bread.length > 0) {
      const path = getPathname({ hash: false });
      let i = 0;
      for (const b of bread) {
        prefix.push({
          label: b.label,
          url: `${path}`,
          md:
            i > 0
              ? { name: md.name, value: md.selected[md.pk?.name || ""] }
              : undefined,
        });
        i++;
      }
    }
  }

  const values: LinkParam = {
    ...params,
    url: getPathname({ hash: false }),
    prefix,
    hash: "",
  };
  const vhash = hashSum(values);
  values.hash = vhash;

  link_cache[vhash] = values;

  if (!link.url) {
    alert("No URL defined!");
    return false;
  }
  await api._kv("set", vhash, values);
  const lnk = location.hash.split("#").find((e) => e.startsWith("lnk="));
  let prev_link = "";
  if (lnk) {
    prev_link = lnk.split("=").pop() || "";
    if (prev_link) prev_link = prev_link + "+";
  }

  navigate(`${link.url}#lnk=${prev_link + vhash}`);
  return true;
};

export const parseLink = () => {
  const lnk = location.hash.split("#").find((e) => e.startsWith("lnk="));

  if (lnk) {
    const res = lnk.split("=").pop() || "";
    if (res) {
      return res.split("+");
    }
  }
  return [];
};

export const fetchLinkParams = async (
  parsed_link?: ReturnType<typeof parseLink>
) => {
  const parsed = parsed_link || parseLink();

  return await Promise.all(
    parsed.map(async (e) => {
      if (link_cache[e]) {
        return link_cache[e];
      }

      const result = await api._kv("get", e);
      link_cache[e] = result;
      return result;
    })
  );
};
