import { FMLocal, FieldLocal } from "../typings";

export const validate = (field: FieldLocal, fm: FMLocal, record?: any) => {
  const msg = (name: string) => {
    return (
      <>
        <b
          className={css`
            font-weight: bold;
            text-transform: capitalize;
          `}
        >
          {name}
        </b>{" "}
        is required.
      </>
    );
  };
  if (field.required) {
    const data = record || fm.data;
    const error_msg = msg(field.label);
    if (
      data[field.name] === undefined ||
      data[field.name] === null ||
      data[field.name] === ""
    ) {
      fm.error.set(field.name, [error_msg]);
    }
  }
};
