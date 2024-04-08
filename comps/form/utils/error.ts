import { FMLocal } from "../typings";

export const formError = (fm: FMLocal) => {
  const error = {} as FMLocal["error"];
  error.list = [];
  error.clear = () => {};
  error.set = () => {};
  error.get = () => {};
  return error;
};
