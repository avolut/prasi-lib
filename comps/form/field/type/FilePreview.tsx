import { ExternalLink } from "lucide-react";

export const FilePreview = ({
  url,
  variant,
}: {
  url: string;
  variant?: "thumb";
}) => {
  const file = getFileName(url);
  if (typeof file === "string")
    return (
      <div
        className={cx(
          css`
            border-radius: 3px;
            padding: 0px 5px;
            height: 20px;
            margin-right: 5px;
            height: 20px;
            border: 1px solid #ccc;
            background: white;
          `,
          "c-flex c-items-center c-text-sm"
        )}
      >
        {file}
      </div>
    );
  const color = darkenColor(generateRandomColor(file.extension));
  let content = (
    <div
      className={cx(
        css`
          background: white;
          border: 1px solid ${color};
          color: ${color};
          border-radius: 3px;
          text-transform: uppercase;
          padding: 0px 5px;
          font-size: 9px;
          height: 15px;
          margin-right: 5px;
        `,
        "c-flex c-items-center"
      )}
    >
      {file.extension}
    </div>
  );

  if (variant === "thumb") {
    content = (
      <div
        className={cx(
          css`
            background: white;
            color: ${color};
            border: 1px solid ${color};
            color: ${color};
            border-radius: 3px;
            text-transform: uppercase;
            font-size: 16px;
            font-weight: black;
            padding: 3px 7px;
            margin-left: 5px;
            height: 30px;
          `,
          "c-flex c-items-center"
        )}
      >
        {file.extension}

        <div className="c-ml-1">
          <ExternalLink size="12px" />
        </div>
      </div>
    );
  }

  if (url.startsWith("_file/")) {
    if ([".png", ".jpeg", ".jpg", ".webp"].find((e) => url.endsWith(e))) {
      content = (
        <img
          className="c-py-1 c-rounded-md"
          src={siteurl(
            `/_img/${url.substring("_file/".length)}?${
              variant === "thumb" ? "w=95&h=95" : "w=100&h=20"
            }`
          )}
        />
      );
    }
  }
  return (
    <>
      {file.extension && (
        <div
          className={cx(
            "c-flex c-border c-rounded c-items-center c-px-1  c-bg-white c-cursor-pointer",
            variant !== "thumb"
              ? "c-pr-2"
              : css`
                  width: 95px;
                  max-height: 95px;
                  min-height: 50px;
                `,
            css`
              &:hover {
                border: 1px solid #1c4ed8;
                outline: 1px solid #1c4ed8;
              }
            `
          )}
          onClick={() => {
            let _url = siteurl(url || "");
            window.open(_url, "_blank");
          }}
        >
          {content}
          {variant !== "thumb" && (
            <div className="c-ml-2">
              <ExternalLink size="12px" />
            </div>
          )}
        </div>
      )}
    </>
  );
};
function darkenColor(color: string, factor: number = 0.5): string {
  const rgb = hexToRgb(color);
  const r = Math.floor(rgb.r * factor);
  const g = Math.floor(rgb.g * factor);
  const b = Math.floor(rgb.b * factor);
  return rgbToHex(r, g, b);
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}
function generateRandomColor(str: string): string {
  let hash = 0;
  if (str.length === 0) return hash.toString(); // Return a string representation of the hash
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 255;
    color += ("00" + value.toString(16)).substr(-2);
  }
  return color;
}
const getFileName = (url: string) => {
  if (url.startsWith("[")) {
    try {
      const list = JSON.parse(url);
      if (list.length === 0) return "Empty";
      return `${list.length} File${list.length > 1 ? "s" : ""}`;
    } catch (e) {
      console.error(`Error parsing multi-file: ${url}`);
    }
    return "Unknown File";
  }

  const fileName = url.substring(url.lastIndexOf("/") + 1);
  const dotIndex = fileName.lastIndexOf(".");
  const fullname = fileName;
  if (dotIndex === -1) {
    return { name: fileName, extension: "", fullname };
  }
  const name = fileName.substring(0, dotIndex);
  const extension = fileName.substring(dotIndex + 1);
  return { name, extension, fullname };
};
