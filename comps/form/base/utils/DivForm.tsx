import { forwardRef } from "react";

export const DivForm = forwardRef<
  HTMLFormElement,
  React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLFormElement>,
    HTMLFormElement
  > & { tag: "form" | "div" }
>((arg, ref) => {
  const props = { ...arg } as any;
  delete props.tag;
  if (arg.tag === "div") {
    if (props.onSubmit) delete props.onSubmit;

    return (
      <div {...props} ref={ref}>
        {arg.children}
      </div>
    );
  }
  return (
    <form {...props} ref={ref}>
      {arg?.children}
    </form>
  );
});
