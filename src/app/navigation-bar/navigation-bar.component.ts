import { Component, OnInit } from '@angular/core';
import { StateManagerService } from '../service/state-manager.service';

@Component({
  selector: 'fs-navigation-bar',
  templateUrl: './navigation-bar.component.pug',
  styleUrls: ['./navigation-bar.component.styl']
})
export class NavigationBarComponent implements OnInit {

  constructor(private stateManager:StateManagerService) { }

  ngOnInit() {
    
  }

  resetButtonClicked(){
    this.stateManager.resetState();
  }

}
