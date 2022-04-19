import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { HeroesComponent } from './heroes/heroes.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap, filter } from 'rxjs/operators';
import { MessageService } from './message.service';
import { ResourcesService } from "./resources.service";
import { splitAtColon } from '@angular/compiler/src/util';


@Injectable({
	providedIn: 'root'
})

export class HeroService {

	private heroesUrl = 'api/heroes'; //Url to web api

	private heroes = [];

	private heroSubject: BehaviorSubject<Hero[]> = new BehaviorSubject<Hero[]>(this.heroes);

	public heroObservable: Observable<Hero[]> = this.heroSubject.asObservable();
	//Inicializado -> existe, pero para ver sus datos necesitamos una/*  */ suscripción

	private cont = 0;

	httpOptions = {
		headers: new HttpHeaders({ 'Content type' : 'application/json' })
	};

	constructor(
		private http: HttpClient,
		private messageService: MessageService,
		private resourcesService: ResourcesService,
		) { 
			this.refreshList();

		}

	refreshList() {
		this.resourcesService.getList().subscribe(
			{
				next: heroArray => this.heroSubject.next(heroArray)
			}
		)
	}

	updateList(heroes: Hero[]){
		this.resourcesService.getList().subscribe(
			{
				next: heroArray => this.heroSubject.next(heroes)
			}
		)
	}

	getHeroes(): Hero[]{
		return this.heroSubject.getValue();
	}

	updateHero(hero: Hero) {
		const heroes = this.getHeroes();
		heroes.forEach(element => {
			if (element.id == hero.id){
				element.name = hero.name;
			}
		});
		this.updateList(heroes);
	}

	getHero(id: number): Hero {
		const heroes = this.getHeroes();
		let hero: Hero = {
			id: 0,
			name: ''
		};
		heroes.forEach(element => {
			if (element.id == id){
				hero = element;
			}
		});
		return hero;
	}

	addHero(heroName : string) {
		const heroes = this.getHeroes();
		const hero = {
			id: this.cont+21,
			name: heroName
		};
		heroes.push(hero);
		this.cont += 1;
		this.updateList(heroes);
	}

	deleteHero(id: number){
		const oldHeroes = this.getHeroes();
		const heroes = oldHeroes.filter(h => h.id !== id);
		this.updateList(heroes);
	}

	searchHeroes(term: string): Observable<Hero[]>{
		if (!term.trim()){
			return of([]); // Lo que quiere decir que si no existe el término, devuelve un array vacío
		}
		return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
			tap(x => x.length ?	
				this.log(`found heroes matching "${term}`) :
				this.log(`no heroes matching ${term}`)),
			catchError(this.handleError<Hero[]>('searchHeroes', []))
		);
	}

	private handleError<T>(operation = 'operation', result? :T){
		return (error:any) : Observable<T> => {
			   // TODO: send the error to remote logging infrastructure
			   console.error(error); // log to console instead

			   // TODO: better job of transforming error for user consumption
			   this.log(`${operation} failed: ${error.message}`);
		   
			   // Let the app keep running by returning an empty result.
			   return of(result as T);
		}
	}

	private log (mesagge: string){
		this.messageService.add(`HeroService: ${mesagge}`)
	}
}