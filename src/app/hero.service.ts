import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { Observable, of, Subject } from 'rxjs';
import { HeroesComponent } from './heroes/heroes.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { MessageService } from './message.service';
import { ResourcesService } from "./resources.service";


@Injectable({
	providedIn: 'root'
})

export class HeroService {

	private heroesUrl = 'api/heroes'; //Url to web api

	private heroeSubject = new Subject();

	public heroeObservable = this.heroeSubject.asObservable();

	httpOptions = { //Esto no lo entiendo
		headers: new HttpHeaders({ 'Content type' : 'application/json' })
	};

	constructor(
		private http: HttpClient,
		private messageService: MessageService,
		private resourcesService: ResourcesService,
		) { }
	
	getList(){
		this.heroeSubject.next(this.resourcesService.getList().subscribe());
	}
	
	getHeroes(): Observable<Hero[]> {
		return this.heroeObservable;
	}

	getHero(id: number): Observable<Hero> {
		const url = `${this.heroesUrl}/${id}`;
		return this.http.get<Hero>(url).pipe(
			tap(_ => this.log(`fetched hero id=${id}`)),
			catchError(this.handleError<Hero>(`getHero id=${id}`))
		);
		//Coge un sólo héroe, no un array, y construye una url con la ip del héroe seleccionado
	  }

	
	updateHero(hero : Hero): Observable<any>{
		return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
			tap(_ => this.log(`updated hero id=${hero.id}`)),
			catchError(this.handleError<any>('updateHero'))
		);
	}

	addHero(hero: Hero): Observable<Hero> {
		return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
			tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
			catchError(this.handleError<Hero>('addHero'))
		);
	}

	deleteHero(id: number): Observable<Hero> {
		const url = `${this.heroesUrl}/${id}`;

		return this.http.delete<Hero>(url, this.httpOptions).pipe(
			tap(_ => this.log(`delete hero id=${id}`)),
			catchError(this.handleError<Hero>('deleteHero'))
		);
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