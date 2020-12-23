import { Component, DoCheck, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductoService } from '../../modelos-servicios/producto.service';
import { modeloUsuario } from '../../modelos-servicios/modeloUsuario';
import { AuthService } from '../../modelos-servicios/auth.service';
import swal from 'sweetalert'
import { ComunicandoComponentesService } from 'src/app/modelos-servicios/ComunicandoComponentes.service';

@Component({
  selector: 'app-lista-favoritos',
  templateUrl: './lista-favoritos.component.html',
  styleUrls: ['./lista-favoritos.component.css'],
  providers: [ProductoService, AuthService]
})
export class ListaFavoritosComponent implements OnInit, DoCheck {

  public parametro: String;
  
  public prodFavoritos: any

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

  constructor(private consultaBackEnd: ProductoService, 
    private auth: AuthService, 
    private comComp: ComunicandoComponentesService,
    private ruta: Router) {
      this.parametro = '../busqueda/'
      this.prodFavoritos = []
  }
  
  ngOnInit() {
    if (!this.auth.identificaUsuario()) return this.ruta.navigate(['listado'])
    this.usuario._id = this.auth.identificaUsuario().split('"')[3];

    this.loadAmountFavsCart()
  }

  loadAmountFavsCart(){    
    this.prodFavoritos = []
    this.consultaBackEnd.identificaUsuario(this.usuario._id).subscribe(res=>{
      this.usuario = res.findUser
      this.comComp.mensajeroFavs(res.findUser.listaFavoritos.length)
      this.comComp.mensajeroCarrito(res.findUser.listaCompras.length)
      
      if (res.findUser.listaFavoritos.length < 1) {
        swal({
          title: "Lista de productos favoritos vacio",
          text: 'Navega por la pagina para agregar tus productos favoritos a la lista',
          icon: 'info'
        })
        return this.ruta.navigate(['listado'])
      }
      this.usuario.listaFavoritos.forEach(idProd => {
        this.consultaBackEnd.detalleProducto(idProd).subscribe(res => {
          this.prodFavoritos.push(res.prod)
        })
      });
    })    
  }

  ngDoCheck(){
    if(this.comComp.enviandoFavs() >= 0 && Array.isArray(this.usuario.listaFavoritos)){
      this.comComp.mensajeroFavs(this.usuario.listaFavoritos.length)
    }
    if(this.comComp.enviandoCantCarrito() >= 0 && Array.isArray(this.usuario.listaCompras)){      
      this.comComp.mensajeroCarrito(this.usuario.listaCompras.length)
    }
  }

  eliminaFav(idProd) {
    this.usuario.listaFavoritos = idProd
    this.consultaBackEnd.borrarFav(this.usuario).subscribe(res => {
      this.usuario = res.borraFav;
    },
    err => { console.log(err) }
    )
    this.loadAmountFavsCart()
  }
  
  borrarFavs() {
    swal({
      title: "Eliminacion del listado de favoritos",
      text: "Confirma que desea eliminar el listado de favoritos? ",
      icon: "warning",
      buttons: [true, true],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        this.consultaBackEnd.borrarFavlistado(this.usuario._id).subscribe(res => {
          this.usuario = res.borraListaFav
          swal("Haz eliminado todos tus favoritos", {
            icon: "success",
            buttons: {
              ok: {
                text: "Enterado",
                value: "aceptar",
              }
            },
          }).then((value) => {
            if (value === "aceptar") this.ruta.navigate(['listado'])
          });
          this.loadAmountFavsCart()
        },
          error => {
            swal("No se pudo eliminar el lsitado de favoritos", {
              icon: "info",
              text: error
            });
          }
        )
      } else {
        swal({
          title: "Cancelado proceso de eliminacion listado favoritos",
          text: "No se ha eliminado el producto"
        });
      }
    });
  }

  enviarCarrito(idProd){
    this.usuario.listaFavoritos = idProd    
    this.consultaBackEnd.borrarFav(this.usuario).subscribe(res=>{
      this.usuario = res.borraFav
    })

    this.usuario.listaCompras = idProd
    this.consultaBackEnd.agregaCart(this.usuario).subscribe(res=>{
      this.usuario = res.addCart
      console.log(this.usuario.listaCompras.length)
    })
    this.loadAmountFavsCart()
  }
}
