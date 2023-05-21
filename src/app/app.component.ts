import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Chart, ChartDataSets, ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  data:number[] = [292.67, 292.82, 292.54, 292.54, 292.95, 292.41, 292.68, 292.27, 292.41, 292.21, 292.37, 292.50]
  datas:number[]  = [21.43, 21.43, 26.78, 16.07, 16.07, 10.71, 10.71, 21.43, 5.36, 10.71, 5.36, 10]
  labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dic']

  data2 = [...this.data].sort()

  // Contiene todos los meses.
  months = []
  // Contiene todos los números.
  numbers = []

  @ViewChild('grafica', { static: true }) graficaREF: ElementRef;

  ngOnInit() {
   
    // CHARTDATASET CONFIGURATION
    const datasets: ChartDataSets[] = [
      {
        label: 'Fan page',
        fill: false,
        data: this.data,
        backgroundColor: '#4C4CD8',
        borderColor: '#4C4CD8',
        borderWidth : 1,
        yAxisID : 'Fan page',
        pointHoverRadius : 7,
        pointHoverBackgroundColor : '#4C4CD8',
        pointHoverBorderColor : '#4c4cd8a1',
        pointHoverBorderWidth : 10,
      },
      {
        label: 'Engaged users',
        fill: false,
        data: this.datas,
        backgroundColor: '#F8CB1C',
        borderColor: '#F8CB1C',
        borderWidth: 1,
        yAxisID: 'Engaged users',
        pointHoverRadius: 7,
        pointHoverBackgroundColor: 'F8CB1C#',
        pointHoverBorderColor: '#f8cb1c85',
        pointHoverBorderWidth: 10
      }
    ];

    // CHARTDATA
    const data: ChartData = {
      labels: this.labels,
      datasets,
    };

    // CHARTOPTIONS
    const options: ChartOptions = {
      responsive: false,
      legend: {
        display: false
      },
      hover: {
        mode: 'x'
      },
      scales: {
        xAxes: [
          {
            ticks: {
              fontColor: 'rgba(0,0,0,0)',
              
              callback: (value) => {
                const index = data.labels.indexOf(value);

                if (index !== -1) {                    
                  // Le pasa los valores al array months.
                  this.months[index] = {value:value, color: "rgb(255,255,255)"}
                  return value;
                }    
              },
              fontSize: 11,
              fontFamily: 'Work Sans',
              padding: 6,
              
            },
            gridLines: {
              display: false,
            },
          },
        ],
        yAxes: [{
          id: 'Fan page',
          position: 'left',
          ticks: {
            fontColor: "rgba(0,0,0,0)",
            padding: 15,
            maxTicksLimit: 7,
            min: 291.8,
            max: 293,
            fontSize: 10,
            fontFamily: 'Work Sans',
            callback: (value: string,index) => {
              const newValue = parseFloat(value).toFixed(2);

              // Le pasa los valores al array numbers.

              this.numbers[index] = {value: newValue, color: "rgb(255,255,255)"};
              return newValue + ' K';
            }
          },
          gridLines: {
            borderDash: [1, 2],
            color: '#282828',
            drawBorder: false,
            tickMarkLength: 0,
          }
        },
        {
          id: 'Engaged users',
          position: 'right',
          ticks: {
            fontColor: '#B8B7B7',
            fontSize: 10,
            padding: 15,
            maxTicksLimit: 7,
            min: 0,
            fontFamily: 'Work Sans',
            callback: (value: string) => {
              return value;
            },
          },
          gridLines: {
            drawBorder: false,
            tickMarkLength: 0,
            color: 'transparent'
          }
        }]
      },
      tooltips: {
        enabled: false,
        mode: 'x',
        intersect: false
      }
      ,

      // Detecta cuando se hace hover sobre los puntos.

      onHover: (event, elements)=> {
        
        if (elements && elements.length > 0) {

          const index = elements[0]._index;

          // Obtiene las coordenadas de los puntos.

          const x1 = elements[0]._model.x;
          const x2 = elements[1]._model.x;

          const y1 = elements[0]._model.y;
          const y2 = elements[1]._model.y;
      
          // Establece un límite de colisión.

          const labelSize = 10;

          // Obtiene la distancia entre el punto azul y el amarillo.

          const math = Math.abs(x2 - x1)
          const math2 = Math.abs(y2 - y1)
      
          // Si las posiciones x de las etiquetas están muy cerca, se considera una colisión.

          if (math < labelSize && math2 < labelSize) {

            // Cambia el color del punto azul.

            chart.data.datasets[0].pointHoverBackgroundColor = 'rgba(0,0,0,0)';
            chart.data.datasets[0].pointHoverBorderColor = 'rgba(0,0,0,0)';
            
            // Actualiza el gráfico.

            chart.update();

            // Obtiene el número más aproximado al valor del punto.

            const target = elements[1]._chart.chart.config.data.datasets[0].data[index];

            const closestNumber = this.numbers.reduce((closest, num) =>
            Math.abs(num.value - target) < Math.abs(closest.value - target) ? num : closest
            );

            const list = this.numbers.indexOf(closestNumber)

            // Cambia de color los numeros.

            this.months[index].color = "#F8CB1C"
            this.numbers[list].color = "#F8CB1C"  
            
          }
          }else {

          // Si se deja de hacer hover, restablece los estilos.

          chart.data.datasets[0].pointHoverBackgroundColor = '#4C4CD8';
          chart.data.datasets[0].pointHoverBorderColor = '#4c4cd8a1';

          chart.update();  
          
          this.months.map((stat,index)=>{
            this.months[index].color = "rgb(255,255,255)"
          })
          this.numbers.map((stat,index)=>{
            this.numbers[index].color = "rgb(255,255,255)"
          })
        }}
    }

    // INIT GRAPH
    let chart = new Chart('grafica', {
      type: 'line',
      data,
      options
    });

  }}