import { useLocal } from "lib/utils/use-local";
import { FC, ReactNode, useEffect } from "react";
import { Skeleton } from "../ui/skeleton";

export const Header: FC<{
  text: string;
  back_url: string | (() => void);
  props: any;
  actions: () => Promise<[string, string | (() => void), ReactNode][]>;
  action_mode: "auto" | "buttons" | "sub-header" | "dropdown";
  edit_url: string;
}> = ({ text, back_url, props, edit_url, actions, action_mode }) => {
  const local = useLocal({
    loading: false,
    actions: [] as [string, string | (() => void), ReactNode][],
  });

  useEffect(() => {
    (async () => {
      if (typeof actions === "function") {
        local.loading = true;
        local.render();
        const res_actions = await actions();
        if (Array.isArray(res_actions)) {
          local.actions = res_actions;
          preload(
            res_actions
              .filter((e) => typeof e[1] === "string")
              .map((e) => e[1]) as string[]
          );
        }
        local.loading = false;
        local.render();
      }
    })();
  }, [actions, action_mode]);

  const back = () => {
    if (isEditor) return;
    if (typeof back_url === "function") {
      const url = back_url();
      if (typeof url === "string") {
        if (url === "back") {
          history.back();
          return;
        }
        navigate(url);
      }
    } else {
      if (back_url === "back") {
        history.back();
        return;
      }
      navigate(back_url);
    }
  };
  return (
    <div
      {...props}
      className={cx(
        props.className,
        "whitespace-pre-wrap",
        css`
          min-height: 50px !important;
        `
      )}
    >
      {typeof back_url === "string" && preload([back_url])}
      {back_url && (
        <div className="mr-2" onClick={back}>
          <svg
            width="25"
            height="25"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94628 8.84182 3.13514Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            ></path>
          </svg>
        </div>
      )}
      <div className="w-full flex flex-row justify-between items-center">
        <div className="c-whitespace-nowrap" onClick={back}>
          {text} 
        </div>
        <div className="c-flex">
          {local.loading && (
            <Skeleton
              className={cx(
                css`
                  height: 10px;
                  min-width: 40px;
                `
              )}
            />
          )}
          {!local.loading && (
            <>
              {local.actions.map((e) => {
                const [label, to, icon] = e;
                return (
                  <div
                    className="c-bg-primary hover:c-bg-primary/90 c-p-1 c-rounded-md c-text-sm c-flex c-text-white c-items-center c-space-x-1 c-px-2 c-ml-2"
                    onClick={() => {
                      if (isEditor) return;
                      if (typeof to === "string") {
                        navigate(to);
                      } else if (typeof to === "function") {
                        to();
                      }
                    }}
                  >
                    <div
                      className={css`
                        svg {
                          max-width: 15px;
                        }
                      `}
                    >
                      {icon}
                    </div>
                    <div>{label}</div>
                  </div>
                );
              })}
            </>
          )}

          {/* {edit_url && edit_url !== "" && params.id !== "_" && (
            <div
              className="c-bg-primary hover:c-bg-primary/90 c-p-1 c-rounded-md c-ml-2"
              onClick={() => {
                if (isEditor) return;
                if (typeof edit_url === "string") {
                  navigate(edit_url);
                }
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                <path d="m15 5 3 3" />
              </svg>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};
