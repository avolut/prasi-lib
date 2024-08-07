import { parseGenField } from "@/gen/utils";
import get from "lodash.get";
import { AlertTriangle, Check, Loader2 } from "lucide-react";
import { FMLocal, FMProps } from "../typings";
import { editorFormData } from "./ed-data";
import { formError } from "./error";
import { toast } from "lib/comps/ui/toast";

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

  fm.reload = async () => {
    fm.status = isEditor ? "ready" : "loading";
    fm.render();

    if (sonar === "on" && !isEditor) {
      toast.dismiss();
      toast.loading(
        <>
          <Loader2 className="c-h-4 c-w-4 c-animate-spin" />
          Loading data...
        </>
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
      toast.success(
        <div className="c-flex c-text-green-700 c-items-center">
          <Check className="c-h-4 c-w-4 c-mr-1 " />
          Saved
        </div>,
        {
          className: css`
            background: #e4ffed;
            border: 2px solid green;
          `,
        }
      );
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
          toast.success(
            <div className="c-flex c-text-green-700 c-items-center">
              <Check className="c-h-4 c-w-4 c-mr-1 " />
              Saved
            </div>,
            {
              className: css`
                background: #e4ffed;
                border: 2px solid green;
              `,
            }
          );
        }
      }
      return success;
    }
  };
  if (typeof fm.props.on_init === "function") {
    fm.props.on_init({ fm, submit: fm.submit, reload: fm.reload });
  }
};
