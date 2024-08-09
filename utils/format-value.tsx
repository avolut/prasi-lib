import { GFCol } from "@/gen/utils";
import { FC } from "react";
import { isEmptyString } from "./is-empty-string";
import { formatDate } from "lib/comps/custom/Datepicker/helpers";
import dayjs from "dayjs";
import { formatMoney } from "lib/comps/form/field/type/TypeMoney";

export const fields_map = new Map<string, (GFCol & { checked?: GFCol[] })[]>();

export const FormatValue: FC<{
  value: any;
  name: string;
  gen_fields: string[];
  mode?: "money" | "datetime" | "timeago" | "date";
}> = (prop) => {
  const { value, gen_fields, name, mode } = prop;
  if (gen_fields) {
    const gf = JSON.stringify(gen_fields);
    if (!fields_map.has(gf)) {
      const result = gen_fields.map((e: any) => {
        if (typeof e === "string") {
          return JSON.parse(e);
        } else {
          return {
            ...JSON.parse(e.value),
            checked: e.checked.map((ex: any) => {
              if (typeof ex === "string") {
                return JSON.parse(ex);
              }
              try {
                return JSON.parse(ex["value"]);
              } catch (em) {
                return null;
              }
            }),
          };
        }
      });
      fields_map.set(gf, result);
    }

    const fields = fields_map.get(gf);
    const field = fields?.find((e) => e.name === name);

    if (typeof value === "boolean") return <>{value ? "Yes" : "No"}</>;

    if (mode === "money") {
      if (isEmptyString(value)) return "-";
      return formatMoney(ceil_comma(Number(value) || 0));
    } else if (mode === "datetime") {
      if (!value || isEmptyString(value)) return "-";
      try {
        return formatDate(dayjs(value), "DD MMMM YYYY HH:mm");
      } catch (ex: any) {
        return "-";
      }
    } else if (mode === "date") {
      if (!value || isEmptyString(value)) return "-";
      try {
        return formatDate(dayjs(value), "DD MMMM YYYY");
      } catch (ex: any) {
        return "-";
      }
    } else if (mode === "timeago") {
      if (!value || isEmptyString(value)) return "-";
      try {
        return timeAgo(dayjs(value));
      } catch (ex: any) {
        return "-";
      }
    }
    // await db._batch.update({
    //   table: "goal",
    //   data: [],
    //   where: {}
    // })
    if (Array.isArray(value)) {
      return `${value.length} item${value.length > 1 ? "s" : ""}`;
    } else if (typeof value === "object" && value) {
      const rel = fields?.find((e) => e.name === name);
      if (rel && rel.checked) {
        if (rel.type === "has-one") {
          const result = [];
          for (const [k, v] of Object.entries(value) as any) {
            if (!k.toLowerCase().includes("id")) result.push(v);
          }
          return result.join(" - ");
        }
        if (Array.isArray(value)) {
          const len = value.length;
          if (len === 0) return ` - `;
          return `${len} item${len > 1 ? "s" : ""}`;
        }
      }
      return JSON.stringify(value);
    } else if (["timestamptz"].includes(field?.type as string)) {
      if (!value || isEmptyString(value)) return "-";
      try {
        return formatDate(dayjs(value), "DD MMMM YYYY HH:mm");
      } catch (ex: any) {
        return "-";
      }
      return;
    } else if (["date"].includes(field?.type as string)) {
      if (!value || isEmptyString(value)) return "-";
      try {
        return formatDate(dayjs(value), "DD MMMM YYYY");
      } catch (ex: any) {
        return "-";
      }
    } else if (["time"].includes(field?.type as string)) {
      if (!value || isEmptyString(value)) return "-";
      try {
        return formatDate(dayjs(value), "HH:mm");
      } catch (ex: any) {
        return "-";
      }
    } else if (["float"].includes(field?.type as string)) {
      if (!value || isEmptyString(value)) return "-";
      return formatMoney(ceil_comma(Number(value) || 0));
    }
  }

  // let prefix = <></>;
  // if (typeof tree_depth === "number" && tree_depth > 0) {
  //   prefix = (
  //     <div
  //       className={css`
  //         padding-left: ${tree_depth * 5}px;
  //       `}
  //     >
  //       <div
  //         className={cx(
  //           " c-border-l c-border-b c-border-black c-w-[10px] c-h-[15px]",
  //           css`
  //             margin-top: -10px;
  //           `
  //         )}
  //       ></div>
  //     </div>
  //   );
  // }

  return (
    <div className="c-flex c-space-x-2 c-items-center">
      <div>{value}</div>
    </div>
  );
};
const timeAgo = (date: any) => {
  try {
    const now: any = new Date();
    const secondsPast = Math.floor((now - date) / 1000);

    if (secondsPast < 60) {
      return `${secondsPast} seconds ago`;
    } else if (secondsPast < 3600) {
      const minutesPast = Math.floor(secondsPast / 60);
      return `${minutesPast} minutes ago`;
    } else if (secondsPast < 86400) {
      const hoursPast = Math.floor(secondsPast / 3600);
      return `${hoursPast} hours ago`;
    } else if (secondsPast < 604800) {
      // 7 hari
      const daysPast = Math.floor(secondsPast / 86400);
      return `${daysPast} days ago`;
    } else {
      return formatDate(dayjs(date), "DD MMMM YYYY");
    }
  } catch (e) {
    return null;
  }
};
const ceil_comma = (number: number) => {
  if (!number) return 0;
  return Math.ceil(number * 100) / 100;
};
