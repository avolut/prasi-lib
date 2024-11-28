import { FC } from "react"
import { FilePreview } from "./FilePreview";
import { Trash2 } from "lucide-react";
import { FMLocal } from "lib/exports";


export const PreviewAfterUpload: FC<{
    fm: FMLocal, fieldName: string, local: any
}> = ({ fm, fieldName, local }) => {
    return (
        <div className="c-flex-grow c-flex-row c-flex c-w-full c-h-full c-items-stretch">
            <div className="c-flex c-justify-between c-flex-1 c-p-1">
                <FilePreview url={fm.data[fieldName] || ""} />

                <div
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (confirm("Clear this file ?")) {
                            fm.data[fieldName] = null;
                            local.attachment = "";
                            local.render();
                            fm.render();
                        }
                    }}
                    className={cx(
                        "c-flex c-flex-row c-items-center c-border c-px-2 c-rounded c-cursor-pointer hover:c-bg-red-100"
                    )}
                >
                    <Trash2 className="c-text-red-500 c-h-4 c-w-4" />
                </div>

            </div>
        </div>
    )
}