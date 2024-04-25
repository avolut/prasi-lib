import { useLocal } from "@/utils/use-local";
import { FC, useEffect } from "react";
import { loadChart } from "./loader";
import type { Pie } from "react-chartjs-2";
import type { ChartData } from "chart.js";

type ItemData = ChartData<"pie", number[], unknown>;

const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const PieChart: FC<{
  data: () => ItemData;
  legend?: any;
}> = ({ data, legend }) => {
  const local = useLocal({
    data: null as unknown as ItemData,
    Pie: null as null | typeof Pie,
  });

  useEffect(() => {
    local.data = data();
    local.render();
  }, [data]);

  // lazy load: Line Chart
  if (!local.Pie) {
    loadChart().then((chart) => {
      local.Pie = chart.Pie;
      local.render();
    });
    return <>Loading...</>;
  }

  return (
    <>
      <local.Pie
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

// [
//     {
//       label: "# of Votes",
//       data: [12, 19, 3, 5, 2, 3],
//       backgroundColor: [
//         "rgba(255, 99, 132, 0.2)",
//         "rgba(54, 162, 235, 0.2)",
//         "rgba(255, 206, 86, 0.2)",
//         "rgba(75, 192, 192, 0.2)",
//         "rgba(153, 102, 255, 0.2)",
//         "rgba(255, 159, 64, 0.2)",
//       ],
//       borderColor: [
//         "rgba(255, 99, 132, 1)",
//         "rgba(54, 162, 235, 1)",
//         "rgba(255, 206, 86, 1)",
//         "rgba(75, 192, 192, 1)",
//         "rgba(153, 102, 255, 1)",
//         "rgba(255, 159, 64, 1)",
//       ],
//       borderWidth: 1,
//     },
//   ]
