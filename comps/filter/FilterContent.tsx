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

            .field {
              padding-top: 0px;
              align-items: center;
            }
            .field > .label {
              display: none;
            }
            .field-inner {
              min-height: 25px;
            }
            .form-inner {
              align-items: center;
            }
            .field-input {
              margin-top: 0 !important;
            }
            .field-outer {
              margin-top: 3px;
              margin-bottom: 3px;
            }

            .search-all {
              input {
                width: 150px;
              }
            }

            .search-focus {
              width: 250px !important;
            }
          }

          &.filter-popup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 1000;
            /* Styles specific to popup */
          }

          .form-inner {
            position: relative;
          }
        `
      )}
    >
      <BaseForm
        data={filter.data}
        on_submit={(form) => {
          console.log("skrg nyubmit");
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

