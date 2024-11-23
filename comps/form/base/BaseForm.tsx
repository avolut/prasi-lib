import { ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Toaster } from "sonner";
import { editorFormWidth } from "../Form";
import { FMLocal } from "../typings";
import { createFm } from "./utils/create-fm";
import { DivForm } from "./utils/DivForm";

export type BaseFormProps<T> = {
  name: string;
  data: T;
  className?: string;
  onField?: () => void;
  onSubmit?: (arg: { fm: FMLocal }) => Promise<boolean> | boolean;
  onChange?: (fm: FMLocal, name: string, new_value: any) => any;
  children: ReactNode | ((arg: { fm: FMLocal }) => ReactNode);
  tag?: "form" | "div";
};

export const BaseForm = <T extends Record<string, any>>({
  tag,
  data,
  children,
  name,
  onSubmit,
  className,
}: BaseFormProps<T>) => {
  const render = useState({})[1];
  const local = useRef({
    fm: null as null | FMLocal,
    el: null as null | HTMLFormElement,
    rob: new ResizeObserver(async ([e]) => {
      measureSize(name, fm, e.target as HTMLFormElement);
    }),
  }).current;

  if (!local.fm) {
    local.fm = createFm({
      data,
      onSubmit,
      render() {
        render({});
      },
    });
  }
  useEffect(() => {
    if (local.fm && local.fm.data !== data) {
      for (const k of Object.keys(local.fm.data)) {
        delete local.fm.data[k];
      }
      for (const [k, v] of Object.entries(data)) {
        local.fm.data[k] = v;
      }
      console.log(local.fm.data, data)
      local.fm.render();
    }
  }, [data]);

  const fm = local.fm;

  let child = null;
  if (children) {
    if (typeof children === "function") {
      child = children({ fm: local.fm });
    } else {
      child = children;
    }
  }

  if (document.getElementsByClassName("prasi-toaster").length === 0) {
    const elemDiv = document.createElement("div");
    elemDiv.className = "prasi-toaster";
    document.body.appendChild(elemDiv);
  }
  const toaster_el = document.getElementsByClassName("prasi-toaster")[0];

  return (
    <DivForm
      tag={tag || "form"}
      onSubmit={(e) => {
        e.preventDefault();
      }}
      ref={(el) => {
        if (el) {
          if (!local.el && fm) {
            local.el = el;
            measureSize(name, fm, el);
            local.rob.observe(el);
          }
        }
      }}
      className={cx(
        "form c-flex-1 c-flex c-flex-col c-w-full c-h-full c-relative c-overflow-auto",
        className
      )}
    >
      {toaster_el && createPortal(<Toaster cn={cx} />, toaster_el)}

      <div
        className={cx(
          "form-inner c-flex-1 c-flex c-flex-row c-flex-wrap c-items-start c-content-start c-absolute c-inset-0",
          css`
            padding-right: 10px;
          `
        )}
      >
        {fm.size && fm.size.width > 0 && <>{child}</>}
      </div>
    </DivForm>
  );
};

const measureSize = (name: string, fm: FMLocal, e: HTMLFormElement) => {
  if (!fm.size) {
    fm.size = { field: "full", width: 0, height: 0 };
  }

  if (e.clientWidth > 0 && fm && fm.size) {
    fm.size.height = e.clientHeight;
    fm.size.width = e.clientWidth;

    if (fm.props?.layout === "auto" || !fm.props?.layout) {
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
      editorFormWidth[name] = {
        w: fm.size.width,
        f: fm.size.field,
      };
    }
    fm.status = "ready";

    fm.render();
  }
};
