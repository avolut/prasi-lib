import { FieldLoading, Spinner } from "lib/comps/ui/field-loading";
import { hashSum } from "lib/utils/hash-sum";
import { getPathname } from "lib/utils/pathname";
import { useLocal } from "lib/utils/use-local";
import { ArrowUpRight } from "lucide-react";
import { FC, ReactNode, useEffect } from "react";
import { FMLocal, FieldLocal, FieldProp } from "../../typings";

export const FieldLink: FC<{
  field: FieldLocal;
  fm: FMLocal;
  arg: FieldProp;
}> = ({ field, fm, arg }) => {
  const local = useLocal({
    text: "",
    init: false,
    navigating: false,
    custom: false,
  });

  const Link = ({
    children,
  }: {
    children: (arg: { icon: any }) => ReactNode;
  }) => {
    return (
      <div
        className={cx(
          "c-flex-1 c-my-1 c-px-2 c-rounded-md c-flex c-items-center cursor-pointer c-space-x-1 c-transition-all",
          css`
            border: 1px solid #aaa;
            &:hover {
              background-color: #dcedfc;
            }
          `
        )}
        onClick={async () => {
          if (!isEditor) {
            local.navigating = true;
            local.render();
            if (!(await navigateLink(arg.link, field))) {
              local.navigating = false;
              local.render();
            }
          }
        }}
      >
        {children({
          icon: local.navigating ? (
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
  }, []);

  return (
    <div className={cx("c-px-2")}>
      {!local.init ? (
        <FieldLoading height="short" />
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
    </div>
  );
};

export type LinkParam = {
  url: string;
  where: any;
  hash: any;
  prefix: {
    label: any;
    url: string;
    md?: { name: string; value: any };
  }[];
};

const navigateLink = async (link: FieldProp["link"], field: FieldLocal) => {
  let params = link.params(field);

  if (typeof params === "object") {
    if (params instanceof Promise) {
      params = await params;
    }
  }

  const md = params.md;
  const where = params.where;

  const prefix: LinkParam["prefix"] = [];

  if (md) {
    md.header.render();
    if (md.header.breadcrumb.length > 0) {
      const path = getPathname({ hash: false });
      let i = 0;
      for (const b of md.header.breadcrumb) {
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
    url: getPathname({ hash: false }),
    where,
    prefix,
    hash: "",
  };
  const vhash = hashSum(values);
  values.hash = vhash;

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

  return await Promise.all(parsed.map((e) => api._kv("get", e)));
};
