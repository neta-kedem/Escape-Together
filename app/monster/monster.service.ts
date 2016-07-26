import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import {MonsterModel} from './monster.model'; 

@Injectable()
export class MonsterService {

  private baseUrl = 'http://localhost:3003/data/monster/';
  constructor(private http: Http) {}

  // query (GETs a list)
  query(): Promise<MonsterModel[]> {

    let prmMonsters = this.http.get(this.baseUrl)
      .toPromise()
      .then(res => {
        const jsonMonsters = res.json();
        return jsonMonsters.map((jsonMonster : any) =>
          new MonsterModel(jsonMonster.name, jsonMonster.power, jsonMonster._id))
      });

    prmMonsters.catch(err => {
      console.log('MonsterService::query - Problem talking to server');
    });

    return prmMonsters;
  }

  // get (GETs a single)
  get(id: string) : Promise<MonsterModel> {
    let prmMonster = this.http.get(this.baseUrl + id)
      .toPromise()
      .then(res => {
        const jsonMonster = res.json();
        return new MonsterModel(jsonMonster.name, jsonMonster.power, jsonMonster._id);
      });

    prmMonster.catch(err => {
      console.log('MonsterService::get - Problem talking to server');
    });
    return prmMonster;

  }

  // DELETE 
  remove(id: string) : Promise<MonsterModel[]> {
    let prmMonster = this.http.delete(this.baseUrl + id)
      .toPromise()
      .then(res => {
        return this.query();
      });

    prmMonster.catch(err => {
      console.log('MonsterService::remove - Problem talking to server', err);
    });
    return prmMonster;
  }

  // save - Adds (POST) or update (PUT)  
  save(monsterData: any, id?: string) : Promise<MonsterModel>{

    let response : any;
    let prmMonster : Promise<MonsterModel>;

    if (id) {
      const url = this.baseUrl + id;
      response = this.http.put(url, monsterData)
    } else {
	    const url = this.baseUrl;
       response = this.http.post(url, monsterData)
    }

    prmMonster = response.toPromise()
      .then((res : any) => {
          const jsonMonster = res.json();
          return new MonsterModel(jsonMonster.name, jsonMonster.power, jsonMonster.id);
      });

    prmMonster.catch(err => {
      console.log('MonsterService::save - Problem talking to server', err);
    });
    return prmMonster;
  }
}
