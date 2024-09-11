import { useLocal } from "lib/utils/use-local";
import { glb } from "app/lib/goal";
import { Button } from "lib/comps/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "lib/comps/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { FC, useEffect } from "react";

export const Pop: FC<{
  child: any;
  PassProp: any;
  props: any;
  content: any;
}> = ({ child, PassProp, props, content }) => {
  const local = useLocal({
    open: false,
  });
  return (
    <Dialog open={local.open}>
      <DialogTrigger asChild>
        <div {...props} className={cx(props.className, "")}>
          <PassProp
            pop={{
              open: () => {
                local.open = true;
                local.render();
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
      </DialogTrigger>
      <DialogOverlay
        onClick={() => {
          local.open = false;
          local.render();
        }}
        className={cx(
          "",
          css`
            background-color: #00000038 !important;
          `
        )}
      />
      <DialogContent className="sm:s-max-w-[425px]">
        <DialogPrimitive.Close
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
        </DialogPrimitive.Close>
        <DialogHeader className="c-hidden">
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <PassProp
          pop={{
            open: () => {
              local.open = true;
              local.render();
            },
            close: () => {
              local.open = false;
              local.render();
            },
          }}
        >
          {content}
        </PassProp>
      </DialogContent>
    </Dialog>
  );
};
