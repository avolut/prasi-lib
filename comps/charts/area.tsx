import { useLocal } from "lib/utils/use-local";
import { FC, useEffect } from "react";
import { loadChart } from "./loader";
import type { Line } from "react-chartjs-2";
import type { ChartData } from "chart.js";

type ItemData = ChartData<"line", number[], unknown>;

const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const AreaChart: FC<{
  data: () => ItemData;
  legend?: any;
}> = ({ data, legend }) => {
  const local = useLocal({
    data: null as unknown as ItemData,
    Line: null as null | typeof Line,
  });

  useEffect(() => {
    local.data = data();
    local.render();
  }, [data]);

  // lazy load: Line Chart
  if (!local.Line) {
    loadChart().then((chart) => {
      local.Line = chart.Line;
      local.render();
    });
    return <>Loading...</>;
  }

  return (
    <>
      <local.Line
        datasetIdKey="id"
        options={{
          responsive: true,
          plugins:
            legend === "none"
              ? {
                  legend: {
                    display: false,
                  },
                }
              : {
                  legend: {
                    position: legend as any,
                  },
                },
        }}
        data={local.data}
      />
    </>
  );
};
