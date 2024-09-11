import { useLocal } from "lib/utils/use-local";
import { FC, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Toaster } from "sonner";
import { FMInternal, FMProps } from "./typings";
import { editorFormData } from "./utils/ed-data";
import { formInit } from "./utils/init";
import { formReload } from "./utils/reload";
import { getPathname } from "lib/utils/pathname";
import { sofDeleteField as softDeleteField } from "lib/utils/soft-del-rel";
import { toast } from "../ui/toast";

const editorFormWidth = {} as Record<string, { w: number; f: any }>;

export type { FMLocal } from "./typings";

export const Form: FC<FMProps> = (props) => {
  const { PassProp, body, feature, sfd_field } = props;
  const fm = useLocal<FMInternal>({
    data: editorFormData[props.item.id]
      ? editorFormData[props.item.id].data
      : {},
    deps: {},
    status: "init",
    reload: async () => {
      formReload(fm);
    },
    save_status: "init",
    fields: {},
    events: {
      on_change(name: string, new_value: any) {},
    },
    internal: {},
    submit: null as any,
    error: {} as any,
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
      field: null,
    },
    has_fields_container: null as any,
    is_newly_created: false,
  });
  const form_inner_ref = useRef<HTMLDivElement>(null);

  if (props.render_parent) {
    if (!fm.internal.original_render) fm.internal.original_render = fm.render;
    fm.render = () => {
      if (isEditor) {
        setTimeout(() => {
          if (props.render_parent) props.render_parent();
        });
      } else {
        if (props.render_parent) props.render_parent();
      }
    };
  }

  useEffect(() => {
    // deteksi jika ada softdelete
    if (Array.isArray(props.feature)) {
      if (props.feature?.find((e) => e === "soft_delete")) {
        const result = softDeleteField(props.gen_table, sfd_field);
        if (result instanceof Promise) {
          result.then((e) => {
            // simpan fields yang berisi name dan type fields soft delete
            fm.soft_delete.field = e;
            if (!isEditor) {
              fm.render();
            }
          });
        }
      } else {
        fm.soft_delete.field = null;
      }
    }
  }, []);

  const ref = useRef({
    el: null as null | HTMLFormElement,
    rob: new ResizeObserver(([e]) => {
      if (e.contentRect.width > 0) {
        fm.size.height = e.contentRect.height;
        fm.size.width = e.contentRect.width;

        // if (fm.status === "ready" && !isEditor) fm.status = "resizing";

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
  }, [getPathname({ hash: true })]);

  useEffect(() => {
    if (fm.status === "ready") {
      fm.status = "init";
      fm.render();
    }

    let i = 0;
    const ival = setInterval(() => {
      const old_has_fields_container = fm.has_fields_container;
      if (form_inner_ref.current?.querySelector(".form-fields")) {
        fm.has_fields_container = true;
      } else {
        fm.has_fields_container = false;
      }

      if (old_has_fields_container !== fm.has_fields_container) {
        fm.render();
        clearInterval(ival);
      }
      if (i > 20) {
        clearInterval(ival);
      }
      i++;
    }, 10);
  }, Object.values(props.deps) || []);

  fm.deps = props.deps;

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
    fm.status = "ready";
  }
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await fm.submit();
      }}
      ref={(el) => {
        if (el) {
          if (!ref.current.el) {
            ref.current.el = el;
            ref.current.rob.observe(el);
            if (fm.status === "ready") {
              fm.status = "resizing";
              fm.render();
            }
          }
        }
      }}
      className={cx(
        "form c-flex-1 c-w-full c-h-full c-relative c-overflow-auto"
      )}
    >
      {toaster_el &&
        createPortal(<Toaster position={toast.position} cn={cx} />, toaster_el)}
      <div
        ref={form_inner_ref}
        className={cx(
          "form-inner c-flex c-flex-col c-flex-1 c-flex-wrap c-items-start c-content-start",
          css`
            min-height: 100%;
          `,
          !fm.has_fields_container
            ? css`
                padding-right: 10px;
              `
            : css`
                > div {
                  > .form-fields {
                    padding-right: 10px;
                  }
                }
              `
        )}
      >
        <>
          {fm.status !== "init" && fm.size.width > 0 && (
            <PassProp fm={fm} submit={fm.submit}>
              {!fm.data ? <>NO DATA</> : body}
            </PassProp>
          )}
        </>
        <button type="submit" className="c-hidden"></button>
      </div>
    </form>
  );
};
