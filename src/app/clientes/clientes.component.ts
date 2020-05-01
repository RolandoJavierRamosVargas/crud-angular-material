import { Component, OnInit, ViewChild } from '@angular/core';
import { ClienteService } from '../services/cliente.service';
import { Cliente } from '../models/cliente';

import {MatSort} from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSnackBar} from '@angular/material/snack-bar';

import {MatDialog} from '@angular/material/dialog';
import { ClienteComponent } from '../cliente/cliente.component';
import { AlertaComponent } from '../alerta/alerta.component';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  clientes:Cliente[]=[];

  displayedColumns: string[] = ['nombre','city','email','mobile','actions'];
  dataSource;

  constructor(private clienteService:ClienteService,public dialog: MatDialog,private _snackBar: MatSnackBar) { }

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  ngOnInit(): void {
    this.clienteService.getClientes().subscribe(clientes=>{
      
      this.clientes=clientes
      this.dataSource=new MatTableDataSource(clientes);
      this.dataSource.sort=this.sort;
      this.dataSource.paginator = this.paginator;  
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ClienteComponent, {
      width: '50%',
      height:'60%',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openDialogDelete(key:string): void {

    const dialogRef = this.dialog.open(AlertaComponent, {
      position : {top:'10%',left:'40%'},
      width: '20%',
      height:'30%',
    });

    dialogRef.afterClosed().subscribe(
      decision =>decision ? this.delete(key) : ''
    );
  }

  edit(cliente:Cliente){
    const dialogRef = this.dialog.open(ClienteComponent, {
      width: '50%',
      height:'60%',
      data: cliente
    });

  }
  delete(key:string){
    
    this.clienteService.deleteCliente(key).then(()=>{
      this.openSnackBar("Se ha eliminado con exito","DELETE")
    },
    error=>{
      this.openSnackBar("Ha ocurrido un error","ERROR")
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      horizontalPosition: "right",
      verticalPosition:"top",
      duration: 2000,
    });
  }


}
