import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import {map, tap, mergeAll} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DepartmentsService {

  constructor(private firestore: AngularFirestore) { }

  getDepartments():Observable<any>{
    return this.firestore.collection('departments').snapshotChanges().pipe(
      map(departments=> from(departments).pipe(
          map((department:any)=> department.payload.doc.data())
          
      )),
      mergeAll()
      )
  }    
}
