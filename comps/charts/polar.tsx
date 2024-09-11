import { useLocal } from "lib/utils/use-local";
import { FC, useEffect } from "react";
import { loadChart } from "./loader";
import type { PolarArea } from "react-chartjs-2";

type ItemData = {
  label: string;
  data: number[];
  backgroundColor: string[];
  borderColor: string[];
  borderWidth: number;
}; // { }
type ItemLabel = string;
type TitleType = string;

const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const PolarAreaChart: FC<{
  data: () => ItemData[];
  labels: ItemLabel[];
  title: TitleType;
}> = ({ data, labels, title }) => {
  const local = useLocal({
    data: [] as ItemData[],
    labels: [] as ItemLabel[],
    title: '' as TitleType,
    PolarArea: null as null | typeof PolarArea,
  });

  useEffect(() => {
    local.data = data();
    local.labels = labels;
    local.title = title;
    local.render();
  }, [data]);

  // lazy load: Line Chart
  if (!local.PolarArea) {
    loadChart().then((chart) => {
      local.PolarArea = chart.PolarArea;
      local.render();
    });
    return <>Loading...</>;
  }

//   const labels = ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"];

  return (
    <>
      <local.PolarArea
        datasetIdKey="id"
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "top" as const,
            },
            title: {
              display: true,
              text: local.title,
            },
          },
        }}
        data={{
          labels: local.labels,
          datasets: local.data.map((e) => {
            return {
                label: e.label,
                data: e.data,
                backgroundColor: e.backgroundColor,
                borderColor: e.borderColor,
                borderWidth: e.borderWidth
            }
          }),
        }}
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