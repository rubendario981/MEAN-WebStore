import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router'
import { modeloUsuario } from 'src/app/modelos-servicios/modeloUsuario';
import { ProductoService } from 'src/app/modelos-servicios/producto.service';
import { variable } from '../../modelos-servicios/constantes'
import swal from 'sweetalert'

@Component({
  selector: 'app-formulario-registro',
  templateUrl: './formulario-registro.component.html',
  styleUrls: ['./formulario-registro.component.css'],
  providers: [ProductoService]
})
export class FormularioRegistroComponent implements OnInit {
  url: String;
  coincidePass: boolean;
  usuario: modeloUsuario = {
    _id: '',
    listaCompras: [],
    listaFavoritos: [],
    nombres: '',
    correo: '',
    password: '',
    password2: '',
    nickName: '',
    rol: ''
  };

  constructor (private _router: Router,  private consultaBackend: ProductoService) {
    this.url = variable.url;
  }

  ngOnInit(): void {
  } 

  conincidePass(): boolean{
    if(this.usuario.password != this.usuario.password2) return this.coincidePass = true
  }

  registrarUsuario() {
    delete(this.usuario.password2)
    this.consultaBackend.registrarUsuario(this.usuario).subscribe(
      res => {
        swal("Usuario creado", {
          icon: "info",              
          text: 'Se ha creado el usuario correctamente'
        });
        res.userCreated = this.usuario;
        this._router.navigate(['/'])
      },
      err => {
        swal("Error al crear usuario", {
          icon: "warning",
          text: `Ya esta registrado el correo ${this.usuario.correo} o el nickName ${this.usuario.nickName}`
        })
      }
    )
  }
  
  cancela() {
    this._router.navigate(['/'])
  }

}
