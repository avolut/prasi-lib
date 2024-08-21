import { baseurl } from "./baseurl";

export const _post = async (
  path: string,
  data: any,
  opt?: { server_target?: "auto" | "always-prod"; response_as?: "json" | "raw" }
) => {
  const final_path = path.startsWith("/") ? path : `/${path}`;

  let _url = baseurl(final_path);

  if (
    location.hostname === "prasi.avolut.com" ||
    location.host === "localhost:4550"
  ) {
    if (opt?.server_target === "always-prod") {
      const newurl = new URL(location.href);
      newurl.pathname = `/_proxy/${_url}`;
      _url = newurl.toString();
    }
  }

  const res = await fetch(_url, {
    method: "POST",
    body: JSON.stringify(data),
  });
  let text = await res.text();
  if (!opt || (opt && opt.response_as === "json")) {
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error(`\
🚧 Server Error: ${path}
`);
      console.error(
        `%c⬆ DATA SENT: `,
        "color:green",
        `\n` + JSON.stringify(data, null, 2)
      );
      console.error(
        `%c⬇ DATA RECEIVED: `,
        `color:red`,
        `\n` + JSON.stringify(text, null, 2)
      );
      console.error(`Failed to parse received data as JSON!`);
    }
  } else {
    return text;
  }
};
