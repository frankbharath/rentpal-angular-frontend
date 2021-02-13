import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexDataLabels, ApexGrid, ApexStroke, ApexTitleSubtitle, ApexNonAxisChartSeries, ApexResponsive, ApexPlotOptions, ApexLegend, ApexNoData } from "ng-apexcharts";

export interface ChartOptions {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    dataLabels: ApexDataLabels;
    grid: ApexGrid;
    stroke: ApexStroke;
    title: ApexTitleSubtitle;
    noData:ApexNoData;
}

export interface PieChartOptions {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    responsive: ApexResponsive[];
    labels: any;
    title: ApexTitleSubtitle;
    plotOptions: ApexPlotOptions;
    apexLegend:ApexLegend;
    noData:ApexNoData;
  };
