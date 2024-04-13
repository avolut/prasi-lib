import { parseGenField } from "@/gen/utils";
import get from "lodash.get";
import { Loader2 } from "lucide-react";
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

  if (isEditor) {
    fm.field_def = {};
    const defs = parseGenField(fm.props.gen_fields);
    for (const d of defs) {
      fm.field_def[d.name] = d;
    }
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
          const res = on_load({ fm });

          if (typeof res === "object" && res instanceof Promise) {
            fm.data = await res;
          } else {
            fm.data = res;
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
        toast.dismiss();

        fm.status = "ready";
        fm.render();
      }, 50);
    });
    fm.internal.reload.promises.push(promise);
    return promise;
  };

  fm.submit = async () => {
    if (typeof fm.props.on_submit === "function") {
      fm.props.on_submit({ fm, form: fm.data, error: fm.error.object });
    }
  };
  if (typeof fm.props.on_init === "function") {
    fm.props.on_init({ fm, submit: fm.submit, reload: fm.reload });
  }
};
