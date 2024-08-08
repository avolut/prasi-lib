import { useLocal } from "@/utils/use-local";
import { FC, useEffect } from "react";
import { loadChart } from "./loader";
import type { Bar } from "react-chartjs-2";
import type { ChartData } from "chart.js";

type ItemData = ChartData<"bar", number[], unknown>;

const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const BarChart: FC<{
  data: () => ItemData;
  legend?: any
}> = ({ data, legend }) => {
  const local = useLocal({
    data: null as unknown as ItemData,
    Bar: null as null | typeof Bar,
  });

  useEffect(() => {
    local.data = data();
    local.render();
  }, [data]);

  // lazy load: Line Chart
  if (!local.Bar) {
    loadChart().then((chart) => {
      local.Bar = chart.Bar;
      local.render();
    });
    return <>Loading...</>;
  }

  return (
    <>
      <local.Bar
        datasetIdKey="id"
        options={{
          responsive: true,
          maintainAspectRatio: false,
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
