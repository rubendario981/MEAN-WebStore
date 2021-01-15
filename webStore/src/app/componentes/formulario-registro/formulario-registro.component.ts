import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router'
import { modeloUsuario } from 'src/app/modelos-servicios/modeloUsuario';
import { ProductoService } from 'src/app/modelos-servicios/producto.service';
import { variable } from '../../modelos-servicios/constantes'
import swal from 'sweetalert'
import { timer } from 'rxjs';

@Component({
  selector: 'app-formulario-registro',
  templateUrl: './formulario-registro.component.html',
  styleUrls: ['./formulario-registro.component.css'],
  providers: [ProductoService]
})
export class FormularioRegistroComponent implements OnInit {
  url = variable.url;
  formRegistro: FormGroup;
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

  constructor (private _router: Router,  private consultaBackend: ProductoService) {}

  ngOnInit(): void {
    this.formRegistro = new FormGroup({
      nombres: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(32)]),
      correo: new FormControl(null, [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]),
      nickName: new FormControl(null, Validators.minLength(6)),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      password2: new FormControl(null, [Validators.required])     
    })
  }

  validaPass(passwd, passwd2): boolean{
    return passwd === passwd2 ? true: false
  }

  registrarUsuario() {
    this.usuario = this.formRegistro.value
    delete (this.usuario.password2)
    this.consultaBackend.registrarUsuario(this.usuario).subscribe(res => {
      swal("Usuario creado", {
        icon: "info",
        text: 'Se ha creado el usuario correctamente',
        timer: 3000
      });
      this.formRegistro.reset()
      this._router.navigate(['inicioSesion'])
    }, err => {
      if (err.error.mensaje) {
        swal("Error al crear usuario", {
          icon: "warning",
          text: `${err.error.mensaje}`
        })
      }
      else {
        swal("Error al crear usuario", {
          icon: "error",
          text: `Error interno ${err.message}`
        })
      }
    })
  }
    
  soloLetras(e){
    return (e.charCode >= 65 && e.charCode <= 90) || (e.charCode >= 97 && e.charCode <= 122)
  }
}
