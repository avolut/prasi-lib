import { useLocal } from "@/utils/use-local";
import get from "lodash.get";
import { FC, useEffect, useRef } from "react";

type FilterForm = {
  gen_fields: GenField[];
  gen_table: string;
  name: string;
  value: any;
  child: any;
};

type GenField = {
  name: string,
  is_pk: boolean,
  type: string,
  optional: boolean
};

export const MasterFilter: FC<FilterForm> = ({ gen_fields, gen_table, name, value, child }) => {
  const local = useLocal({
    data: [] as any[],
    columns: [] as string[],
    fields: [] as GenField[],
    tableName: "",
    isGenerated: false,
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

  // return <div>{child}</div>;
  return (
    <div>
      {!local.isGenerated && (
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
      )}
    </div>
  )
};
