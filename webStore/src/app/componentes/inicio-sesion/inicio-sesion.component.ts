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
    this.consultaBackend.inicioSesion(this.usuario).subscribe(
      res=>{
        swal("Bienvenido", {
          icon: "info",              
          text: `Bienvenido ${this.usuario.correo}`
        });
        localStorage.setItem('token', res.token)
        this._router.navigate(['/'])
      },
      error=>{
        swal("Error al ingresar", {
          icon: "warning",              
          text: 'No se ha podido identificar al usuario, por favor intenta de nuevo ' + error
        });
      }
    )
  }

  aviso(){
    swal("Aviso", {
      icon: "info",              
      text: `Muy pronto tendremos la funcionalidad en esta pagina `
    });
    this._router.navigate(['/listado'])
  }

  cancela(){
    this._router.navigate(['/listadoProductos'])
  }

}
