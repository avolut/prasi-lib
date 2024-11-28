import { ReactElement } from "react";
import { createPortal } from "react-dom";
import { toast as sonner, Toaster as SonnerToaster } from "sonner";
const timer = {
  timeout: null as any,
  done: false,
  limit: 200,
};

export const toast = {
  position: "top-right" as any,
  toasting: [] as any[],
  dismiss: () => {
    if (!timer.timeout) {
      if (toast.toasting.length > 0) {
        for (const t of toast.toasting) {
          sonner.dismiss(t.id);
        }
      }
      sonner.dismiss()
    } else {
      clearTimeout(timer.timeout);
      timer.timeout = null;
    }
  },
  loading: (
    el: ReactElement,
    props?: { dismissible?: boolean; className?: string }
  ) => {
    clearTimeout(timer.timeout);
    timer.timeout = setTimeout(() => {
      toast.toasting.push(
        sonner.loading(el, {
          ...props,
          onDismiss: (t) => {
            toast.toasting = toast.toasting.filter((e) => e !== t.id);
          },
        })
      );
      timer.timeout = null;
    }, timer.limit);
  },
  success: (
    el: ReactElement,
    props?: { dismissible?: boolean; className?: string; duration?: number }
  ) => {
    clearTimeout(timer.timeout);
    timer.timeout = setTimeout(() => {
      toast.toasting.push(
        sonner.success(el, {
          ...props,
          onDismiss: (t) => {
            toast.toasting = toast.toasting.filter((e) => e !== t.id);
          },
        })
      );
      timer.timeout = null;
    }, timer.limit);
  },
  error: (
    el: ReactElement,
    props?: { dismissible?: boolean; className?: string }
  ) => {
    clearTimeout(timer.timeout);
    timer.timeout = setTimeout(() => {
      toast.toasting.push(
        sonner.error(el, {
          ...props,
          onDismiss: (t) => {
            toast.toasting = toast.toasting.filter((e) => e !== t.id);
          },
        })
      );
      clearTimeout(timer.timeout);

      timer.timeout = null;
    }, timer.limit);
  },
};

export const Toaster = () => {
  if (document.getElementsByClassName("prasi-toaster").length === 0) {
    const elemDiv = document.createElement("div");
    elemDiv.className = "prasi-toaster";
    document.body.appendChild(elemDiv);
  }
  const toaster_el = document.getElementsByClassName("prasi-toaster")[0];

  return (
    <>
      {toaster_el &&
        createPortal(
          <SonnerToaster position={toast.position} cn={cx} />,
          toaster_el
        )}
    </>
  );
};
