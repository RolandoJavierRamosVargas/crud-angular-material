import { Component, OnInit ,Inject} from '@angular/core';
import { Cliente } from '../models/cliente';
import { DepartmentsService } from '../services/departments.service';
import { ClienteService } from '../services/cliente.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {

  cliente:Cliente;
  departments=[];

  constructor(private departmentsService:DepartmentsService,
              private clienteService:ClienteService,
              private _snackBar: MatSnackBar,
              public dialogRef: MatDialogRef<ClienteComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Cliente) {
                
                if(data!=null){
                  let dateOriginal=this.convertToDate(data);
                  this.cliente=data;
                  this.cliente.date=dateOriginal;
                }else{
                  this.cliente=new Cliente();
                }
              }
             

  ngOnInit(): void {
    this.departmentsService.getDepartments().subscribe(department=>{  
      this.departments.push(department);
    })

  }
  convertToDate(data:any){
    const {seconds} = data.date as any;
    var todate=new Date(seconds*1000);
    return todate;
  }

  enviar(form:any){
    if(this.data!=null){
      this.editarCliente(this.cliente);
    }else{
      this.crearcliente(this.cliente);
    }
  }
  crearcliente(cliente:Cliente){
    console.log("cliente",cliente);
    console.log("la fecha en string",cliente.date.toDateString());
    this.clienteService.createCliente(this.cliente)
    .then(res=>{
      this.openSnackBar('Se ha registado con exito','Thanks');
      this.dialogRef.close();
    })
    .catch(error=>{
      this.openSnackBar('Hubo un error al crear','Sorry');
    });
  }

  editarCliente(cliente:Cliente){
    this.clienteService.updateCliente(cliente)
    .then(result=> {
      this.openSnackBar('Se ha editado con exito','Thanks')
      this.dialogRef.close();
    })
    .catch(error=> this.openSnackBar('Error al editar','Sorry'));
  }

  limpiar(){
    this.openSnackBar('Se ha limpiado','Clear');
    this.cliente=new Cliente();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      horizontalPosition: "right",
      verticalPosition:"top",
      duration: 2000,
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }




}
