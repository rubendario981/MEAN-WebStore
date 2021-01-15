import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductoService } from '../../modelos-servicios/producto.service'
import swal from 'sweetalert'
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.component.html',
  styleUrls: ['./inicio-sesion.component.css'],
  providers: [ProductoService]
})
export class InicioSesionComponent implements OnInit {
  usuario: any
  login: FormGroup;

  constructor(private _router: Router, private consultaBackend: ProductoService) {
    this.usuario = {
      correo: '',
      password: ''
    }
  }

  ngOnInit() {
    this.login = new FormGroup({
      correo: new FormControl(null, [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]),
      password: new FormControl(null, [Validators.required])
    })
  }

  ingresar(){ 
    this.usuario = this.login.value
    this.consultaBackend.inicioSesion(this.usuario).subscribe(res=>{
      if(res.mensaje == 'ok') {
        swal("Bienvenido", {
          text: `Bienvenido ${this.usuario.correo}`,
          icon: "info",
          timer: 2000          
          });
          localStorage.setItem('token', res.token)
          this._router.navigate(['listado'])
      }
    },
      error=>{
        swal("Error al ingresar", 'Credenciales invalidas, intenta de nuevo ' + error.statusText, "warning");
        this.login.reset()
      }
    )
  }

  cancela(){
    this._router.navigate(['/listado'])
  }

}
