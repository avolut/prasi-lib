import { REGEXP_ONLY_DIGITS } from "input-otp";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "lib/comps/ui/input-otp";
import { useLocal } from "lib/utils/use-local";
import { FC } from "react";
import { FieldLocal, FieldProp, FMLocal } from "../../typings";
import { PropTypeInput } from "./TypeInput";

export const FieldOTP: FC<{
  digit: number;
  field: FieldLocal;
  fm: FMLocal;
  prop: PropTypeInput;
  arg: FieldProp;
}> = ({ digit, fm, field, arg }) => {
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
          if (arg.on_change) {
            arg.on_change({ value: local.otp, fm, name: field.name });
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
