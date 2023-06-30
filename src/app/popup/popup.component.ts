import { Component } from '@angular/core';
import { MokGuard } from '../mok-guard';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css'],
})
export class PopupComponent extends MokGuard {
}
