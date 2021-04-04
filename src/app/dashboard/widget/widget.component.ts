import { Component, Input, OnInit } from '@angular/core';
import {faQuestion, IconDefinition} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'dashboard-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.css']
})
export class WidgetComponent implements OnInit {

  @Input() title = '';
  @Input() content = '';
  @Input() subcontent = '';
  @Input() icon: IconDefinition = faQuestion;

  constructor() { }

  ngOnInit(): void {}


}
