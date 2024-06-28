import { AutoHeightTextarea } from "@/comps/custom/AutoHeightTextarea";
import { useLocal } from "@/utils/use-local";
import parser from "any-date-parser";
import Datepicker from "lib/comps/custom/Datepicker";
import { EyeIcon, EyeOff } from "lucide-react";
import { FC, FocusEvent, KeyboardEvent, MouseEvent } from "react";
import { FMLocal, FieldLocal, FieldProp } from "../../typings";
import { FieldMoney } from "./TypeMoney";
import { FieldRichText } from "./TypeRichText";
import { FieldUpload } from "./TypeUpload";

export type PropTypeInput = {
  type: "input";
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
    | "search"
    | "password";
  placeholder?: string;
  onFocus?: (e: FocusEvent<HTMLDivElement>) => void;
  onBlur?: (e: FocusEvent<HTMLDivElement>) => void;
  onChange?: (val: any) => void;
  model_upload?: "upload" | "import"
};

const parse = parser.exportAsFunctionAny("en-US");

export const FieldTypeInput: FC<{
  field: FieldLocal;
  fm: FMLocal;
  prop: PropTypeInput;
  arg: FieldProp;
}> = ({ field, fm, prop, arg }) => {
  const input = useLocal({
    show_pass: false,
    change_timeout: null as any,
  });
  let type_field = prop.sub_type;
  switch (type_field) {
    case "datetime":
      type_field = "datetime-local";
      break;
    default:
  }

  if (input.show_pass) {
    type_field = "text";
  }

  let display: any = null;
  let value: any = fm.data[field.name];

  // let value: any = "2024-05-14T05:58:01.376Z" // case untuk date time
  field.input = input;
  field.prop = prop;
  if (["date", "datetime", "datetime-local", "time"].includes(type_field)) {
    if (typeof value === "string" || value instanceof Date) {
      let date = parse(value);
      if (typeof date === "object" && date instanceof Date) {
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

  const renderOnChange = () => {
    input.render();
    if (field.on_change) {
      field.on_change({ value: fm.data[field.name], name: field.name, fm });
    }

    clearTimeout(input.change_timeout);
    input.change_timeout = setTimeout(fm.render, 300);
  };

  switch (type_field) {
    case "textarea":
      return (
        <AutoHeightTextarea
          onChange={(ev) => {
            fm.data[field.name] = ev.currentTarget.value;
            renderOnChange();
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
      );
    case "upload":
      return <FieldUpload field={field} fm={fm} prop={prop} on_change={arg.on_change}/>;
    case "money":
      return <FieldMoney field={field} fm={fm} prop={prop} arg={arg} />;
    case "rich-text":
      return <FieldRichText field={field} fm={fm} prop={prop} />;
    case "date":
      return (
        <Datepicker
          value={{ startDate: value, endDate: value }}
          disabled={field.disabled}
          displayFormat="DD MMM YYYY"
          asSingle={true}
          useRange={false}
          onChange={(value) => {
            fm.data[field.name] = value?.startDate
              ? new Date(value?.startDate)
              : null;
            renderOnChange();
          }}
        />
      );
  }
  return (
    <div className="c-flex c-relative c-flex-1">
      <input
        type={type_field}
        tabIndex={0}
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

          if (type_field === "number") {
            fm.data[field.name] = parseInt(fm.data[field.name]);
          }
          renderOnChange();

          if (prop.onChange) {
            prop.onChange(fm.data[field.name]);
          }
        }}
        placeholder={prop.placeholder || arg.placeholder || ""}
        value={value}
        disabled={field.disabled}
        className="c-flex-1 c-transition-all c-bg-transparent c-outline-none c-px-2 c-text-sm c-w-full"
        spellCheck={false}
        onFocus={(e) => {
          field.focused = true;
          display = "";
          field.render();
          prop.onFocus?.(e);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && fm.status === "ready") fm.submit();
        }}
        onBlur={(e) => {
          field.focused = false;
          field.render();
          prop.onBlur?.(e);
        }}
      />
      {arg.sub_type === "password" && (
        <div
          className="c-absolute c-right-0 c-h-full c-flex c-items-center c-cursor-pointer"
          onClick={() => {
            input.show_pass = !input.show_pass;
            input.render();
          }}
        >
          <div className="">
            {input.show_pass ? (
              <EyeIcon className="c-h-4" />
            ) : (
              <EyeOff className="c-h-4" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
const isTimeString = (time: any) => {
  // Regex untuk deteksi string ini tipenya time
  const timePattern = /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/;
  return timePattern.test(time);
};
