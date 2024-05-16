import { FC, useEffect } from "react";
import { FMLocal, FieldLocal, FieldProp } from "../../typings";
import { useLocal } from "@/utils/use-local";
import Quill from "quill";
import "quill/dist/quill.snow.css"; // Import CSS untuk tema Quill
import get from "lodash.get";
export const FieldRichText: FC<{
  field: FieldLocal;
  fm: FMLocal;
  arg: FieldProp;
}> = ({ field, fm, arg }) => {
  const local = useLocal({
    ref: null as any,
  });
  useEffect(() => {
    if (local.ref) {
      console.log(local.ref);
      console.log(local.ref.current);
      const q = new Quill(local.ref, {
        theme: "snow",
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"], // toggled buttons
            ["blockquote", "code-block"],
            ["link", "image", "video", "formula"],

            [{ header: 1 }, { header: 2 }], // custom button values
            [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
            [{ script: "sub" }, { script: "super" }], // superscript/subscript
            [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
            [{ direction: "rtl" }], // text direction

            [{ size: ["small", false, "large", "huge"] }], // custom dropdown
            [{ header: [1, 2, 3, 4, 5, 6, false] }],

            [{ color: [] }, { background: [] }], // dropdown with defaults from theme
            [{ font: [] }],
            [{ align: [] }],

            ["clean"], // remove formatting button
          ],
        },
      });
    }
  }, []);
  let value: any = fm.data[field.name];
  return (
    <div className="c-flex c-flex-col c-w-full">
      <div
        ref={(e) => (local.ref = e)}
        className={cx(css`
          height: 20rem !important;
        `)}
      ></div>
    </div>
  );
};
