import { forwardRef } from "react";

export const DivForm = forwardRef<
  HTMLFormElement,
  React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLFormElement>,
    HTMLFormElement
  > & { tag: "form" | "div" }
>((arg, ref) => {
  if (arg.tag === "div") {
    const props = { ...arg } as any;
    if (props.onSubmit) delete props.onSubmit;
    return (
      <div {...props} ref={ref}>
        {arg.children}
      </div>
    );
  }
  return (
    <form {...arg} ref={ref}>
      {arg?.children}
    </form>
  );
});
