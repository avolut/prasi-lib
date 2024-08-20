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
  dismiss: () => {
    if (!timer.timeout) {
      sonner.dismiss();
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
      sonner.loading(el, props);
      timer.timeout = null;
    }, timer.limit);
  },
  success: (
    el: ReactElement,
    props?: { dismissible?: boolean; className?: string; duration?: number }
  ) => {
    clearTimeout(timer.timeout);
    timer.timeout = setTimeout(() => {
      sonner.success(el, props);
      timer.timeout = null;
    }, timer.limit);
  },
  error: (
    el: ReactElement,
    props?: { dismissible?: boolean; className?: string }
  ) => {
    clearTimeout(timer.timeout);
    timer.timeout = setTimeout(() => {
      sonner.error(el, props);
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
