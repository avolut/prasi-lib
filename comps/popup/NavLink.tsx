import { Spinner } from "lib/comps/ui/field-loading";
import { useLocal } from "lib/utils/use-local";
import { FC, HTMLProps } from "react";

navigate;
export const NavLink: FC<{
  className?: string;
  href?: string;
  children?: any;
  back_title?: string;
  params?: {
    name?: string;
    where?: any;
    create?: any;
    update?: any;
    breads?: { label: string; url?: string }[];
  };
}> = (props) => {
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
          } else if (props.back_title) {
            local.loading = true;
            local.render();
            navigate(props.href, { breads: [{ label: props.back_title }] });
            setTimeout(() => {
              local.loading = false;
            }, 3000);
          } else {
            navigate(props.href);
          }
        }
      }}
    >
      {local.loading ? (
        <div className="c-flex c-flex-1 c-items-center c-justify-center c-w-full c-h-full">
          <Spinner />
        </div>
      ) : (
        props.children
      )}
    </a>
  );
};
