import { Spinner } from "lib/comps/ui/field-loading";
import { useLocal } from "lib/utils/use-local";
import { FC, HTMLProps } from "react";

navigate;
export const NavLink: FC<
  HTMLProps<HTMLAnchorElement> & {
    params?: {
      name?: string;
      where?: any;
      create?: any;
      update?: any;
      breads?: { label: string; url?: string }[];
    };
  }
> = (props) => {
  const local = useLocal({ loading: false });
  let href = props.href || "";

  if (href.startsWith("/")) {
    href = baseurl(href);
  }
  return (
    <a
      {...props}
      href={href}
      onClick={async (e) => {
        if (isEditor) {
          e.stopPropagation();
          e.preventDefault();
          return;
        }

        if (props.href?.startsWith(`/`)) {
          e.stopPropagation();
          e.preventDefault();

          if (props.params) {
            local.loading = true;
            local.render();
            navigate(props.href, props.params);
            setTimeout(() => {
              local.loading = false;
            }, 3000);
          } else {
            navigate(props.href);
          }
        }
      }}
    >
      {local.loading ? <Spinner /> : props.children}
    </a>
  );
};
