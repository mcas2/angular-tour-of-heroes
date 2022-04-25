import { Component, OnInit, Input, ChangeDetectionStrategy, OnDestroy, Inject } from '@angular/core';
import { Hero } from '../hero';
import { Powers } from '../hero';
import { Location } from '@angular/common';
import { HeroService } from '../hero.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HeroesComponent } from '../heroes/heroes.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.Default,
  animations:[
    trigger('nameChanged', [
      state('none', style({
        color: ""
      })),
      state('changes', style({
        background: "#B00020",
        color: "white"
      })),
      transition('none <=> changes' , [
        animate('0.5s')
      ]),
    ])
  ]
})

export class HeroDetailComponent implements OnInit, OnDestroy {
  hero: Hero | undefined;
  detailSubscription: Subscription | undefined;
  fb: FormBuilder = new FormBuilder;
  form!: FormGroup;
  activatedPowers: string[] | undefined = [];

  heroNameForm = new FormControl('');

  //animation
  notWritten: boolean = true;

  constructor(
    private heroService: HeroService,
    private location: Location,
    public detailDialog: MatDialogRef<HeroesComponent>
   ) {
  }


  ngOnInit(): void {
    console.log(this.heroNameForm.value);

    this.detailSubscription = this.heroService.specificHeroObservable.subscribe(
      h => {
        this.hero = h;
        this.activatedPowers = this.hero?.powers;
        this.form = this.initForm();
      }
    );
  }

  nameChanges() {
    if (this.heroNameForm.value == ''){
      this.notWritten = true;
    } else {
      this.notWritten = false;
    }
  }

  initForm(): FormGroup {
    return this.fb.group({
      force: this.activatedPowers?.includes('force'),
      elasticity: this.activatedPowers?.includes('elasticity'),
      invisibility: this.activatedPowers?.includes('invisibility')
    })
  }

  ngOnDestroy() {
    this.detailSubscription?.unsubscribe();
  }

  goBack(): void {
    this.detailDialog.close();
  }

  save(): void {
    if (this.hero) {
      this.hero.name = this.heroNameForm.value;
    
      let heroe = this.form.value;
      this.activatedPowers = [];

      for (const [power, activated] of Object.entries(heroe)) {
        if (activated == true) {
          this.activatedPowers?.push(power);
        }
      }

      this.hero.powers = this.activatedPowers;

      this.heroService.updateHero(this.hero);
      this.detailDialog.close();
    }
  }
}