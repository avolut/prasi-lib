import { useLocal } from "@/utils/use-local";
import { FC, Fragment, useEffect, useRef } from "react";
import { FMInternal, FMProps } from "./typings";
import { formReload } from "./utils/reload";
import { formInit } from "./utils/init";
import { createPortal } from "react-dom";
import { Toaster } from "sonner";
import get from "lodash.get";
import { Field } from "./field/Field";
import { getProp } from "../../..";

const editorFormWidth = {} as Record<string, { w: number; f: any }>;

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
      width: editorFormWidth[props.item.id]
        ? editorFormWidth[props.item.id].w
        : 0,
      height: 0,
      field: editorFormWidth[props.item.id]
        ? editorFormWidth[props.item.id].f
        : "full",
    },
  });

  const ref = useRef({
    el: null as null | HTMLFormElement,
    rob: new ResizeObserver(([e]) => {
      if (e.contentRect.width > 0) {
        fm.size.height = e.contentRect.height;
        fm.size.width = e.contentRect.width;

        if (fm.status === "ready" && !isEditor) fm.status = "resizing";

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

        if (isEditor) {
          editorFormWidth[props.item.id] = {
            w: fm.size.width,
            f: fm.size.field,
          };
        }

        fm.render();
      }
    }),
  });

  if (fm.status === "init") {
    formInit(fm, props);
    fm.reload();
  }

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

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        fm.submit();
      }}
      ref={(el) => {
        if (el) {
          if (!ref.current.el) {
            ref.current.el = el;
            ref.current.rob.observe(el);
          }
        }
      }}
      className={cx(
        "form c-flex-1 c-w-full c-h-full c-relative c-overflow-auto"
      )}
    >
      {toaster_el && createPortal(<Toaster cn={cx} />, toaster_el)}
      <div
        className={cx(
          "form-inner c-flex c-flex-1 c-flex-wrap c-items-start c-content-start c-absolute c-inset-0",
          css`
            padding-right: 10px;
          `
        )}
      >
        {fm.status !== "init" &&
          fm.size.width > 0 &&
          childs.map((child, idx) => {
            const props = {} as any;
            for (const [k, v] of Object.entries(child.component.props)) {
              props[k] = getProp(child, k);
            }
            return (
              <Fragment key={idx}>
                <Field {...props} fm={fm} />
              </Fragment>
            );
          })}
      </div>
    </form>
  );
};
