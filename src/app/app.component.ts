import { Component } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ChildrenOutletContexts } from '@angular/router';
import { slideInAnimation } from './animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    slideInAnimation
  ]
})

export class AppComponent {
  title = 'Tour of Heroes';
  links = ['heroes', 'dashboard'];
  activeLink = this.links[0];
  
  background: ThemePalette = 'primary';

  constructor(private contexts: ChildrenOutletContexts){
  }

  toggleBackground() {
    this.background = this.background ? undefined : 'primary';
  }

  addLink() {
    this.links.push(`Link ${this.links.length + 1}`);
  }

  slideBetweenComponents(){
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }
}