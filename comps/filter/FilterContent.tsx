import { FC } from "react";
import { BaseForm } from "../form/base/BaseForm";
import { FilterLocal } from "./utils/types";
import { useLocal } from "lib/utils/use-local";

export const FilterContent: FC<{
  mode: string;
  filter: FilterLocal;
  PassProp: any;
  child: any;
  _item: PrasiItem;
}> = ({ mode, filter, PassProp, child, _item }) => {
  const internal = useLocal({});
  return (
    <div
      className={cx(
        `c-flex c-flex-1 filter-content filter-${mode}`,
        css`
          &.filter-content {
            border-radius: 4px;
            background: #fff;
          }
          &.filter-regular {
            width: 100%;
            /* Styles specific to sidebar */
          }

          &.filter-inline {
            display: flex;
            align-items: center;
            /* Styles specific to topbar */
          }

          &.filter-popup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 1000;
            /* Styles specific to popup */
          }
        `
      )}
    >
      <BaseForm
        data={filter.data}
        on_submit={(form) => {
          console.log("skrg nyubmit");
          console.log(form.data);
        }}
        render={internal.render}
      >
        {(form) => {
          filter.form = form;
          return (
            <>
              {!!(PassProp && child) && (
                <PassProp filter={filter}>{child}</PassProp>
              )}
            </>
          );
        }}
      </BaseForm>

     
    </div>
  );
};
