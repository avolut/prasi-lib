import { useLocal } from "@/utils/use-local";
import { FC, useEffect, useRef } from "react";
import { FMInternal, FMProps } from "./typings";
import { formReload } from "./utils/reload";
import { formInit } from "./utils/init";
import { createPortal } from "react-dom";
import { Toaster } from "sonner";
import get from "lodash.get";

export const Form: FC<FMProps> = (props) => {
  const { PassProp, body } = props;
  const fm = useLocal<FMInternal>({
    data: {},
    status: "init",
    reload: async () => {
      formReload(fm);
    },
    fields: {},
    events: {
      on_change(name: string, new_value: any) {},
    },
    submit: null as any,
    error: {} as any,
    internal: {
      reload: {
        timeout: null as any,
        promises: [],
        done: [],
      },
    },
    props: {} as any,
    size: {
      width: 0,
      height: 0,
      field: "full",
    },
  });

  const ref = useRef({
    el: null as null | HTMLFormElement,
    rob: new ResizeObserver(([e]) => {
      fm.size.height = e.contentRect.height;
      fm.size.width = e.contentRect.width;
      if (fm.status === "ready") fm.status = "resizing";

      if (fm.props.layout === "auto") {
        if (fm.size.width > 650) {
          fm.size.field = "half";
        } else {
          fm.size.field = "full";
        }
      } else {
        if (fm.props.layout === "1-col") fm.size.field = "full";
        if (fm.props.layout === "2-col") fm.size.field = "half";
      }

      fm.render();
    }),
  });

  useEffect(() => {
    if (fm.status === "init") {
      formInit(fm, props);
      fm.reload();
    }
  }, []);

  if (document.getElementsByClassName("prasi-toaster").length === 0) {
    const elemDiv = document.createElement("div");
    elemDiv.className = "prasi-toaster";
    document.body.appendChild(elemDiv);
  }
  const toaster_el = document.getElementsByClassName("prasi-toaster")[0];

  const childs = get(
    body,
    "props.meta.item.component.props.body.content.childs"
  ) as any[];

  if (fm.status === "resizing") return null;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        fm.submit();
      }}
      ref={(el) => {
        if (!ref.current.el && el) {
          ref.current.el = el;
          ref.current.rob.observe(el);
        }
      }}
      className={cx(
        "form c-flex-1 c-w-full c-h-full c-relative c-overflow-auto"
      )}
    >
      {toaster_el && createPortal(<Toaster cn={cx} />, toaster_el)}
      <div
        className={cx(
          "form-inner c-flex c-flex-1 c-flex-wrap c-items-start c-content-start c-absolute c-inset-0"
        )}
      >
        {fm.status !== "init" &&
          childs.map((child, idx) => {
            return (
              <PassProp fm={fm} key={idx}>
                {child}
              </PassProp>
            );
          })}
      </div>
    </form>
  );
};
