import { useLocal } from "lib/utils/use-local";
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
  close?: string;
  mode?: "full" | "normal" | "1/3";
  direction?: "left" | "right" | "bottom" | "top";
  deps?: any;
  _item?: PrasiItem;
  onInit?: (e: any) => void;
}> = ({
  child,
  PassProp,
  props,
  content,
  header,
  open,
  close,
  mode,
  direction,
  deps,
  _item,
  onInit,
}) => {
  const local = useLocal({
    open: false,
    data: null as any,
  });
  useEffect(() => {
    if (isEditor) {
      let op = open === "y" ? true : false;
      if (local.open !== op) {
        local.open = op;
        local.render();
      }
    } else {
      if (typeof onInit === "function") {
        onInit({
          data: local,
          deps,
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
        });
      }
    }
  }, [open]);
  return (
    <Sheet open={local.open}>
      <SheetTrigger asChild>
        <div {...props} className={cx(props.className, "")}>
          <PassProp
            sheet={{
              data: local,
              deps,
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
        side={direction}
        className={cx(
          mode === "1/3"
            ? css`
                max-width: 500px !important;
              `
            : mode === "full"
            ? "c-w-screen"
            : "sm:s-max-w-[425px]",
          css`
            z-index: 2;
          `
        )}
      >
        <div className="c-relative">
          {close !== "n" ? (
            <SheetPrimitive.Close
              onClick={() => {
                local.open = false;
                local.render();
              }}
              className={cx(
                "c-absolute c-right-4  c-rounded-sm c-opacity-70 c-ring-offset-background c-transition-opacity hover:c-opacity-100 focus:c-outline-none focus:c-ring-2 focus:c-ring-ring focus:c-ring-offset-2 disabled:c-pointer-events-none data-[state=open]:c-bg-accent data-[state=open]:c-text-muted-foreground",
                css`
                  right: 1rem;
                  z-index: 99;
                  transform: translateY(50%);
                `
              )}
            >
              <X className="c-h-4 c-w-4" />
              <span className="c-sr-only">Close</span>
            </SheetPrimitive.Close>
          ) : (
            <></>
          )}
          {header !== "" && header ? (
            <SheetHeader
              className={cx(
                "c-text-base",
                css`
                  padding: 0px 0px 0px 10px;
                `
              )}
            >
              <SheetTitle
                className={cx(
                  "c-text-base",
                  css`
                    font-size: 1rem !important;
                    line-height: 1.5rem !important;
                  `
                )}
              >
                {header}
              </SheetTitle>
            </SheetHeader>
          ) : (
            <>
              <SheetHeader
                className={cx(
                  css`
                    padding: 0px;
                  `
                )}
              >
                <SheetTitle></SheetTitle>
              </SheetHeader>
            </>
          )}
        </div>

        <PassProp
          sheet={{
            data: local,
            deps,
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
