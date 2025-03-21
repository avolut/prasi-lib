import { AutoHeightTextarea } from "lib/comps/custom/AutoHeightTextarea";
import { useLocal } from "lib/utils/use-local";
import parser from "any-date-parser";
import Datepicker from "lib/comps/custom/Datepicker";
import { EyeIcon, EyeOff } from "lucide-react";
import { FC, FocusEvent } from "react";
import { FMLocal, FieldLocal, FieldProp } from "../../typings";
import { FieldMoney } from "./TypeMoney";
import { FieldRichText } from "./TypeRichText";
import { FieldUpload } from "./TypeUpload";
import { KeyValue } from "./KeyValue";
import { InputMask, format } from "@react-input/mask";
import { FieldOTP } from "./TypeOTP";

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
    | "toggle"
    | "rich-text"
    | "upload"
    | "search"
    | "password"
    | "import"
    | "monthly"
    | "key-value"
    | "mask"
    | "phone"
    | "otp";
  placeholder?: string;
  onFocus?: (e: FocusEvent<HTMLDivElement>) => void;
  onBlur?: (e: FocusEvent<HTMLDivElement>) => void;
  model_upload?: "upload" | "import";
  onChange?: (value: any) => void;
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
  const internal = useLocal({
    render_timeout: null as any,
    search_timeout: null as any,
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

  let value: any = fm.data[field.name] || "";

  // let value: any = "2024-05-14T05:58:01.376Z" // case untuk date time
  field.input = input;
  if (["date", "datetime", "datetime-local", "time"].includes(type_field)) {
    if (typeof value === "string" || value instanceof Date) {
      let date = parse(value);
      if (typeof date === "object" && date instanceof Date) {
      } else if (type_field === "time") {
        if (value && !isTimeString(value)) value = null;
      } else {
        value = null;
      }

      if (type_field === "datetime-local" && date instanceof Date) {
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        value = date.toISOString().slice(0, 16);
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
    if (prop.onChange) {
      prop.onChange(fm.data[field.name]);
    } else {
      arg.on_change?.({ value: fm.data[field.name], name: field.name, fm });
    }
    clearTimeout(input.change_timeout);
    input.change_timeout = setTimeout(fm.render, 300);
  };

  const disabled =
    typeof field.disabled === "function" ? field.disabled() : field.disabled;

  switch (type_field) {
    case "toggle":
      return (
        <div className="c-px-2">
          <div
            className={cx(
              "c-relative",
              css`
                input:checked ~ .dot {
                  transform: translateX(100%);
                }
                input:checked ~ .dot-wrap {
                  background-color: #125ad6;
                }
              `
            )}
          >
            <input
              type="checkbox"
              checked={!!fm.data[field.name]}
              className="c-sr-only"
              onChange={(e) => {
                const check = e.target.checked;
                if (check) {
                  fm.data[field.name] = true;
                } else {
                  fm.data[field.name] = false;
                }
                renderOnChange();
              }}
            />
            <div className="dot-wrap c-block c-bg-gray-600 c-w-8 c-h-5 c-rounded-full"></div>
            <div
              className={cx(
                "dot c-absolute c-left-1 c-top-1 c-bg-white c-w-3 c-h-3 c-rounded-full c-transition"
              )}
            ></div>
          </div>{" "}
        </div>
      );
    case "textarea":
      return (
        <AutoHeightTextarea
          onChange={(ev) => {
            fm.data[field.name] = ev.currentTarget.value;
            renderOnChange();
          }}
          value={value || ""}
          disabled={disabled}
          className="c-flex-1 c-bg-transparent c-outline-none c-p-2 c-text-sm c-w-full"
          spellCheck={false}
          onFocus={() => {
            field.focused = true;
            field.render();
          }}
          placeholder={arg.placeholder || ""}
          onBlur={() => {
            if (field) {
              field.focused = false;
              field.render();
            }
          }}
        />
      );
    case "upload":
      return <FieldUpload arg={arg} field={field} fm={fm} prop={prop} />;
    case "import":
      return <FieldUpload arg={arg} field={field} fm={fm} prop={prop} />;
    case "money":
      return (
        <>
          <FieldMoney field={field} fm={fm} prop={prop} arg={arg} />
        </>
      );
    case "otp":
      return <FieldOTP field={field} fm={fm} prop={prop} arg={arg} digit={4} />;
    case "rich-text":
      return <FieldRichText field={field} fm={fm} prop={prop} />;
    case "date": {
      return (
        <Datepicker
          value={{ startDate: value, endDate: value }}
          disabled={disabled}
          displayFormat="DD MMM YYYY"
          mode={"daily"}
          maxDate={field.max_date instanceof Date ? field.max_date : null}
          minDate={field.min_date instanceof Date ? field.min_date : null}
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
    case "key-value":
      return (
        <KeyValue
          index={field.prop.kv?.index}
          value={
            Object.keys(fm.data[field.name] || {}).length === 0
              ? field.prop.kv?.default
              : fm.data[field.name] || {}
          }
          onChange={(val) => {
            fm.data[field.name] = val;
            fm.render();
          }}
        />
      );
    case "phone":
      return (
        <div className="c-flex c-relative c-flex-1">
          <InputMask
            mask="____-____-_______"
            replacement={{ _: /\d/ }}
            onChange={(ev) => {
              console.log("onchange");

              fm.data[field.name] = ev.currentTarget.value.replace(/\D/g, "");
              renderOnChange();
            }}
            inputMode="decimal"
            value={format(value, {
              mask: "____-____-_______",
              replacement: { _: /\d/ },
            })}
            placeholder={prop.placeholder || arg.placeholder || ""}
            disabled={disabled}
            className="c-flex-1 c-transition-all c-bg-transparent c-outline-none c-px-2 c-text-sm c-w-full"
            spellCheck={false}
            onFocus={(e) => {
              field.focused = true;
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
        </div>
      );
    case "mask":
      const mask = arg.mask || "____-____-_______";
      return (
        <div className="c-flex c-relative c-flex-1">
          <InputMask
            mask={mask}
            inputMode="decimal"
            replacement={{ _: /\d/ }}
            onChange={(ev) => {
              fm.data[field.name] = ev.currentTarget.value.replace(/\D/g, "");
              renderOnChange();
            }}
            value={format(value, {
              mask: mask,
              replacement: { _: /\d/ },
            })}
            placeholder={prop.placeholder || arg.placeholder || ""}
            disabled={disabled}
            className="c-flex-1 c-transition-all c-bg-transparent c-outline-none c-px-2 c-text-sm c-w-full"
            spellCheck={false}
            onFocus={(e) => {
              field.focused = true;
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
        </div>
      );
    case "monthly": {
      return (
        <Datepicker
          value={{ startDate: value, endDate: value }}
          disabled={disabled}
          displayFormat="MMM YYYY"
          mode={"monthly"}
          maxDate={field.max_date instanceof Date ? field.max_date : null}
          minDate={field.min_date instanceof Date ? field.min_date : null}
          asSingle={true}
          useRange={false}
          onChange={(value) => {
            console.log({ value });
            fm.data[field.name] = value?.startDate
              ? new Date(value?.startDate)
              : null;
            renderOnChange();
          }}
        />
      );
    }
    case "search": {
      return (
        <div className={cx("search-all c-flex items-center")}>
          <div className="c-pl-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          <input
            type="search"
            placeholder={prop.placeholder}
            spellCheck={false}
            className="c-flex-1 c-transition-all c-bg-transparent c-outline-none c-px-2 c-text-sm c-w-full"
            onChange={async (ev) => {
              fm.data[field.name] = ev.currentTarget.value;
              renderOnChange();

              clearTimeout(internal.search_timeout);
              internal.search_timeout = setTimeout(() => {
                fm?.submit();
              }, 1500);
            }}
          />
        </div>
      );
    }
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
        }}
        placeholder={prop.placeholder || arg.placeholder || ""}
        value={value}
        disabled={disabled}
        className="c-flex-1 c-transition-all c-bg-transparent c-outline-none c-px-2 c-text-sm c-w-full"
        spellCheck={false}
        onFocus={(e) => {
          field.focused = true;
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

function setCursorPosition(pos: number, elem: HTMLInputElement) {
  elem.focus();
  if (elem.setSelectionRange) elem.setSelectionRange(pos, pos);
  //@ts-ignore
  else if (elem.createTextRange) {
    //@ts-ignore
    let range = elem.createTextRange();
    range.collapse(true);
    range.moveEnd("character", pos);
    range.moveStart("character", pos);
    range.select();
  }
}
