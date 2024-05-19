import { useLocal } from "@/utils/use-local";
import { FC } from "react";
import { FMLocal, FieldLocal } from "../../typings";
import { PropTypeText } from "./TypeText";
export const FieldMoney: FC<{
  field: FieldLocal;
  fm: FMLocal;
  prop: PropTypeText;
}> = ({ field, fm, prop }) => {
  let type_field = prop.sub_type;
  let value: any = fm.data[field.name];
  const input = useLocal({
    value: 0 as any,
    display: false as any,
    ref: null as any,
  });
  let display: any = null;
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
        disabled={field.disabled}
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
