import { FC } from "react";
import { BaseForm } from "../form/base/BaseForm";
import { FilterLocal } from "./utils/types";
import { useLocal } from "lib/utils/use-local";
import { getFilter } from "./utils/get-filter";
import { FMLocal } from "../form/typings";

export const FilterContent: FC<{
  mode: string;
  filter: FilterLocal;
  onSubmit?: (form: FMLocal | null) => Promise<any>;
  PassProp: any;
  child: any;
  _item: PrasiItem;
}> = ({ mode, filter, PassProp, child, _item, onSubmit }) => {
  const internal = useLocal({});
  return (
    <div
      className={cx(
        `c-flex c-flex-1 filter-content filter-${mode}`,
        mode === "raw"
          ? css`
              flex-grow: 1;
              height: 100%;
            `
          : "",
        css`
          &.filter-regular {
            width: 100%;
            /* Styles specific to sidebar */
          }

          &.filter-inline {
            display: flex;
            align-items: center;

            .form-inner {
              padding-right: 1px;
            }

            .field {
              padding-top: 0px;
              align-items: center;
              padding-left: 0;
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
              margin: 3px;

              border: 1px solid #cecece;

              &.focused {
                border: 1px solid #1c4ed8;
                outline: 1px solid #1c4ed8;
              }
            }

            .search-all {
              input {
                width: 150px;
              }
            }

            .field.search {
              width: auto;
              &.focused,
              &.filled {
                input {
                  width: 250px !important;
                }
              }
              &.filled {
                .field-outer {
                  border: 2px solid blue;
                }
              }
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
        on_submit={async (form) => {
          try {
            if (typeof form.fm?.data === "object") {
              const fm = form.fm?.data as any
              form.render();
              form.fm.render();
            }
          } catch (ex) {}

          if (typeof onSubmit === "function" && mode === "raw") {
            const data = await onSubmit(form.fm);
            if (typeof form.fm?.data === "object") {
              form.fm.data = {
                __status: "submit",
                ...form.fm.data,
                _where: data,
              };
              form.fm.render();
              filter.data = {
                __status: "submit",
                ...form.fm.data,
                _where: data,
              };
              filter.render();
            }
          }
          // form.render();
          const f = getFilter(filter.name);
          if (f) {
            for (const list of Object.values(f.list.ref)) {
              list.reload();
            }
          }
        }}
        render={internal.render}
      >
        {(form) => {
          filter.form = form;
          return (
            <>
              {!!(PassProp && child) && (
                <PassProp filter={filter} fm={form.fm}>
                  {child}
                </PassProp>
              )}
            </>
          );
        }}
      </BaseForm>
    </div>
  );
};
