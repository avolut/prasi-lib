import { useLocal } from "@/utils/use-local";
import { FC } from "react";
import { FMLocal, FieldLocal, FieldProp } from "../../typings";

export const FieldTag: FC<{
  field: FieldLocal;
  fm: FMLocal;
  arg: FieldProp;
}> = ({ field, fm, arg }) => {
  const local = useLocal({
    ref: null as any,
    focus: false as boolean,
    value: null as any,
  });
  let value: any = fm.data[field.name];
  let tags: Array<string> = typeof value === "string" ? value.split(",") : [];
  if(isEditor){
    tags = ["sample","sample"]
  }

  return (
    <div className="c-flex-grow c-flex-row c-flex c-w-full c-h-full">
      <div
        className={cx(
          "c-px-2 c-flex c-flex-row c-items-center c-flex-wrap c-flex-grow c-gap-1 c-m-1"
        )}
        onClick={() => {
          if (local.ref) {
            local.ref.focus();
          }
        }}
      >
        {tags.map((item) => {
          return (
            <div className="c-cursor-text c-flex-row c-flex c-items-center c-text-xs c-font-medium  c-rounded c-border c-border-black">
              <span className="c-flex-grow c-px-2.5  c-py-0.5">{item}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                className="c-px-1 c-border-l c-border-black c-cursor-pointer "
                viewBox="0 0 40 40"
                onClick={() => {
                  // delete tag, pakai filter
                  let tag: Array<string> = tags.filter((e) => e !== item) || [];
                  // jadiin value string
                  let value = tags.join(",");
                  fm.data[field.name] = value;
                  fm.render();
                }}
              >
                <path
                  fill="currentColor"
                  d="M21.499 19.994L32.755 8.727a1.064 1.064 0 0 0-.001-1.502c-.398-.396-1.099-.398-1.501.002L20 18.494L8.743 7.224c-.4-.395-1.101-.393-1.499.002a1.05 1.05 0 0 0-.309.751c0 .284.11.55.309.747L18.5 19.993L7.245 31.263a1.064 1.064 0 0 0 .003 1.503c.193.191.466.301.748.301h.006c.283-.001.556-.112.745-.305L20 21.495l11.257 11.27c.199.198.465.308.747.308a1.058 1.058 0 0 0 1.061-1.061c0-.283-.11-.55-.31-.747z"
                />
              </svg>
            </div>
          );
        })}
        <input
          ref={(el) => (local.ref = el)}
          type={"text"}
          value={local.value}
          onClick={() => {}}
          onChange={(ev) => {
            local.value = ev.currentTarget.value;
            local.render();
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              // detect string kosong
              if (local.value !== "" && local.value) {
                // jadiin array atau split
                let tag: Array<string> = local.value.split(",") || [];
                // filter tag dari value gk boleh sama
                tag = tag.filter((e) => !tags.includes(e));
                // concat
                tags = tags.concat(tag);
                // jadiin value string
                let value = tags.join(",");
                local.value = "";
                local.render();
                fm.data[field.name] = value;
                fm.render();
              }
              event.preventDefault();
              event.stopPropagation();
            }
          }}
          disabled={field.disabled}
          className={cx(
            "c-flex-grow c-flex-1 c-items-center c-bg-transparent c-outline-none c-px-2 c-text-sm",
            "c-max-w-full"
          )}
          spellCheck={false}
          onFocus={() => {
            console.log("focus?");
          }}
          onBlur={() => {
            console.log("blur?");
          }}
        />
      </div>
    </div>
  );
};
