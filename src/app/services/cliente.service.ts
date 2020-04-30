import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { Cliente } from '../models/cliente';
import { map, mergeAll } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  
  constructor(private firestore: AngularFirestore) { }

  getClientes():Observable<Cliente[]>{
    return  this.firestore.collection('clientes').snapshotChanges().pipe(
      map(clientes=> {
         let list=[];
         list=clientes.map(cliente=>{
           let id=cliente.payload.doc.id;
           let data=cliente.payload.doc.data() as Cliente;
           const {city,date,department,email,mobile,nombre,permanent,sexo} = data;
           return {id,city,date,department,email,mobile,nombre,permanent,sexo}
         })
         return list as Cliente[];
      }) 
      );
  }
  createCliente(cliente:Object):Promise<any>{
     return this.firestore.collection('clientes').add({...cliente});
  }

  updateCliente(cliente:Cliente):Promise<any>{
    let id=cliente.id;
    delete cliente.id;
    
    return this.firestore.collection('clientes').doc(id).set({...cliente});
  }

  deleteCliente(id:string):Promise<any>{
    return this.firestore.collection('clientes').doc(id).delete();
  }
}
