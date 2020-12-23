import { Component, DoCheck, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { ProductoService } from '../../modelos-servicios/producto.service';
import { modeloProducto } from '../../modelos-servicios/modeloProducto';
import { modeloUsuario } from '../../modelos-servicios/modeloUsuario';
import { AuthService } from '../../modelos-servicios/auth.service';
import swal from 'sweetalert'
import { ComunicandoComponentesService } from 'src/app/modelos-servicios/ComunicandoComponentes.service';

@Component({
  selector: 'app-carrito-compras',
  templateUrl: './carrito-compras.component.html',
  styleUrls: ['./carrito-compras.component.css'],
  providers: [ProductoService, AuthService]
})
export class CarritoComprasComponent implements OnInit, DoCheck {

  public producto: modeloProducto[]

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

  public carritoCompras: any
  public fecha: Date

  constructor(private consultaBackEnd: ProductoService, private comComp: ComunicandoComponentesService,
    private auth: AuthService, private ruta: Router) {
      this.fecha = new Date()    
  }
  
  ngOnInit() {
    if (!this.auth.identificaUsuario()) return this.ruta.navigate(['listado'])
    this.usuario._id = this.auth.identificaUsuario().split('"')[3];
    let objCat = {}
    let arrCart = []
    this.carritoCompras = []

    this.consultaBackEnd.identificaUsuario(this.usuario._id).subscribe(res => {
      this.usuario = res.findUser
      if (this.usuario.listaCompras.length < 1) {
        swal({
          title: "Carrito de compras vacio",
          text: 'Navega por la pagina para agregar tus productos favoritos a la lista',
          icon: 'info'
        })
        return this.ruta.navigate(['listado'])
      }
      this.comComp.mensajeroCarrito(res.findUser.listaCompras.length)
      res.findUser.listaCompras.forEach(idProd => !(idProd in objCat) && (objCat[idProd] = true) && arrCart.push(idProd))
      arrCart.forEach(idProd => {
        this.consultaBackEnd.detalleProducto(idProd).subscribe(res=>{
          Object.defineProperty(res.prod, 'cantidad', { value: 0, writable: true})
          this.carritoCompras.push(res.prod)
        })
      });
    })
  }
  
  ngDoCheck(){
    if(this.comComp.enviandoCantCarrito() >= 0 && Array.isArray(this.usuario.listaCompras)){
      this.comComp.mensajeroCarrito(this.usuario.listaCompras.length)
    }
  }

  calTotal(){
    let total = 0
    this.carritoCompras.forEach(prod => {
      if(prod.tiempoPromo >= this.fecha.toISOString()){
        total += prod.precioPromo * prod.cantidad
      }
      else{
        total += prod.precio * prod.cantidad
      }
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
        this.usuario = res.delCart
        swal("Producto eliminado", {
          icon: "success",
          buttons: {
            ok: {
              text: "Enterado",
              value: "aceptar",
            }
          },
        })
        this.ngOnInit()
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
        this.usuario = res.emptyCart
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

  aviso(){
    swal('Implementacion futura', 'Muy pronto se podran realizar los pagos en linea de forma rapida y segura', 'info')
  }

}
