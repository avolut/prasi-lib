import { useLocal } from "@/utils/use-local";
import { FC, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Toaster } from "sonner";
import { FMInternal, FMProps } from "./typings";
import { editorFormData } from "./utils/ed-data";
import { formInit } from "./utils/init";
import { formReload } from "./utils/reload";
import { getPathname } from "lib/utils/pathname";
import { sofDeleteField } from "lib/utils/soft-del-rel";

const editorFormWidth = {} as Record<string, { w: number; f: any }>;

export { FMLocal } from "./typings";

export const Form: FC<FMProps> = (props) => {
  const { PassProp, body, feature, sfd_field } = props;
  const fm = useLocal<FMInternal>({
    data: editorFormData[props.item.id]
      ? editorFormData[props.item.id].data
      : {},
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
      submit: {
        timeout: null as any,
        promises: [],
        done: [],
      },
    },
    field_def: {},
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
    soft_delete: {
      field: null
    }
  });
  useEffect(() => {
    // deteksi jika ada softdelete
    if(Array.isArray(props.feature)){
      if(props.feature?.find((e) => e === "soft_delete")){
        const result = sofDeleteField(props.gen_table, sfd_field)
        if (result instanceof Promise) {
          result.then((e) => {
            // simpan fields yang berisi name dan type fields soft delete
            fm.soft_delete.field = e;
            if(!isEditor){
              fm.render();
            }
          });
        }
      }else{
        fm.soft_delete.field = null;
      }
    }
   
  }, [])
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

  useEffect(() => {
    if (fm.status === "ready") {
      fm.status = "init";
      fm.render();
    }
  }, [getPathname()]);

  useEffect(
    () => {
      if (fm.status === "ready") {
        fm.status = "init";
        fm.render();
      }
    },
    Array.isArray(props.on_load_deps) ? props.on_load_deps : []
  );

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

  if (fm.status === "resizing") {
    setTimeout(() => {
      fm.status = "ready";
      fm.render();
    }, 100);
    return null;
  }

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
      action="#"
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
        {fm.status !== "init" && fm.size.width > 0 && (
          <PassProp fm={fm} submit={fm.submit}>
            {body}
          </PassProp>
        )}
        <button type="submit" className="c-hidden"></button>
      </div>
    </form>
  );
};
