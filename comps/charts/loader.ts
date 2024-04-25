import { lazy } from "react";
import type { Bar, Line, Pie, Doughnut, PolarArea } from "react-chartjs-2";

export type Loader = {
  Line: typeof Line;
  Bar: typeof Bar;
  Pie: typeof Pie;
  Doughnut: typeof Doughnut;
  PolarArea: typeof PolarArea;
};

export const w = window as unknown as {
  chartjs_loaded?: Partial<Loader> & { _import: any };
};

export const loadChart = async () => {
  if (!w.chartjs_loaded) {
    w.chartjs_loaded = { _import: null };
  }

  const load = async () => {
    if (w.chartjs_loaded) {
      if (!w.chartjs_loaded._import) {
        const {
          CategoryScale,
          Chart: ChartJS,
          Legend,
          LineElement,
          LinearScale,
          PointElement,
          Title,
          Tooltip,
          Filler,
          BarElement,
          ArcElement,
          RadialLinearScale,
        } = await import("chart.js");

        ChartJS.register(
          CategoryScale,
          LinearScale,
          PointElement,
          LineElement,
          Title,
          Tooltip,
          Legend,
          Filler,
          BarElement,
          ArcElement,
          RadialLinearScale
        );

        const { Line } = await import("react-chartjs-2");
        const { Bar } = await import("react-chartjs-2");
        const { Pie } = await import("react-chartjs-2");
        const { Doughnut } = await import("react-chartjs-2");
        const { PolarArea } = await import("react-chartjs-2");
        w.chartjs_loaded.Line = Line;
        w.chartjs_loaded.Bar = Bar;
        w.chartjs_loaded.Pie = Pie;
        w.chartjs_loaded.Doughnut = Doughnut;
        w.chartjs_loaded.PolarArea = PolarArea;
        w.chartjs_loaded._import = true;
      }
    }
    return w.chartjs_loaded as Loader;
  };
  const c = await load();

  return {
    Line: lazy(async () => {
      return { default: c.Line };
    }),
    Bar: lazy(async () => {
      return { default: c.Bar };
    }),
    Pie: lazy(async () => {
      return { default: c.Pie };
    }),
    Doughnut: lazy(async () => {
      return { default: c.Doughnut };
    }),
    PolarArea: lazy(async () => {
      return { default: c.PolarArea };
    }),
  } as Loader;
};
