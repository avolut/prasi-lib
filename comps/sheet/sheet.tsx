import { useLocal } from "@/utils/use-local";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { FC, useEffect } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetTitle,
  SheetTrigger,
} from "lib/comps/ui/sheet";

export const SheetCn: FC<{
  child: any;
  PassProp: any;
  props: any;
  content: any;
  header: string;
  open: string;
}> = ({ child, PassProp, props, content, header, open }) => {
  const local = useLocal({
    open: false,
  });
  useEffect(() => {
    if (isEditor) {
      let op = open === "y" ? true : false;
      if (local.open !== op) {
        local.open = op;
        local.render();
      }
    }
  }, [open]);
  return (
    <Sheet open={local.open}>
      <SheetTrigger asChild>
        <div {...props} className={cx(props.className, "")}>
          <PassProp
            sheet={{
              open: () => {
                local.open = true;
                local.render();
                setTimeout(() => {
                  document.body.style.pointerEvents = "auto";
                }, 1000);
              },
              close: () => {
                local.open = false;
                local.render();
              },
            }}
          >
            {child}
          </PassProp>
        </div>
      </SheetTrigger>
      <SheetOverlay
        onClick={() => {
          local.open = false;
          local.render();
        }}
        className={cx(
          "",
          css`
            background-color: #00000038 !important;
            z-index: 1;
          `
        )}
      />
      <SheetContent
        className={cx(
          "sm:s-max-w-[425px]",
          css`
            z-index: 2;
          `
        )}
      >
        <SheetPrimitive.Close
          onClick={() => {
            local.open = false;
            local.render();
          }}
          className={cx(
            "c-absolute c-right-4 c-top-4 c-rounded-sm c-opacity-70 c-ring-offset-background c-transition-opacity hover:c-opacity-100 focus:c-outline-none focus:c-ring-2 focus:c-ring-ring focus:c-ring-offset-2 disabled:c-pointer-events-none data-[state=open]:c-bg-accent data-[state=open]:c-text-muted-foreground",
            css`
              right: 1rem;
            `
          )}
        >
          <X className="c-h-4 c-w-4" />
          <span className="c-sr-only">Close</span>
        </SheetPrimitive.Close>
        <SheetHeader
          className={cx(
            css`
              padding: 0px 0px 0px 10px;
            `
          )}
        >
          <SheetTitle>{header}</SheetTitle>
        </SheetHeader>
        <PassProp
          sheet={{
            open: () => {
              local.open = true;
              local.render();
              setTimeout(() => {
                document.body.style.pointerEvents = "auto";
              }, 1000);
            },
            close: () => {
              local.open = false;
              local.render();
            },
          }}
        >
          {content}
        </PassProp>
      </SheetContent>
    </Sheet>
  );
};
