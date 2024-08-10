import { useLocal } from "@/utils/use-local";
import get from "lodash.get";
import { Trash2, Upload } from "lucide-react";
import { ChangeEvent, FC } from "react";
import { FMLocal, FieldLocal, FieldProp } from "../../typings";
import { PropTypeInput } from "./TypeInput";
import { FilePreview } from "./FilePreview";
import { Spinner } from "lib/comps/ui/field-loading";
const w = window as unknown as {
  serverurl: string;
};

export const FieldUploadMulti: FC<{
  field: FieldLocal;
  fm: FMLocal;
  prop: PropTypeInput;
  styling?: string;
  arg: FieldProp;
  on_change: (e: any) => void | Promise<void>;
}> = ({ field, fm, prop, on_change, arg }) => {
  let value: string = (fm.data[field.name] || "").trim();
  // let type_upload =
  const input = useLocal({
    value: 0 as any,
    display: false as any,
    ref: null as any,
    drop: false as boolean,
    uploading: new Set<File>(),
    fase: value ? "preview" : ("start" as "start" | "upload" | "preview"),
    style: "inline" as "inline" | "full",
  });

  const parse_list = () => {
    let list: string[] = [];
    if (value.startsWith("[")) {
      try {
        list = JSON.parse(value);
      } catch (e) {}
    } else if (typeof value === "string" && value) {
      list.push(value);
    }
    return list;
  };

  const on_upload = async (event: ChangeEvent<HTMLInputElement>) => {
    const upload_single = async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      let url = siteurl("/_upload");
      if (
        location.hostname === "prasi.avolut.com" ||
        location.host === "localhost:4550"
      ) {
        const newurl = new URL(location.href);
        newurl.pathname = `/_proxy/${url}`;
        url = newurl.toString();
      }
      const response = await fetch(url, {
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
          return `_file${get(result, "[0]")}`;
        }
      }
      throw new Error("Upload Failed");
    };

    if (event.target.files) {
      const list = parse_list();

      for (let i = 0; i < event.target.files.length; i++) {
        const file = event.target?.files?.item(i);
        if (file) {
          input.uploading.add(file);
          upload_single(file).then((path) => {
            input.uploading.delete(file);
            list.push(path);
            fm.data[field.name] = JSON.stringify(list);
            fm.render();
          });
        }
      }
      input.render();
    }
    if (input.ref) {
      input.ref.value = null;
    }
  };

  if (isEditor) input.fase = "start";

  const list = parse_list();

  return (
    <div className="c-flex-grow c-flex-col c-flex c-w-full c-h-full c-items-stretch c-p-1">
      <div
        className={cx(
          "c-flex c-flex-row c-flex-wrap",
          css`
            flex-flow: row wrap;
          `
        )}
      >
        {list.map((value, idx) => {
          return (
            <div
              className="c-py-1 c-pr-2"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              <div
                className={cx(
                  "c-relative",
                  css`
                    .del {
                      opacity: 0;
                    }
                    &:hover {
                      .del {
                        opacity: 1;
                      }
                    }
                  `
                )}
              >
                <FilePreview url={value || ""} variant="thumb" />
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (confirm("Remove this file ?")) {
                      list.splice(idx, 1);
                      fm.data[field.name] = JSON.stringify(list);
                      fm.render();
                    }
                  }}
                  className={cx(
                    "c-flex c-flex-row c-items-center c-px-1 c-rounded c-bg-white c-cursor-pointer hover:c-bg-red-100 c-absolute c-top-0 c-right-0 del transition-all",
                    css`
                      border: 1px solid red;
                      width: 25px;
                      height: 25px;
                      margin: 5px;
                    `
                  )}
                >
                  <Trash2 className="c-text-red-500 c-h-4 c-w-4 " />
                </div>
              </div>
            </div>
          );
        })}
        {input.uploading.size > 0 && (
          <div className="c-flex c-space-x-1 c-p-2 c-border">
            <Spinner /> <div>Uploading</div>
          </div>
        )}
      </div>
      <div className="c-flex">
        <div className={cx("c-flex c-border c-rounded ")}>
          <div
            className={cx(
              "c-flex c-flex-row c-relative c-py-1 c-flex-grow c-pr-2 c-items-center c-cursor-pointer hover:c-bg-blue-50",
              css`
                input[type="file"],
                input[type="file"]::-webkit-file-upload-button {
                  cursor: pointer;
                }
              `
            )}
          >
            {!isEditor && (
              <input
                ref={(ref) => {
                  if (!input.ref) {
                    input.ref = ref;
                  }
                }}
                type="file"
                multiple={true}
                accept={field.prop.upload?.accept}
                onChange={on_upload}
                className={cx(
                  "c-absolute c-w-full c-h-full c-cursor-pointer c-top-0 c-left-0 c-opacity-0"
                )}
              />
            )}
            <div className="c-items-center c-flex c-text-base c-px-1 c-outline-none c-rounded c-cursor-pointer ">
              <div className="c-flex c-flex-row c-items-center c-px-2">
                <Upload className="c-h-4 c-w-4" />
              </div>
              <div className="c-flex c-flex-row c-items-center c-text-sm">
                Upload File
              </div>
            </div>
          </div>
        </div>
        <div
          className="c-flex-1"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        ></div>
      </div>
    </div>
  );
};