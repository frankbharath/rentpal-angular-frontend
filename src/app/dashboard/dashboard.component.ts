import { AfterContentInit, AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, ContentChildren, DoCheck, ElementRef, EventEmitter, OnChanges, Output, QueryList, SimpleChanges, ViewChild } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChartComponent } from 'ng-apexcharts';
import { TenantService, UpcomingPayment } from '../core/tenant.service';
import { ChartOptions, PieChartOptions } from '../share/models/chart-options.model';
import { Utils } from '../share/utils';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
  @ViewChild("chart") chart!: ChartComponent;
  chartLoading = true;

  private _chartOptions!:ChartOptions;
  private _pieChartOptions!:PieChartOptions;
  private _upcomingPayments!:Array<UpcomingPayment>;
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'nextPayment'];

  constructor(private readonly _route: ActivatedRoute){}

  ngOnInit(): void {
    this._chartOptions=Utils.lineChartConfig();
    this._pieChartOptions=Utils.linePieChartOptions();
    this._route.data
    .subscribe(value=>{
      let data=value.tenantSummary;
      this._chartOptions.series[0].data=data.monthSummary?.map((value: { rent: any; })=>value.rent || 0) || [];
      this._chartOptions.xaxis.categories=data.monthSummary?.map((value: { month: any; })=>value.month);
      this._pieChartOptions.series=data.propertySummary?.map((value: { totalRent: any; })=>value.totalRent || 0) || [];
      this._pieChartOptions.labels=data.propertySummary?.map((value: { propertyName: any; })=>value.propertyName);
      this._upcomingPayments=data.upcomingPayments || [];
      this.chartLoading=false;
    });
  }

  get chartOptions(){
    return this._chartOptions;
  }

  get pieChartOptions(){
    return this._pieChartOptions;
  }

  get upcomingPayments(){
    return this._upcomingPayments;
  }
}
