import { Component, OnInit, DoCheck } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../modelos-servicios/auth.service';
import { ProductoService } from '../../modelos-servicios/producto.service';
import swal from 'sweetalert'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [AuthService, ProductoService]
})
export class HeaderComponent implements OnInit, DoCheck {
  public busqueda: String;
  public userLogged: boolean;
  public identificacion: String;
  public nombreUsuario: String;

  constructor(private ruta: Router, private auth: AuthService, private cBend: ProductoService) { }

  ngOnInit(): void {
    if (this.auth.identificaUsuario()) {
      this.identificacion = this.auth.identificaUsuario().split('"')[3];
      this.cBend.identificaUsuario(this.identificacion).subscribe(
        res => {
          this.nombreUsuario = res.findUser.nickName
          if (!this.nombreUsuario) {
            this.nombreUsuario = res.findUser.nombres
          }
        },
        error => {
          console.log(error)
        }
      )
    }
  }

  ngDoCheck() {
    this.userLogged = this.auth.usuarioLogueado();

  }

  aviso() {
    swal('Aviso', {
      icon: 'info',
      text: 'Muy pronto se implementara esta funcionalidad'
    })
    this.ruta.navigate(['/listado'])
  }

  buscar() {
    this.ruta.navigate(['busqueda/' + this.busqueda])
  }
}
