import { Injectable } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ConfirmDialogModel, ConfirmDialogComponent } from "./confirm-dialog/confirm-dialog.component";
import { ChartOptions, PieChartOptions } from "./models/chart-options.model";

@Injectable({
    providedIn: 'root'
})
  
export class Utils{
    constructor(
        private _snackBar: MatSnackBar,
        private dialog: MatDialog
    ){}
    static removeSpaces(control: FormControl) {
        if (control && control.value && !control.value.replace(/\s/g, '').length) {
            control.setValue('');
          }
          //return '';
    }
    showMessage(message:string, isError:boolean=false){
        this._snackBar.open(message, '', {
            duration: 5000,
            panelClass: [isError?"red-snackbar":"green-snackbar"],
            verticalPosition: 'top'
        });
    }
    confirmDialog(title:string, message:string){
        const dialogData = new ConfirmDialogModel(title, message);
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            maxWidth: "400px",
            data: dialogData
        });
        return dialogRef;
    }
    static lineChartConfig():ChartOptions{
        return {
            series:[
              {
                name: "Rent",
                data: []
              }
            ],
            chart: {
              height: (220/568)*window.innerHeight,
              width: (300/320)*window.innerWidth,
              type: "line",
              zoom: {
                enabled: false
              }
            },
            dataLabels: {
              enabled: true,
              formatter(value){
                if(value){
                  return value+" €";
                }
                return value;
              }
            },
            stroke: {
              curve: "straight"
            },
            title: {
              //text: "Rent received in last 12 months",
              align: "center",
              style:{
                fontFamily:'Roboto, "Helvetica Neue", sans-serif'
              }
            },
            grid: {
              row: {
                colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
                opacity: 0.5
              }
            },
            xaxis: {
              categories: []
            },
            noData:{
              text:"No data",
              align:"center",
              verticalAlign: "middle"
            }
        }
    }
    static linePieChartOptions():PieChartOptions{
        return {
            series: [],
            chart: {
              height: (300/568)*window.innerHeight,
              width: (300/320)*window.innerWidth,
                type: "donut"
            },
            labels: [],
            responsive: [
                {
                breakpoint: (350/320)*window.innerWidth,
                options: {
                    chart: {
                      width: (300/320)*window.innerWidth
                    },
                    legend: {
                    position: "bottom"
                    }
                }
                }
            ],
            title: {
              //text: "Top revenue generated properties in last 12 months",
              align: "center",
              style:{
                fontFamily:'Roboto, "Helvetica Neue", sans-serif',
                fontSize:'13px'
              }
            },
            plotOptions:{
              pie: {
                donut: {
                  labels: {
                    show: true,
                    name:{
                      show:true
                    },
                    value:{
                      show:true,
                      formatter(value){
                        return value+" €";
                      }
                    },
                    total:{
                      show:true,
                      formatter(value){
                        return Array(...value["globals"].series).reduce((sum, val)=>sum+val)+" €";
                      }
                    }
                  }
                }
              }
            },
            apexLegend:{
              show:true
            },
            noData:{
              text:"No data",
              align:"center",
              verticalAlign: "middle"
            }
        }
    }
}
