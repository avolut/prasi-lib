import { useLocal } from "@/utils/use-local";
import { FC, useEffect } from "react";
import { FMLocal, FieldLocal, FieldProp } from "../../typings";
import { PropTypeInput } from "./TypeInput";
import { isEmptyString } from "lib/utils/is-empty-string";
export const FieldMoney: FC<{
  field: FieldLocal;
  fm: FMLocal;
  prop: PropTypeInput;
  arg: FieldProp;
}> = ({ field, fm, prop, arg }) => {
  let type_field = prop.sub_type;
  let value: any = fm.data[field.name];
  const input = useLocal({
    value: 0 as any,
    display: false as any,
    ref: null as any,
  });
  useEffect(() => {
    input.value = value;
    input.render();
  }, [fm.data[field.name]]);
  let display: any = null;
  const disabled =
    typeof field.disabled === "function" ? field.disabled() : field.disabled;
  const money = formatMoney(Number(value) || 0);
  return (
    <div className="c-flex-grow c-flex-row c-flex c-w-full c-h-full">
      {/* <div
        className={cx(
          input.display ? "c-hidden" : "",
          "c-flex-grow c-px-2 c-flex c-flex-row c-items-center",
          isEmptyString(value) ? "c-text-gray-400" : ""
        )}
        onClick={() => {
          if (input.ref) {
            input.display = !input.display;
            input.ref.focus();
            input.render();
          }
        }}
      >
        {isEmptyString(value) ? arg.placeholder : money}
      </div> */}
      <input
        ref={(el) => (input.ref = el)}
        type={"text"}
        onClick={() => {}}
        onChange={(ev) => {
          const rawValue = ev.currentTarget.value
            .replace(/[^0-9,-]/g, "")
            .toString();
          const now = Number(value) || 0;

          if (
            !rawValue.endsWith(",") &&
            !rawValue.endsWith("-") &&
            convertionCurrencyNumber(rawValue) !==
              convertionCurrencyNumber(input.value)
          ) {
            fm.data[field.name] = convertionCurrencyNumber(
              formatCurrency(rawValue)
            );
            fm.render();
            if (field.on_change) {
              field.on_change({
                value: convertionCurrencyNumber(
                  formatCurrency(fm.data[field.name])
                ),
                name: field.name,
                fm,
              });
            }
            input.value = formatCurrency(fm.data[field.name]);
            input.render();
          } else {
            input.value = rawValue;
            input.render();
          }
        }}
        value={formatCurrency(input.value)}
        disabled={disabled}
        className={cx(
          // !input.display ? "c-hidden" : "",
          "c-flex-1 c-bg-transparent c-outline-none c-px-2 c-text-sm c-w-full"
        )}
        spellCheck={false}
        onFocus={() => {
          field.focused = true;
          field.render();
        }}
        placeholder={arg.placeholder || ""}
        onBlur={() => {
          field.focused = false;
          input.display = !input.display;
          input.render();
          field.render();
        }}
      />
    </div>
  );
};
const convertionCurrencyNumber = (value: string) => {
  if (!value) return null;
  let numberString = value.toString().replace(/[^0-9,-]/g, "");
  if (numberString.endsWith(",")) {
    return Number(numberString.replace(",", "")) || 0;
  }
  if (numberString.endsWith("-")) {
    return Number(numberString.replace("-", "")) || 0;
  }
  const rawValue = numberString.replace(/[^0-9,-]/g, "").replace(",", ".");
  return parseFloat(rawValue) || 0;
  return Number(numberString) || 0;
};
const formatCurrency = (value: any) => {
  // Menghapus semua karakter kecuali angka, koma, dan tanda minusif (value === null || value === undefined) return '';
  if (!value) return "";
  let numberString = "";
  if (typeof value === "number") {
    numberString = formatMoney(value);
  } else {
    numberString = value.toString().replace(/[^0-9,-]/g, "");
  }
  if (numberString.endsWith("-") && numberString.startsWith("-")) {
    return "-";
  } else if (numberString.endsWith(",")) {
    const isNegative = numberString.startsWith("-");
    numberString = numberString.replace("-", "");
    const split = numberString.split(",");
    if (isNumberOrCurrency(split[0]) === "Number") {
      split[0] = formatMoney(Number(split[0]));
    }
    let rupiah = split[0];
    rupiah = split[1] !== undefined ? rupiah + "," + split[1] : rupiah;
    return (isNegative ? "-" : "") + rupiah;
  } else {
    const isNegative = numberString.startsWith("-");
    numberString = numberString.replace("-", "");
    const split = numberString.split(",");
    if (isNumberOrCurrency(split[0]) === "Number") {
      split[0] = formatMoney(Number(split[0]));
    }
    let rupiah = split[0];
    rupiah = split[1] !== undefined ? rupiah + "," + split[1] : rupiah;
    return (isNegative ? "-" : "") + rupiah;
  }
};
export const formatMoney = (res: number) => {
  const formattedAmount = new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
  }).format(res);
  return formattedAmount;
};
const isNumberOrCurrency = (input: any) => {
  // Pengecekan apakah input adalah angka biasa
  
  if (typeof input === "string") {
    let rs = input;
    if (input.startsWith("-")) {
      rs = rs.replace("-", "");
    }
    const dots = rs.match(/\./g);
    if (dots && dots.length > 1) {
      return "Currency";
    } else if (dots && dots.length === 1) {
      if (!hasNonZeroDigitAfterDecimal(rs)) {
        return "Currency";
      } else {
        return "Number";
      }
    }
  }
  if (!isNaN(input)) {
    return "Number";
  }
  // Pengecekan apakah input adalah format mata uang dengan pemisah ribuan
  const currencyRegex = /^-?Rp?\s?\d{1,3}(\.\d{3})*$/;
  if (currencyRegex.test(input)) {
    return "Currency";
  }

  // Jika tidak terdeteksi sebagai angka atau format mata uang, kembalikan null atau sesuai kebutuhan
  return null;
};
const hasNonZeroDigitAfterDecimal = (input: string) => {
  // Ekspresi reguler untuk mencocokkan angka 1-9 setelah koma atau titik
  const regex = /[.,]\d*[1-9]\d*/;
  return regex.test(input);
};
