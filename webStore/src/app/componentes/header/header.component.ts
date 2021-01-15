import { Component, OnInit, DoCheck } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../modelos-servicios/auth.service';
import { ProductoService } from '../../modelos-servicios/producto.service';
import { modeloUsuario } from '../../modelos-servicios/modeloUsuario';
import { ComunicandoComponentesService } from 'src/app/modelos-servicios/ComunicandoComponentes.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [AuthService, ProductoService]
})
export class HeaderComponent implements OnInit, DoCheck {
  public busqueda: String;
  public userLogged: boolean;
  
  public usuario: modeloUsuario = {
    _id: '',
    listaCompras: [],
    listaFavoritos: [],
    nombres: '',
    nickName: '',
    correo: '',
    password: '',
    password2: '',
    rol: ''
  };
  
  public nombreUsuario: String;
  
  cantFav: number
  numCarrito: number

  constructor(private ruta: Router, private auth: AuthService, private cBend: ProductoService, private comComp: ComunicandoComponentesService) {}
  
  ngOnInit(): void {
    if (this.auth.identificaUsuario()) {
      this.usuario._id = this.auth.identificaUsuario().split('"')[3];
      this.validateAmountFavCart()
    }
  }

  validateAmountFavCart(){
    this.cBend.identificaUsuario(this.usuario._id).subscribe(res => {        
      this.usuario = res.findUser
      this.cantFav = this.comComp.mensajeroFavs(this.usuario.listaFavoritos.length)
      this.numCarrito = this.comComp.mensajeroCarrito(this.usuario.listaCompras.length)
      this.usuario.nickName ? this.nombreUsuario = this.usuario.nickName : this.nombreUsuario = this.usuario.nombres
    }, error => console.log(error))
  }
  
  ngDoCheck() {
    this.userLogged = this.auth.usuarioLogueado();
    this.cantFav = this.comComp.enviandoFavs()
    this.numCarrito = this.comComp.enviandoCantCarrito();
  }

  buscar() {
    this.ruta.navigate(['busqueda/' + this.busqueda])
  }
}
