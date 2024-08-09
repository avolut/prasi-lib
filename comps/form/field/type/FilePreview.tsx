import { ExternalLink } from "lucide-react";

export const FilePreview = ({ url }: { url: string }) => {
  const file = getFileName(url);
  const color = darkenColor(generateRandomColor(file.extension));
  let content = (
    <div
      className={cx(
        css`
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
  if (url.startsWith("_file/")) {
    if ([".png", ".jpeg", ".jpg", ".webp"].find((e) => url.endsWith(e))) {
      content = (
        <img
          className="c-py-1 c-rounded-md"
          src={siteurl(`/_img/${url.substring("_file/".length)}?w=100&h=20`)}
        />
      );
    }
  }
  return (
    <>
      {file.extension && (
        <div
          className="c-flex c-border c-rounded c-items-center c-px-1 c-pr-2 c-bg-white hover:c-bg-blue-50 c-cursor-pointer"
          onClick={() => {
            let _url = siteurl(url || "");
            window.open(_url, "_blank");
          }}
        >
          {content}
          <div className="c-ml-2">
            <ExternalLink size="12px" />
          </div>
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
