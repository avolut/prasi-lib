import { useLocal } from "@/utils/use-local";
import get from "lodash.get";
import { FC } from "react";
import { FMLocal, FieldLocal, FieldProp } from "../../typings";
import { PropTypeInput } from "./TypeInput";
import * as XLSX from "xlsx";
import {
  ArrowDownToLine,
  ExternalLink,
  Loader2,
  Paperclip,
  SquareArrowOutUpRight,
  Trash2,
  Upload,
} from "lucide-react";
import { Spinner } from "lib/comps/ui/field-loading";
const w = window as unknown as {
  serverurl: string;
};

export const FieldUpload: FC<{
  field: FieldLocal;
  fm: FMLocal;
  prop: PropTypeInput;
  styling?: string;
  arg: FieldProp;
  on_change: (e: any) => void | Promise<void>;
}> = ({ field, fm, prop, on_change, arg }) => {
  const styling = arg.upload_style ? arg.upload_style : "full";
  let type_field = prop.sub_type;
  let value: any = fm.data[field.name];
  // let type_upload =
  const input = useLocal({
    value: 0 as any,
    display: false as any,
    ref: null as any,
    drop: false as boolean,
    fase: value ? "preview" : ("start" as "start" | "upload" | "preview"),
    style: "inline" as "inline" | "full",
  });
  let display: any = null;
  const disabled =
    typeof field.disabled === "function" ? field.disabled() : field.disabled;
  const on_upload = async (event: any) => {
    let file = null;
    try {
      file = event.target.files[0];
    } catch (ex) {}
    if (type_field === "import") {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const binaryStr = e.target.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });

        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        if (typeof on_change === "function") {
          const res = on_change({
            value: jsonData,
            file: file,
            binnary: e.target.result,
          });
        }
      };
      reader.readAsBinaryString(file);
    } else {
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
      input.fase = "upload";
      input.render();
      try {
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
            fm.data[field.name] = `_file${get(result, "[0]")}`;
            fm.render();
            setTimeout(() => {
              input.fase = "preview";
              input.render();
            }, 1000);
          } else {
            input.fase = "start";
            input.render();
            alert("Error upload");
          }
        } else {
        }
      } catch (ex) {
        input.fase = "start";
        input.render();
        alert("Error upload");
      }
    }
    if (input.ref) {
      input.ref.value = null;
    }
  };
  return (
    <div className="c-flex-grow c-flex-row c-flex c-w-full c-h-full c-items-center">
      {input.fase === "start" ? (
        <>
          <div className="c-flex c-flex-row c-relative c-flex-grow">
            <input
              ref={(ref) => (input.ref = ref)}
              type="file"
              multiple={false}
              onChange={on_upload}
              className={cx(
                "c-absolute c-w-full c-h-full c-cursor-pointer c-top-0 c-left-0 c-hidden"
              )}
            />
            {styling === "inline" ? (
              <>
                <div
                  onClick={() => {
                    if (input.ref) {
                      console.log(input.ref)
                      input.ref.click();
                    }
                  }}
                  className="c-items-center c-flex c-text-base c-px-5 c-py-3 c-outline-none c-rounded c-cursor-pointer "
                >
                  <div className="c-flex c-flex-row c-items-center c-px-2">
                    <Upload className="c-h-4 c-w-4" />
                  </div>
                  <div className="c-flex c-flex-row c-items-center">
                    Upload Your File
                  </div>
                </div>
              </>
            ) : (
              <>
                <div
                  onDrop={(e: any) => {
                    e.preventDefault();
                    input.drop = false;
                    input.render();
                  }}
                  onDragOver={(e: any) => {
                    // Prevent default behavior (Prevent file from being opened)
                    e.preventDefault();
                    input.drop = true;
                    input.render();
                  }}
                  className={cx(
                    input.drop ? "c-bg-gray-100" : "",
                    "hover:c-bg-gray-100 c-flex-grow c-m-1 c-relative c-flex-grow c-p-4 c-items-center c-flex c-flex-row c-text-gray-400 c-border c-border-gray-200 c-border-dashed c-rounded c-cursor-pointer"
                  )}
                >
                  <div className="c-flex-row c-flex c-flex-grow c-space-x-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 14 14"
                    >
                      <g
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3.5 13.5h-2a1 1 0 0 1-1-1v-8h13v8a1 1 0 0 1-1 1h-2" />
                        <path d="M4.5 10L7 7.5L9.5 10M7 7.5v6M11.29 1a1 1 0 0 0-.84-.5h-6.9a1 1 0 0 0-.84.5L.5 4.5h13zM7 .5v4" />
                      </g>
                    </svg>
                    <div className="c-flex c-flex-col">
                      <span className="c-font-medium">
                        Drop Your File or{" "}
                        <span className="c-underline c-text-blue-500">
                          Browse
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      ) : input.fase === "upload" ? (
        <>
          <div className="c-px-2">
            <Loader2 className={cx("c-h-5 c-w-5 c-animate-spin")} />
          </div>
          <div className="c-px-2">Uploading</div>
        </>
      ) : input.fase === "preview" ? (
        <>
          <div className="c-flex c-flex-row c-p-2  c-items-center">
            <IconFile type={getFileName(siteurl(value)).extension} />
          </div>
          <div
            className="c-line-clamp-1 c-flex-grow  c-items-center"
            onClick={() => {
              let url = siteurl(value);
              window.open(url, "_blank");
            }}
          >
            {getFileName(siteurl(value)).fullname}
          </div>
          <div className="c-flex c-flex-row  c-items-center">
            <div className="c-flex c-flex-row c-space-x-1 c-px-2">
              <SquareArrowOutUpRight
                className="c-h-5 c-w-5"
                onClick={() => {
                  let url = siteurl(value);
                  window.open(url, "_blank");
                }}
              />
              <Trash2
                className="c-text-red-500 c-h-5 c-w-5"
                onClick={() => {
                  fm.data[field.name] = null;
                  fm.render();
                }}
              />
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
  return (
    <div className="c-flex-grow c-flex-row c-flex c-w-full c-h-full c-items-center">
      <div className="c-flex c-flex-row c-p-2  c-items-center">
        <IconFile
          type={
            getFileName("https://www.example.com/path/to/your/file.txt")
              .extension
          }
        />
      </div>
      <div className="c-line-clamp-1 c-flex-grow  c-items-center">
        {getFileName("https://www.example.com/path/to/your/file.txt").fullname}
      </div>
      <div className="c-flex c-flex-row  c-items-center">
        <div className="c-flex c-flex-row c-space-x-1 c-px-2">
          <SquareArrowOutUpRight
            className="c-h-5 c-w-5"
            onClick={() => {
              let url = siteurl(value);
              window.open(url, "_blank");
            }}
          />
          <Trash2
            className="c-text-red-500 c-h-5 c-w-5"
            onClick={() => {
              fm.data[field.name] = null;
              fm.render();
            }}
          />
        </div>
      </div>
    </div>
  );
};
const getFileName = (url: string) => {
  const fileName = url.substring(url.lastIndexOf("/") + 1);
  const dotIndex = fileName.lastIndexOf(".");
  const fullname = fileName;
  if (dotIndex === -1) {
    return { name: fileName, extension: "", fullname };
  }
  const name = fileName.substring(0, dotIndex);
  const extension = fileName.substring(dotIndex + 1);
  return { name, extension, fullname };
};

const IconFile: FC<{ type: string }> = ({ type }) => {
  if (["xlsx"].includes(type)) {
    return (
      <div className="c-flex c-flex-row c-text-[#2a801d]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="m2.859 2.877l12.57-1.795a.5.5 0 0 1 .571.494v20.848a.5.5 0 0 1-.57.494L2.858 21.123a1 1 0 0 1-.859-.99V3.867a1 1 0 0 1 .859-.99M17 3h4a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-4zm-6.8 9L13 8h-2.4L9 10.286L7.4 8H5l2.8 4L5 16h2.4L9 13.714L10.6 16H13z"
          />
        </svg>
      </div>
    );
  } else {
    return (
      <div className="c-flex c-flex-row ">
        <Paperclip className="c-h-5 c-w-5" />
      </div>
    );
  }
  return (
    <div className="c-flex c-flex-row c-p-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="m2.859 2.877l12.57-1.795a.5.5 0 0 1 .571.494v20.848a.5.5 0 0 1-.57.494L2.858 21.123a1 1 0 0 1-.859-.99V3.867a1 1 0 0 1 .859-.99M17 3h4a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-4zm-6.8 9L13 8h-2.4L9 10.286L7.4 8H5l2.8 4L5 16h2.4L9 13.714L10.6 16H13z"
        />
      </svg>
    </div>
  );
};
