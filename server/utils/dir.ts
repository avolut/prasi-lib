import { join } from "path";

const g = (typeof global !== "undefined" ? global : undefined) as unknown as {
  datadir?: string;
  mode?: string;
};

export const dir = {
  data: (path: string) => {
    const final_path = path
      .split("/")
      .filter((e) => e !== "..")
      .join("/");
    if (g.mode === "prod") return join(process.cwd(), "..", "data", final_path);
    else return join(process.cwd(), "data", final_path);
  },
};
