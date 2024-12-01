import { useLocal } from "lib/utils/use-local";
import { FC, useEffect } from "react";
import { FieldLocal, FieldProp, FMLocal } from "../../typings";
import { PropTypeInput } from "./TypeInput";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "lib/comps/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";

export const FieldOTP: FC<{
  digit: number;
  field: FieldLocal;
  fm: FMLocal;
  prop: PropTypeInput;
  arg: FieldProp;
}> = ({ digit, fm, field }) => {
  const local = useLocal({
    otp: "",
    ref: [] as HTMLInputElement[],
  });

  return (
    <div
      className={cx(
        "c-flex-1 c-flex c-justify-center c-items-center",
        css`
          height: 100px;
          .otp-single {
            height: 80px;
            width: 50px;
            font-size: 20px;
          }
        `
      )}
    >
      <InputOTP
        maxLength={4}
        value={local.otp}
        onChange={(value) => {
          local.otp = value;
          local.render();
          if (field.on_change) {
            field.on_change({ value, name: field.name, fm });
          }
        }}
        pattern={REGEXP_ONLY_DIGITS}
        inputMode="decimal"
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} className="otp-single" />
          <InputOTPSlot index={1} className="otp-single" />
          <InputOTPSlot index={2} className="otp-single" />
          <InputOTPSlot index={3} className="otp-single" />
        </InputOTPGroup>
      </InputOTP>
    </div>
  );
};
