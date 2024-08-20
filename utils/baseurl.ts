export const baseurl = (url: string) => {
  if (location.hostname === "prasi.avolut.com") {
    const id_site = location.pathname.split("/")[2];
    if (url.startsWith("/")) return `/prod/${id_site}${url}`;
    else return `/prod/${id_site}/${url}`;
  }
  return url;
};

export const imgThumb = ({
  url,
  w,
  h,
  fit,
}: {
  url: string;
  w: number;
  h: number;
  fit?: "cover" | "contain" | "inside" | "fill" | "outside";
}) => {
  return siteurl(
    `/_img/${url.substring("_file/".length)}?w=${w}&h=${h}&fit=${
      fit || "cover"
    }`
  );
};
