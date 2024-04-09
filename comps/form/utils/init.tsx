import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { FMLocal, FMProps } from "../typings";
import { formError } from "./error";
import { editorFormData } from "./ed-data";

export const formInit = (fm: FMLocal, props: FMProps) => {
  for (const [k, v] of Object.entries(props)) {
    if (["PassProp", "body"].includes(k)) continue;
    (fm.props as any)[k] = v;
  }
  const { on_load, sonar } = fm.props;
  fm.error = formError(fm);

  fm.reload = () => {
    fm.status = "loading";
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

        const res = on_load({ fm });

        if (typeof res === "object" && res instanceof Promise) {
          fm.data = await res;
        } else {
          fm.data = res;
        }

        // if (isEditor) {
        //   const item_id = (props?.props?.className || "")
        //     .split(" ")
        //     .find((e: string) => e.startsWith("s-"));

        //   if (item_id) {
        //     console.log(item_id);
        //   }
        // }

        fm.internal.reload.done.map((e) => e());
      }, 50);
    });
    fm.internal.reload.promises.push(promise);
    return promise;
  };

  fm.data = { halo: "any" };

  fm.submit = async () => {};
  fm.props.on_init({ fm, submit: fm.submit, reload: fm.reload });
};
