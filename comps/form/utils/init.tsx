import { parseGenField } from "@/gen/utils";
import { MDLocal } from "lib/comps/md/utils/typings";
import { Button } from "lib/comps/ui/button";
import { toast } from "lib/comps/ui/toast";
import get from "lodash.get";
import { AlertTriangle, Check, ChevronLeft, Loader2, Plus } from "lucide-react";
import { FMLocal, FMProps } from "../typings";
import { editorFormData } from "./ed-data";
import { formError } from "./error";
import { lang, translate } from "lib/lang";

export const formInit = (fm: FMLocal, props: FMProps) => {
  for (const [k, v] of Object.entries(props)) {
    if (["PassProp", "body", "meta", "item"].includes(k)) continue;
    (fm.props as any)[k] = v;
  }
  const { on_load, sonar } = fm.props;
  fm.error = formError(fm);
  fm.field_def = {};
  const defs = parseGenField(fm.props.gen_fields);
  for (const d of defs) {
    fm.field_def[d.name] = d;
  }

  const toastSuccess = (opt: { addNewText: string }) => {
    const md = fm.deps.md as MDLocal;
    fm.save_status = "saved";

    if (md) {
      toast.success(
        <div
          className={cx(
            "c-cursor-pointer c-flex c-flex-col c-select-none c-items-stretch c-flex-1 c-w-full"
          )}
          onClick={() => {
            toast.dismiss();
          }}
        >
          <div className="c-flex c-text-green-700 c-items-center success-title c-font-semibold">
            <Check className="c-h-6 c-w-6 c-mr-1 " />
            {translate("Record Saved")}
          </div>
          <div
            className={cx(
              "c-flex c-items-center c-space-x-2 c-p-3",
              md.props.mode === "full"
                ? "c-justify-between"
                : "c-justify-center",
              css`
                border-radius: 10px;
                margin: 0px -10px -10px -10px;
                background: white;
                border: 1px solid rgb(164, 208, 180);
                padding-left: 5px !important;
                .button {
                  font-size: 13px;
                }
              `
            )}
          >
            {md.props.mode === "full" && (
              <Button
                variant={"link"}
                size={"xs"}
                className={cx(
                  css`
                    color: gray !important;
                  `,
                  "c-cursor-pointer"
                )}
                onClick={() => {
                  const md = fm.deps.md as MDLocal;
                  toast.dismiss();
                  md.selected = null;
                  md.tab.active = "master";
                  md.params.apply();
                  md.render();
                  md.master.reload();
                }}
              >
                <ChevronLeft size={18} />{" "}
                <div className="c-px-1">{translate("Back To List")}</div>
              </Button>
            )}

            <Button
              variant={"outline"}
              className={cx(
                css`
                  color: green;
                  border: 1px solid green !important;
                  background: #f1fff6 !important;
                `,
                "c-cursor-pointer"
              )}
              size={"xs"}
              onClick={() => {
                const md = fm.deps.md as MDLocal;
                toast.dismiss();

                md.params.hash[md.name] = "+";
                md.selected = {};
                md.internal.reset_detail = true;
                md.tab.active = "detail";
                md.params.apply();
              }}
            >
              <div className="c-px-1">{opt.addNewText}</div> <Plus size={18} />
            </Button>
          </div>
        </div>,
        {
          duration: 60 * 1000,
          className: css`
            background: #e4ffed;
            border: 2px solid green;

            .success-title {
              margin-bottom: 20px;
            }
          `,
        }
      );
    } else {
      toast.success(
        <div
          className={cx("c-cursor-pointer c-flex c-flex-col c-select-none")}
          onClick={() => {
            toast.dismiss();
          }}
        >
          <div className="c-flex c-text-green-700 c-items-center">
            <Check className="c-h-4 c-w-4 c-mr-1 " />
            Saved
          </div>
        </div>,
        {
          duration: 60 * 1000,
          className: css`
            background: #e4ffed;
            border: 2px solid green;
          `,
        }
      );
    }
  };

  fm.reload = async () => {
    fm.status = isEditor ? "ready" : "loading";
    fm.render();

    if (sonar === "on" && !isEditor) {
      toast.dismiss();
      toast.loading(
        <>
          <Loader2 className="c-h-4 c-w-4 c-animate-spin" />
          Loading data...
        </>,
        { dismissible: true }
      );
    }

    let should_load = true;
    if (isEditor) {
      const item_id = props.item.id;
      if (item_id) {
        const cache = editorFormData[item_id];
        if (
          cache &&
          cache.on_load === get(props.item, "component.props.on_load.value")
        ) {
          fm.data = cache.data;
          should_load = false;
        }
      }
    }
    if (should_load) {
      if (!on_load) {
        console.error("Form on_load is empty. Please re-generate the form.");
      } else {
        const on_load_result = on_load({ fm });
        let result = undefined;
        if (
          typeof on_load_result === "object" &&
          on_load_result instanceof Promise
        ) {
          result = await on_load_result;
        } else {
          result = on_load_result;
        }

        fm.data = result;
        fm.save_status = "saved";

        if (result === undefined) fm.data = {};

        if (isEditor) {
          const item_id = props.item.id;
          if (item_id) {
            editorFormData[item_id] = {
              data: fm.data,
              on_load: get(props.item, "component.props.on_load.value"),
            };
          }
        }
      }
    }

    toast.dismiss();

    if (fm.is_newly_created) {
      fm.is_newly_created = false;
      toastSuccess({ addNewText: translate("Add Another") });
    }

    fm.status = "ready";
    fm.render();
  };

  fm.submit = async () => {
    if (fm.status !== "ready") {
      return;
    }
    if (typeof fm.props.on_submit === "function") {
      fm.status = "saving";
      fm.render();

      if (fm.props.sonar === "on" && !isEditor) {
        toast.loading(
          <>
            <Loader2 className="c-h-4 c-w-4 c-animate-spin" />
            Submitting...
          </>
        );
      }

      const form = JSON.parse(JSON.stringify(fm.data));

      if (fm.deps.md) {
        const md = fm.deps.md;
        const last = md.params.links[md.params.links.length - 1];
        if (last) {
          const pk = Object.values(fm.field_def).find((e) => e.is_pk);
          if (pk) {
            let obj = last.update;
            if (!fm.data[pk.name]) {
              obj = last.create;
            }

            if (typeof obj === "object" && obj) {
              for (const [k, v] of Object.entries(obj)) {
                form[k] = v;
              }
            }
          }
        }
      }

      const success = await fm.props.on_submit({
        fm,
        form,
        error: fm.error.object,
      });

      toast.dismiss();

      if (!success) {
        fm.status = "ready";
        fm.render();
      }

      if (fm.props.sonar === "on" && !isEditor) {
        toast.dismiss();

        if (!success) {
          const errors = Object.keys(fm.error.list);
          const count = errors.length;
          toast.error(
            <div className="c-flex c-text-red-600 c-items-center">
              <AlertTriangle className="c-h-4 c-w-4 c-mr-1" />
              Save Failed
              {count > 0 &&
                `, please correct
                    ${count} errors`}
              .
            </div>,
            {
              dismissible: true,
              className: css`
                background: #ffecec;
                border: 2px solid red;
              `,
            }
          );
        } else {
          toastSuccess({ addNewText: lang.t("Add New") });
        }
      }
      return success;
    }
  };
  if (typeof fm.props.on_init === "function") {
    fm.props.on_init({ fm, submit: fm.submit, reload: fm.reload });
  }
};
