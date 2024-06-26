import { parseGenField } from "@/gen/utils";
import get from "lodash.get";
import { AlertTriangle, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { FMLocal, FMProps } from "../typings";
import { editorFormData } from "./ed-data";
import { formError } from "./error";

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

  fm.reload = () => {
    fm.status = isEditor ? "ready" : "loading";
    fm.render();

    const promise = new Promise<void>((done) => {
      fm.internal.reload.done.push(done);
      clearTimeout(fm.internal.reload.timeout);
      fm.internal.reload.timeout = setTimeout(async () => {
        if (sonar === "on" && !isEditor) {
          setTimeout(() => {
            toast.dismiss();
            toast.loading(
              <>
                <Loader2 className="c-h-4 c-w-4 c-animate-spin" />
                Loading data...
              </>
            );
          });
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
          if (!!result) {
            fm.data = result;
          }

          if (!fm.data) {
            fm.data = {};
          }

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

        fm.internal.reload.done.map((e) => e());
        setTimeout(() => {
          toast.dismiss();
        }, 100);

        fm.status = "ready";
        fm.render();
      }, 50);
    });
    fm.internal.reload.promises.push(promise);
    return promise;
  };

  fm.submit = () => {
    const promise = new Promise<boolean>(async (done) => {
      fm.internal.submit.done.push(done);
      clearTimeout(fm.internal.submit.timeout);
      fm.internal.submit.timeout = setTimeout(async () => {
        const done_all = (val: boolean) => {
          for (const d of fm.internal.submit.done) {
            d(val);
          }
          fm.internal.submit.done = [];
          fm.render();
        };

        if (typeof fm.props.on_submit === "function") {
          if (fm.props.sonar === "on" && !isEditor) {
            toast.loading(
              <>
                <Loader2 className="c-h-4 c-w-4 c-animate-spin" />
                Submitting...
              </>
            );
          }
          const success = await fm.props.on_submit({
            fm,
            form: fm.data,
            error: fm.error.object,
          });

          toast.dismiss();
          done_all(success);
          if (fm.props.sonar === "on" && !isEditor) {
            setTimeout(() => {
              toast.dismiss();

              if (!success) {
                toast.error(
                  <div className="c-flex c-text-red-600 c-items-center">
                    <AlertTriangle className="c-h-4 c-w-4 c-mr-1" />
                    Save Failed, please correct{" "}
                    {Object.keys(fm.error.list).length} errors.
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
                    Done
                  </div>,
                  {
                    className: css`
                      background: #e4ffed;
                      border: 2px solid green;
                    `,
                  }
                );
              }
            }, 100);
          }
        }
      }, 100);
    });
    fm.internal.submit.promises.push(promise);

    return promise;
  };
  if (typeof fm.props.on_init === "function") {
    fm.props.on_init({ fm, submit: fm.submit, reload: fm.reload });
  }
};
