import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ProductoService } from '../../modelos-servicios/producto.service'
import swal from 'sweetalert'

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.component.html',
  styleUrls: ['./inicio-sesion.component.css'],
  providers: [ProductoService]
})
export class InicioSesionComponent implements OnInit {
  public usuario : any

  constructor(private _router: Router, private consultaBackend: ProductoService) {
    this.usuario = {
      correo: '',
      password: ''
    }
  }

  ngOnInit() {
  }

  ingresar(){ 
    this.consultaBackend.inicioSesion(this.usuario).subscribe(res=>{
      if(res.mensaje == 'ok') {
        swal("Bienvenido", {
          text: `Bienvenido ${this.usuario.correo}`,
          icon: "info",              
          });
          localStorage.setItem('token', res.token)
          this._router.navigate(['/perfil'])
      }
    },
      error=>{
        swal("Error al ingresar", 'Credenciales invalidad, intenta de nuevo ' + error.statusText, "warning");
        this.usuario = {correo: '', password: ''}
      }
    )
  }

  cancela(){
    this._router.navigate(['/listado'])
  }

}
