import { useLocal } from "@/utils/use-local";
import get from "lodash.get";
import { FC } from "react";
import { FMLocal, FieldLocal } from "../../typings";
import { PropTypeInput } from "./TypeInput";
import * as XLSX from "xlsx";
const w = window as unknown as {
  serverurl: string
}

export const FieldUpload: FC<{
  field: FieldLocal;
  fm: FMLocal;
  prop: PropTypeInput;
  on_change: (e: any) => void | Promise<void>;
}> = ({ field, fm, prop, on_change }) => {
  let type_field = prop.sub_type;
  let value: any = fm.data[field.name];
  // let type_upload =
  const input = useLocal({
    value: 0 as any,
    display: false as any,
    ref: null as any,
    drop: false as boolean,
  });
  let display: any = null;
  const disabled =
    typeof field.disabled === "function" ? field.disabled() : field.disabled;
  return (
    <div className="c-flex-grow c-flex-row c-flex c-w-full c-h-full">
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
          "hover:c-bg-gray-100 c-m-1 c-relative c-flex-grow c-p-4 c-items-center c-flex c-flex-row c-text-gray-400 c-border c-border-gray-200 c-border-dashed c-rounded c-cursor-pointer"
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
              <span className="c-underline c-text-blue-500">Browse</span>
            </span>
          </div>
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
            if (type_field === "import") {
              const reader = new FileReader();

              reader.onload = (e: any) => {
                const binaryStr = e.target.result;
                const workbook = XLSX.read(binaryStr, { type: "binary" });

                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                if (typeof on_change === "function") {
                  const res = on_change({ value: jsonData });
                }
              };
              reader.readAsBinaryString(file);
            } else {
              const formData = new FormData();
              formData.append("file", file);

              let url = siteurl("/_upload");
              if (location.hostname === 'prasi.avolut.com' || location.host === 'localhost:4550') {
                const newurl = new URL(location.href);
                newurl.pathname = `/_proxy/${w.serverurl}/_upload`;
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
                  fm.data[field.name] = get(result, "[0]");
                  fm.render();
                } else {
                  alert("Error upload");
                }
              } else {
              }
            }
          }}
          className={
            "c-absolute c-w-full c-h-full c-cursor-pointer c-top-0 c-left-0 c-hidden"
          }
        />
      </div>
    </div>
  );
  // console.log({ prop });
  return (
    <div className="c-flex-grow c-flex-row c-flex c-w-full c-h-full">
      <div
        className={cx(
          input.display ? "c-hidden" : "",
          "c-flex-grow c-px-2 c-flex c-flex-row c-items-center"
        )}
        onClick={() => {
          if (input.ref) {
            input.display = !input.display;
            input.ref.focus();
            input.render();
          }
        }}
      >
        {formatMoney(Number(value) || 0)}
      </div>
      <input
        ref={(el) => (input.ref = el)}
        type={"number"}
        onClick={() => {}}
        onChange={(ev) => {
          fm.data[field.name] = ev.currentTarget.value;
          fm.render();
        }}
        value={value}
        disabled={disabled}
        className={cx(
          !input.display ? "c-hidden" : "",
          "c-flex-1 c-bg-transparent c-outline-none c-px-2 c-text-sm c-w-full"
        )}
        spellCheck={false}
        onFocus={() => {
          field.focused = true;
          field.render();
        }}
        onBlur={() => {
          console.log("blur");
          field.focused = false;
          input.display = !input.display;
          input.render();
          field.render();
        }}
      />
    </div>
  );
};
const formatMoney = (res: number) => {
  const formattedAmount = new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
  }).format(res);
  return formattedAmount;
};
