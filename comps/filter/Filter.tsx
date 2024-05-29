import { useLocal } from "@/utils/use-local";
import get from "lodash.get";
import { FC, ReactNode, useEffect, useRef } from "react";
import { FMLocal } from "../form/Form";
import { createPortal, render } from "react-dom";
import { Label } from "@/comps/ui/label";
import { Input } from "@/comps/ui/input";

type FilterPosition = 'regular' | 'inline' | 'popup';

type FilterForm = {
  gen_fields: GenField[];
  gen_table: string;
  name: string;
  value: any;
  position: FilterPosition;
  children?: ReactNode;
  onClose?: () => void;
};

type GenField = {
  name: string,
  is_pk: boolean,
  type: string,
  optional: boolean
};

export const MasterFilter: FC<FilterForm> = ({ gen_fields, gen_table, name, value, position, children, onClose }): ReactNode => {
  const local = useLocal({
    data: [] as any[],
    columns: [] as string[],
    fields: [] as GenField[],
    tableName: "",
    isGenerated: false,
    // fm: {} as FMLocal,
    argInit: {} as { fm: FMLocal; submit: any; reload: any },
    argOnLoad: {} as { arg: { fm: FMLocal } },
    argOnSubmit: {} as {
      arg: {
        fm: FMLocal;
        form: any;
        error: any;
      }
    }
  });
  useEffect(() => {
    if (!isEditor) {
      const w = window as any;
      if (typeof w["prasi_filter"] !== "object") w["prasi_filter"] = {};
      if (typeof w["prasi_filter"][name] !== "object")
        w["prasi_filter"][name] = {};
      const val = value();
      w["prasi_filter"][name] = {
        ...w["prasi_filter"][name],
        ...val
      };
      w.prasiContext.render();
    }
  }, [])

  const renderContent = (): ReactNode => (
    <div className={`filter-content filter-${position}`}>
      <h3>Filter</h3>
      <form>
        {local.fields.map((field) => (
          <div>
            {field.type === 'varchar' && (
              <div className="grid w-full max-w-sm items-center gap-1.5" >
                <Label htmlFor={field.name}>{field.name}</Label>
                <Input id={field.name} type="text" />
              </div>
            )}
            {field.type === "number" && (
              <div className="grid w-full max-w-sm items-center gap-1.5" >
                <Label htmlFor={field.name}>{field.name}</Label>
                <Input id={field.name} type="number" />
              </div>
            )}
          </div>
        ))}
      </form >
    </div >
  );

  const generateFilter = () => {
    local.isGenerated = true;
    local.tableName = gen_table;
    gen_fields.forEach((data: any) => {
      local.fields.push(JSON.parse(data));
    });
    local.render();
    console.log('tableName', local.tableName);
    console.log('fields', local.fields);
  };

  if (position === 'popup') {
    let popup = document.querySelector(".main-content-preview > .portal");
    if (!popup) {
      popup = document.createElement("div");
      popup.classList.add("portal");

      const main = document.querySelector(".main-content-preview");
      if (main) {
        main.appendChild(popup);
      }
    }
    return (
      <>
        {createPortal(
          <div
            onClick={onClose}
            className={cx(
              css`
                position: absolute;
                top: 0;
                bottom: 0;
                right: 0;
                left: 0;
                background: white;
                z-index: 100;
              `,
              "c-flex c-flex-col"
            )}
          >
            {renderContent()}
          </div>,
          popup
        )}
      </>
    );
  }

  if (local.isGenerated) {
    return renderContent();
  } else {
    return (
      <div>
        <button
          onClick={generateFilter}
          style={{
            backgroundColor: "#4CAF50",
            border: "none",
            color: "white",
            padding: "15px 32px",
            textAlign: "center",
            textDecoration: "none",
            display: "inline-block",
            fontSize: "16px",
            margin: "4px 2px",
            cursor: "pointer",
            borderRadius: "10px",
          }}
        >
          Generate
        </button>
      </div >
    )
  }
};
