import { AutoHeightTextarea } from "@/comps/custom/AutoHeightTextarea";
import { useLocal } from "@/utils/use-local";
import parser from "any-date-parser";
import { format } from "date-fns";
import { FC } from "react";
import { FMLocal, FieldLocal, FieldProp } from "../../typings";
import { FieldMoney } from "./TypeMoney";
import { FieldRichText } from "./TypeRichText";
import { FieldUpload } from "./TypeUpload";

export type PropTypeText = {
  type: "text" | "date";
  sub_type:
    | "text"
    | "password"
    | "number"
    | "date"
    | "datetime"
    | "textarea"
    | "datetime-local"
    | "time"
    | "money"
    | "rich-text"
    | "upload"
    | "file"
    | "password";
  suffix: string;
  prefix: string;
};

const parse = parser.exportAsFunctionAny("en-US");

export const FieldTypeText: FC<{
  field: FieldLocal;
  fm: FMLocal;
  prop: PropTypeText;
  arg: FieldProp;
}> = ({ field, fm, prop, arg }) => {
  let type_field = prop.sub_type;
  switch (type_field) {
    case "datetime":
      type_field = "datetime-local";
      break;
    default:
  }

  const input = useLocal({});
  let display: any = null;
  let value: any = fm.data[field.name];

  // let value: any = "2024-05-14T05:58:01.376Z" // case untuk date time
  field.input = input;
  field.prop = prop;
  if (["date", "datetime", "datetime-local", "time"].includes(type_field)) {
    if (typeof value === "string" || value instanceof Date) {
      let date = parse(value);
      if (typeof date === "object" && date instanceof Date) {
        if (type_field === "date") value = format(date, "yyyy-MM-dd");
        else if (type_field === "datetime-local")
          value = format(date, "yyyy-MM-dd HH:mm");
        else if (type_field === "time") value = format(date, "HH:mm");
      } else if (type_field === "time") {
        if (value && !isTimeString(value)) value = null;
      } else {
        value = null;
      }
    } else {
      try {
        let date = parse(value);
        if (typeof date === "object" && date instanceof Date) {
          value = date.toISOString();
        }
      } catch (e) {}
    }
  } else if (["number"].includes(type_field)) {
    value = Number(value) || null;
  }

  return (
    <>
      {type_field === "textarea" ? (
        <AutoHeightTextarea
          onChange={(ev) => {
            fm.data[field.name] = ev.currentTarget.value;
            fm.render();
          }}
          value={value || ""}
          disabled={field.disabled}
          className="c-flex-1 c-bg-transparent c-outline-none c-p-2 c-text-sm c-w-full"
          spellCheck={false}
          onFocus={() => {
            field.focused = true;
            field.render();
          }}
          placeholder={arg.placeholder || ""}
          onBlur={() => {
            field.focused = false;
            field.render();
          }}
        />
      ) : type_field === "upload" ? (
        <>
          <FieldUpload field={field} fm={fm} prop={prop} />
          {/* <input
            type="file"
            id="avatar"
            name="avatar"
            accept="image/png, image/jpeg"
            onChange={async (event: any) => {
              let file = null;
              try {
                file = event.target.files[0];
              } catch (ex) {}
              const formData = new FormData();
              formData.append("file", file);
              const response = await fetch(
                "https://prasi.avolut.com/_proxy/https%3A%2F%2Feam.avolut.com%2F_upload",
                {
                  method: "POST",
                  body: formData,
                }
              );

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
            }}
          /> */}
        </>
      ) : type_field === "money" ? (
        <>
          <FieldMoney field={field} fm={fm} prop={prop} />
        </>
      ) : type_field === "rich-text" ? (
        <>
          <FieldRichText field={field} fm={fm} prop={prop} />
        </>
      ) : (
        <input
          type={type_field}
          onChange={(ev) => {
            if (["date", "datetime", "datetime-local"].includes(type_field)) {
              let result = null;
              try {
                result = new Date(ev.currentTarget.value);
              } catch (ex) {}
              fm.data[field.name] = result;
            } else {
              fm.data[field.name] = ev.currentTarget.value;
            }
            fm.render();
          }}
          placeholder={arg.placeholder || ""}
          value={value}
          disabled={field.disabled}
          className="c-flex-1 c-bg-transparent c-outline-none c-px-2 c-text-sm c-w-full"
          spellCheck={false}
          onFocus={() => {
            field.focused = true;
            display = "halo dek";
            field.render();
          }}
          onBlur={() => {
            field.focused = false;
            field.render();
          }}
        />
      )}
    </>
  );
};
const isTimeString = (time: any) => {
  // Regex untuk deteksi string ini tipenya time
  const timePattern = /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/;
  return timePattern.test(time);
};
