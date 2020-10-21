import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { ProductoService } from '../../modelos-servicios/producto.service';
import { modeloProducto } from '../../modelos-servicios/modeloProducto';
import { modeloUsuario } from '../../modelos-servicios/modeloUsuario';
import { AuthService } from '../../modelos-servicios/auth.service';
import swal from 'sweetalert'

@Component({
  selector: 'app-carrito-compras',
  templateUrl: './carrito-compras.component.html',
  styleUrls: ['./carrito-compras.component.css'],
  providers: [ProductoService]
})
export class CarritoComprasComponent implements OnInit {

  public producto: modeloProducto = {
    _id: '',
    nombre: '',
    marca: '',
    categoria: '',
    subCategoria: '',
    imagen: '',
    descripcion: '',
    precio: null,
    fecha: null
  };

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

  carritoCompras: any

  constructor(private consultaBackEnd: ProductoService, private auth: AuthService, private ruta: Router) {
    this.carritoCompras = []
  }

  ngOnInit() {
    let objCat = {}
    let arrCart = []
    if (!this.auth.identificaUsuario()) return this.ruta.navigate(['listado'])
    this.usuario._id = this.auth.identificaUsuario().split('"')[3];

    this.consultaBackEnd.identificaUsuario(this.usuario._id).subscribe(res => {
      res.findUser.listaCompras.forEach(idProd => !(idProd in objCat) && (objCat[idProd] = true) && arrCart.push(idProd))
      arrCart.forEach(idProd => {
        this.consultaBackEnd.detalleProducto(idProd).subscribe(res=>{
          Object.defineProperty(res, 'cantidad', { value: 0 })
          this.carritoCompras.push(res.prod)
        })
      });
    })
    this.calTotal()
  }

  procesarPago(){
    console.log('metodo para procesar pago pendiente')
  }

  calTotal(){
    let total = 0
    this.carritoCompras.forEach(prod => {
      total += prod.precio * prod.cantidad
    });
    return total
  }

  eliminaCart(idProd){
    this.usuario.listaCompras = idProd
    swal({
      title: 'Eliminar del carrito de compras',
      text: 'Confirmar eliminacion del producto en el carrito de compras',
      icon: "warning",
      buttons: [true, true],
      dangerMode: true,
    }).then((eliminaCarrito) => {
      eliminaCarrito ? this.consultaBackEnd.borrarCart(this.usuario).subscribe(res => {
        swal("Producto eliminado", {
          icon: "success",
          buttons: {
            ok: {
              text: "Enterado",
              value: "aceptar",
            }
          },
        })
        location.reload()
      }, error =>{
        swal("No se pudo eliminar producto del carrito", {
          icon: "info",
          text: 'Consulta con el admnistrador' +error
        });
      }) :
        swal({
          title: "Cancelado proceso de eliminacion",
          text: "No se ha eliminado el producto del carrito de compras"
        });
    })
  }

  vaciarCart() {
    swal({
      title: 'Vaciar Carrito de compras',
      text: 'Confirmar eliminacion de todo el carrito de compras',
      icon: "warning",
      buttons: [true, true],
      dangerMode: true,
    }).then((vaciarCarrito) => {
      vaciarCarrito ? this.consultaBackEnd.vaciarCart(this.usuario).subscribe(res => {
        swal("Haz eliminado todos los productos del carrito de compras", {
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
      }, error =>{
        swal("No se pudieron eliminar los productos del carrito de comprasa", {
          icon: "info",
          text: 'Consulta con el administrador ' + error
        });
      }) :
        swal({
          title: "Cancelado proceso de eliminacion del carrito de compras",
          text: "No se ha eliminado el producto"
        });
    })
  }

}
