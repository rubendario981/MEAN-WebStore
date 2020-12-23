import { Component, OnInit, DoCheck, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../modelos-servicios/auth.service';
import { ProductoService } from '../../modelos-servicios/producto.service';
import { modeloUsuario } from '../../modelos-servicios/modeloUsuario';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [AuthService, ProductoService]
})
export class HeaderComponent implements OnInit, DoCheck, OnChanges {
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

  @Input() cantFav: number
  @Input() numCarrito: number

  constructor(private ruta: Router, 
    private auth: AuthService, 
    private cBend: ProductoService) {
  }
  
  ngOnChanges(sc: SimpleChanges){
    console.log(sc)
  }

  ngOnInit(): void {
    if (this.auth.identificaUsuario()) {
      this.usuario._id = this.auth.identificaUsuario().split('"')[3];
      this.validateAmountFavCart()
      // this.cBend.validarFav(this.usuario._id).subscribe(res=>{
      //   this.cantFav = res.validarFav.listaFavoritos.length
      // })
    }
  }

  validateAmountFavCart(){
    this.cBend.identificaUsuario(this.usuario._id).subscribe(res => {        
      this.numCarrito = res.findUser.listaCompras.length
      this.cantFav = res.findUser.listaFavoritos.length
      this.usuario.nombres = res.findUser.nickName
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

  ngDoCheck() {
    this.userLogged = this.auth.usuarioLogueado();
  }

  buscar() {
    this.ruta.navigate(['busqueda/' + this.busqueda])
  }
}
