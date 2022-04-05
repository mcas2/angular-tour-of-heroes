import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';
import { Hero } from './hero';
import { MessageService } from './message.service';



@Injectable({
  providedIn: 'root'
})
export class ResourcesService {
  
  private heroesUrl = 'api/heroes';

  constructor(
		private http: HttpClient,
		private messageService: MessageService) { }

    
  getList(): Observable<Hero[]> {
		return this.http.get<Hero[]>(this.heroesUrl) //Recibes la información y se completa
		.pipe(
				tap(_ => this.log('fetched heroes')),
				catchError(this.handleError<Hero[]>('getHeroes', []))
			)
	}

  private log (mesagge: string){
		this.messageService.add(`HeroService: ${mesagge}`)
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

}
