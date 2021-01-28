import { AfterContentChecked, Component, DoCheck, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { ProductoService } from '../../modelos-servicios/producto.service';
import { modeloProducto } from '../../modelos-servicios/modeloProducto';
import { modeloUsuario } from '../../modelos-servicios/modeloUsuario';
import { AuthService } from '../../modelos-servicios/auth.service';
import swal from 'sweetalert'
import { ComunicandoComponentesService } from 'src/app/modelos-servicios/ComunicandoComponentes.service';
import * as countdown from 'countdown'
import { Timer } from 'src/app/modelos-servicios/Timer';

countdown.setLabels(' milisegundo| segundo| minuto| hora| dia| semana| mes| año| decada| siglo| milenio',
' milissegundos| segundos| minutos| horas| dias| semanas| meses| años| decadas| siglos| milenios',
' y ', ', ', 'ahora')

@Component({
  selector: 'app-carrito-compras',
  templateUrl: './carrito-compras.component.html',
  styleUrls: ['./carrito-compras.component.css'],
  providers: [ProductoService, AuthService]
})
export class CarritoComprasComponent implements OnInit, DoCheck, AfterContentChecked {

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
  total: number = 0

  constructor(private consultaBackEnd: ProductoService, private comComp: ComunicandoComponentesService,
    private auth: AuthService, private ruta: Router) {
    this.fecha = new Date()
    this.carritoCompras = []
  }

  ngOnInit() {
    if (!this.auth.identificaUsuario()) return this.ruta.navigate(['listado']) 
    this.usuario._id = this.auth.identificaUsuario().split('"')[3];

    this.loadProductsCart()
  }

  loadProductsCart() {
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
      this.usuario.listaCompras.forEach(idProd => {
        this.consultaBackEnd.detalleProducto(idProd).subscribe(res => {
          Object.defineProperty(res.prod, 'cantidad', { value: 0, writable: true })          
          this.carritoCompras.push(res.prod)
          this.comComp.mensajeroCarrito(this.carritoCompras.length)
          if(res.prod.tiempoPromo){
            res.prod.tiempoPromo = new Date(res.prod.tiempoPromo.toString().replace('T00', 'T05'))
            if(new Date() > res.prod.tiempoPromo){
              res.prod.tiempoPromo = null
              res.prod.precioPromo = null
            }
          }
        })
      });
    })
  }

  ngAfterContentChecked(){
    this.carritoCompras.forEach(el => {
      if(el.tiempoPromo){
        el.tiempoPromo = new Date(el.tiempoPromo.toString().replace('T00', 'T05'))
        let timer: Timer
        countdown(el.tiempoPromo, (ts)=>{ timer = ts}, countdown.DAYS|countdown.HOURS|countdown.MINUTES|countdown.SECONDS, 2)
        Object.defineProperty(el, 'timerPromo', {value: timer, writable: true})
      }
    });
  }
  
  ngDoCheck() {
    this.comComp.mensajeroCarrito(this.carritoCompras.length)
    this.carritoCompras.forEach(el => {
      if(el.tiempoPromo){
        if(new Date() > el.tiempoPromo){
          el.tiempoPromo = null
          el.precioPromo = null
          el.timerPromo = null
        }
      }
    });
  }

  calTotal() {
    let total = 0
    this.carritoCompras.forEach(prod => {
      if (prod.tiempoPromo >= this.fecha) {
        total += prod.precioPromo * prod.cantidad
      }
      else {
        total += prod.precio * prod.cantidad
      }
    });
    return total
  }

  soloNumeros(e){
    return (e.target.value.length <= 2) && e.charCode >= 48 && e.charCode <= 57
  }
  
  eliminaCart(idProd) {
    this.usuario.listaCompras = idProd
    swal({
      title: 'Eliminar del carrito de compras',
      text: 'Confirmar eliminacion del producto en el carrito de compras',
      icon: "warning",
      buttons: [true, true],
      dangerMode: true,
    }).then((eliminaCarrito) => {
      eliminaCarrito ? this.consultaBackEnd.borrarCart(this.usuario).subscribe(res => {
        this.loadProductsCart()
        swal("Producto eliminado", {
          icon: "success",
          buttons: {
            ok: {
              text: "Enterado",
              value: "aceptar",
            }
          },
        })
      }, error => {
        swal("No se pudo eliminar producto del carrito", {
          icon: "info",
          text: 'Consulta con el admnistrador' + error
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
        this.loadProductsCart()
      }, error => {
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

  aviso() {
    swal('Implementacion futura', 'Muy pronto se podran realizar los pagos en linea de forma rapida y segura', 'info')
  }

}
