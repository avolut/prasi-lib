import { useLocal } from "lib/utils/use-local";
import { FC, useEffect } from "react";
import { FieldLocal, FieldProp, FMLocal } from "../../typings";
import { PropTypeInput } from "./TypeInput";

export const FieldOTP: FC<{
  digit: number;
  field: FieldLocal;
  fm: FMLocal;
  prop: PropTypeInput;
  arg: FieldProp;
}> = ({ digit, fm, field }) => {
  const local = useLocal({
    otp: [] as string[],
    ref: [] as HTMLInputElement[],
  });

  // useEffect(() => {
  //   if (typeof fm.data[field.name] === "string") {
  //     local.otp = fm.data[field.name].split("");
  //     local.render();
  //   }
  // }, [fm.data[field.name]]);

  if (local.otp.length === 0 && digit) {
    for (let i = 0; i < digit; i++) {
      local.otp.push("");
    }
  }

  return (
    <div className="c-flex-1 c-flex c-justify-center c-items-center">
      {local.otp.map((item, idx) => (
        <input
          type="text"
          key={idx}
          className={cx(
            "c-rounded-md c-text-center",
            css`
              margin: 3px;
              font-size: 3em;
              padding: 0px 10px;
              width: 60px;
              height: 100px;
              border: 1px solid #ddd;
              background: white;
            `
          )}
          onChange={() => {}}
          value={item}
          ref={(ref) => {
            if (ref) local.ref[idx] = ref;
          }}
          onPaste={(e) => {
            e.preventDefault();

            var clipboardData =
              e.clipboardData || (window as any).clipboardData;
            var pastedData = clipboardData.getData("text");
            for (let i = 0; i < pastedData.length; i++) {
              if (i >= local.otp.length) break;
              local.otp[i] = pastedData[i];
            }
            local.render();
          }}
          onKeyDown={async (e) => {
            if (e.key === "Backspace") {
              local.otp[idx] = "";
              local.render();
              const ref = local.ref[idx - 1];
              if (ref) {
                ref.focus();
              }
            } else if (parseInt(e.key) || e.key === "0") {
              local.otp[idx] = e.key;
              local.render();
              const ref = local.ref[idx + 1];
              if (ref) {
                ref.focus();
              }
            }

            const otp = local.otp.join("");
            fm.data[field.name] = otp;
            fm.render();
            local.render();
          }}
        />
      ))}
    </div>
  );
};
