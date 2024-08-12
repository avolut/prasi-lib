import { useLocal } from "@/utils/use-local";
import Quill from "quill";
import "quill/dist/quill.snow.css"; // Import CSS untuk tema Quill
import { FC, useEffect } from "react";
import { FMLocal, FieldLocal, FieldProp } from "../../typings";
import { PropTypeInput } from "./TypeInput";

export const FieldRichText: FC<{
  field: FieldLocal;
  fm: FMLocal;
  prop: PropTypeInput;
}> = ({ field, fm, prop }) => {
  const local = useLocal({
    ref: null as null | HTMLDivElement,
    q: null as null | Quill,
  });
  useEffect(() => {
    if (local.ref) {
      local.ref.innerHTML = fm.data[field.name] || "";
      local.q = new Quill(local.ref, {
        theme: "snow",
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"], // toggled buttons
            [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
            [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
            ["clean"], // remove formatting button
          ],
        },
      });

      local.q.on("text-change", (delta, oldDelta, source) => {
        fm.data[field.name] = local.q?.getSemanticHTML();
        fm.render();
      });
    }
  }, []);
  return (
    <div
      className={cx(
        "c-flex c-flex-col c-w-full",
        css`
          .ql-toolbar,
          .ql-container {
            border: 0px !important;
          }
          .ql-container {
            border-top: 1px solid #cecece !important;
          }
          .ql-editor {
            resize: vertical;
            overflow-y: scroll;
            min-height: 5rem !important;
          }
        `
      )}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <div
        ref={(e) => (local.ref = e)}
        className={cx(css`
          min-height: 5rem !important;
        `)}
      ></div>
    </div>
  );
};
