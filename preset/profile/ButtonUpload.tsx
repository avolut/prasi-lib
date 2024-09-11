import { useLocal } from "lib/utils/use-local";
import get from "lodash.get";
import { FC, ReactNode } from "react";
export const ButtonUpload: FC<{
  child: ReactNode;
  url_upload: string;
  on_update: (url: string) => Promise<void>;
}> = ({ child, url_upload, on_update }) => {
  const input = useLocal({
    value: 0 as any,
    display: false as any,
    ref: null as any,
    drop: false as boolean,
  });
  return (
    <div className="c-flex-grow c-flex-row c-flex">
      <div className={cx("c-cursor-pointer c-flex-grow")}>
        <div
          className="c-flex c-flex-row"
          onClick={() => {
            if (input.ref) {
              input.ref.click();
            }
          }}
        >
          {child}
        </div>
        <input
          ref={(ref) => (input.ref = ref)}
          type="file"
          multiple
          onChange={async (event: any) => {
            let file = null;
            try {
              file = event.target.files[0];
            } catch (ex) {}
            const formData = new FormData();
            formData.append("file", file);
            const response = await fetch(url_upload, {
              method: "POST",
              body: formData,
            });

            if (response.ok) {
              const contentType: any = response.headers.get("content-type");
              let result;
              if (contentType.includes("application/json")) {
                result = await response.json();
              } else if (contentType.includes("text/plain")) {
                result = await response.text();
              } else {
                result = await response.blob();
              }
              if (Array.isArray(result)) {
                const url: any = get(result, "[0]") || null;
                await on_update(url);
              } else {
                alert("Error upload");
              }
            } else {
            }
          }}
          className={
            "c-absolute c-w-full c-h-full c-cursor-pointer c-top-0 c-left-0 c-hidden"
          }
        />
      </div>
    </div>
  );
};
