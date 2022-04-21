import { Component, OnInit, Input, ChangeDetectionStrategy, OnDestroy, Inject } from '@angular/core';
import { Hero } from '../hero';
import { Location } from '@angular/common';
import { HeroService } from '../hero.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HeroesComponent } from '../heroes/heroes.component';
import {MatCheckboxModule} from '@angular/material/checkbox'; 
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})

export class HeroDetailComponent implements OnInit, OnDestroy {
  hero: Hero | undefined;
  detailSubscription: Subscription | undefined;

  heroNameForm = new FormControl('');

  constructor(
    private heroService: HeroService,
    private location: Location,
    public detailDialog: MatDialogRef<HeroesComponent>
    ) { }

  ngOnInit(): void {
    this.detailSubscription = this.heroService.specificHeroObservable.subscribe(
         h => {
          this.hero = h;
        }
    );
  }

  ngOnDestroy(){
    this.detailSubscription?.unsubscribe();
  }

  goBack(): void {
    this.detailDialog.close();
  }

  save(): void {
    if (this.hero) {
      this.hero.name = this.heroNameForm.value;
      this.heroService.updateHero(this.hero);
      this.detailDialog.close();
    }
  }
}
