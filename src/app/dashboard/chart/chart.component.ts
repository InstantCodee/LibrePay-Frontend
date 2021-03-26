import { Component} from '@angular/core'
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent {
  chartOption: EChartsOption = {
    color: ["#C61A4E"],
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },

  tooltip: {
    trigger: 'item',
    showDelay: 0,
    transitionDuration: 0.2
  },

  yAxis: {
      type: 'value'
  },
  series: [{
      data: [820, 932, 901, 934, 1290, 1330, 1320, 654, 68, 846, 987, 846, 874],
      type: 'line',
      smooth: true
  }]
  };

}
