import { FMLocal } from "lib/exports";
import { formError } from "../../utils/error";

export const createFm = (arg: {
  data: any;
  onSubmit?: (arg: { fm: FMLocal }) => Promise<boolean> | boolean;
  render: () => void;
}) => {
  const fm = {
    data: arg.data,
    fields: {},
    render: arg.render,
  } as FMLocal;

  fm.submit = async () => {
    if (arg.onSubmit) {
      await arg.onSubmit({ fm });
    }
    return true;
  };
  fm.error = formError(fm);

  return fm;
};
