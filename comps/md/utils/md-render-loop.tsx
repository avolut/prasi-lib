import { MDLocal, MDProps, MDRef } from "./typings";

export const mdRenderLoop = (md: MDLocal, mdr: MDRef, props: MDProps) => {
  console.log(mdr.item.childs);
  const childs = mdr.item.edit.childs.filter(
    (e) => e?.component?.id === "cb52075a-14ab-455a-9847-6f1d929a2a73"
  );

  console.log(mdr.item.edit.childs);
  for (const c of childs) {
    console.log(c);
  }
};
