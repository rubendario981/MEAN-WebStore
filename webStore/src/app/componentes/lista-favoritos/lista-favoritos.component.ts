import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductoService } from '../../modelos-servicios/producto.service';
import { modeloProducto } from '../../modelos-servicios/modeloProducto';
import { modeloUsuario } from '../../modelos-servicios/modeloUsuario';
import { AuthService } from '../../modelos-servicios/auth.service';
import swal from 'sweetalert'

@Component({
  selector: 'app-lista-favoritos',
  templateUrl: './lista-favoritos.component.html',
  styleUrls: ['./lista-favoritos.component.css'],
  providers: [ProductoService, AuthService]
})
export class ListaFavoritosComponent implements OnInit {

  public parametro: String;

  public idProdFavs: []

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

  constructor(private consultaBackEnd: ProductoService, private auth: AuthService, private ruta: Router) {
    this.parametro = '../busqueda/'
    this.prodFavoritos = []
  }
  
  ngOnInit() {
    this.prodFavoritos = []
    if (!this.auth.identificaUsuario()) return this.ruta.navigate(['listado'])
    this.usuario._id = this.auth.identificaUsuario().split('"')[3];

    this.consultaBackEnd.validarFav(this.usuario._id).subscribe(res => {
      if (res.validarFav.listaFavoritos.length < 1) {
        swal({
          title: "Carrito de compras vacio",
          text: 'Navega por la pagina para agregar tus productos favoritos a la lista',
          icon: 'info'
        })
        this.ruta.navigate(['listado'])
      }
      this.idProdFavs = res.validarFav.listaFavoritos
      this.usuario.listaFavoritos = this.idProdFavs
      this.usuario.listaFavoritos.forEach(idProd => {
        this.consultaBackEnd.detalleProducto(idProd).subscribe(res => {
          this.prodFavoritos.push(res.prod)
        })
      });
    },
      err => { console.log('No se pudo identifica favoritos' + err) }
    )
  }

  eliminaFav(idProd) {
    this.usuario.listaFavoritos = idProd
    this.consultaBackEnd.borrarFav(this.usuario).subscribe(res => {
      this.usuario = res.borraFav;
    },
    err => { console.log(err) }
    )
    this.ngOnInit()
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
      this.ruta.navigate(['favoritos'])
    });
  }

  enviarCarrito(idProd){
    this.usuario.listaCompras = idProd

    this.consultaBackEnd.agregaCart(this.usuario).subscribe(res=>{
      this.usuario.listaFavoritos = idProd
      this.consultaBackEnd.borrarFav(this.usuario).subscribe(res=>{
        this.usuario = res.borraFav
      })
    })
    this.ngOnInit()
  }
}
