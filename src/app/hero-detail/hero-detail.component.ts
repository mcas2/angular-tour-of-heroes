import { Component, OnInit, Input } from '@angular/core';
import { Hero } from '../hero';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { HeroService } from '../hero.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css'],
})

export class HeroDetailComponent implements OnInit {
  @Input() hero!: Hero;

  private specificHero: BehaviorSubject<Hero> = new BehaviorSubject<Hero>(this.getHero());

  private specificHeroObservable: Observable<Hero> = this.specificHero.asObservable();

  constructor(
    private heroService: HeroService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.specificHeroObservable.subscribe(
      h => this.hero = h
    );
  }

  getHero(): Hero {
    return this.heroService.getHero(this.specificHero.getValue().id);
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    if (this.hero) {
      this.heroService.updateHero(this.hero);
      this.goBack();
    }
  }
}
