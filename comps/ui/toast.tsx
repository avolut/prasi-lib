import { ReactElement } from "react";
import { toast as sonner } from "sonner";
const timer = {
  timeout: null as any,
  done: false,
  limit: 200,
};

export const toast = {
  dismiss: () => {
    if (!timer.timeout) {
      sonner.dismiss();
    } else {
      clearTimeout(timer.timeout);
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
    props?: { dismissible?: boolean; className?: string }
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
      timer.timeout = null;
    }, timer.limit);
  },
};
