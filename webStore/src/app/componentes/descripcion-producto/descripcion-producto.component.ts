import { Component, DoCheck, OnInit } from '@angular/core';
import { ProductoService } from '../../modelos-servicios/producto.service';
import { variable } from '../../modelos-servicios/constantes'
import { ActivatedRoute, Router } from '@angular/router';
import { modeloProducto } from '../../modelos-servicios/modeloProducto';
import { modeloUsuario } from '../../modelos-servicios/modeloUsuario';
import { AuthService } from '../../modelos-servicios/auth.service';
import { Timer } from '../../modelos-servicios/Timer';
import { ComunicandoComponentesService } from 'src/app/modelos-servicios/ComunicandoComponentes.service';
import swal from 'sweetalert';
import * as countdown from 'countdown'

countdown.setLabels(' milisegundo| segundo| minuto| hora| dia| semana| mes| año| decada| siglo| milenio',
' milissegundos| segundos| minutos| horas| dias| semanas| meses| años| decadas| siglos| milenios',
' y ', ', ', 'ahora')

@Component({
  selector: 'app-descripcion-producto',
  templateUrl: './descripcion-producto.component.html',
  styleUrls: ['./descripcion-producto.component.css'],
  providers: [ProductoService, AuthService]
})
export class DescripcionProductoComponent implements OnInit, DoCheck {

  public producto = new modeloProducto('', '', '', '', '', '', null, null, null, null, '', '') 

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

  public url = variable.url
  public listaCategorias: []
  public listaSubCategorias: []
  public admin = false
  public parametro = '../../busqueda/'
  public favButton = false
  public cartButton = false
  public tituloFavorito  = 'Agregar a mis favoritos'
  public tituloCarrito = 'Agregar al carrito de compras'
  public fecha = new Date().toISOString().slice(0, 10)
  public fechaPromo: Date
  public timerPromo: Timer = null
  yy: number
  mm: number
  dd: number
  hh: number
  min: number

  constructor(private consultaBackend: ProductoService, 
    private paramRuta: ActivatedRoute, 
    private ruta: Router, 
    private comComp: ComunicandoComponentesService,
    private auth: AuthService) {   
  }

  afuConfig = {
    multiple: false,
    formatsAllowed: ".jpg,.png",
    maxSize: "1",
    uploadAPI: {
      url: 'http://localhost:3000/subirImagen/'
    }, headers: {
      "Content-Type": "text/plain;charset=UTF-8"
    },
    theme: "attachPin",
    hideProgressBar: true,
    hideResetBtn: false,
    hideSelectBtn: false,
    fileNameIndex: true,
    replaceTexts: {
      selectFileBtn: 'Select Files',
      resetBtn: 'Reset',
      uploadBtn: 'Upload',
      attachPinBtn: 'Selecciona la imagen...',
      afterUploadMsg_success: 'Successfully Uploaded !',
      afterUploadMsg_error: 'Upload Failed !',
      sizeLimit: 'Tamaño limite: '
    }
  };

  ngOnInit() {
    if (this.auth.identificaUsuario()) {
      this.usuario._id = this.auth.identificaUsuario().split('"')[3];
      this.consultaBackend.identificaUsuario(this.usuario._id).subscribe(res => {
        this.usuario = res.findUser
        this.comComp.mensajeroFavs(res.findUser.listaFavoritos.length)
        this.comComp.mensajeroCarrito(res.findUser.listaCompras.length)
        this.favButton = res.findUser.listaFavoritos.includes(this.producto._id)
        this.cartButton = res.findUser.listaCompras.includes(this.producto._id)
        if (res.findUser.rol == 'administrador') this.admin = true
      },
        error => {
          console.log(error)
        }
      )
    }
    
    this.consultaBackend.listarCategorias().subscribe(res => {
      this.listaCategorias = res.listCategories
    },
    err => console.log(err)
    )
    
    this.paramRuta.params.subscribe(params => {
      this.producto._id = params['id'];      
    })
    
    this.consultaBackend.detalleProducto(this.producto._id).subscribe(res => {
      this.producto = res.prod
      if(this.producto.tiempoPromo){  
        countdown(this.fechaPromo = new Date(this.producto.tiempoPromo.toString().replace('T00', 'T05')), 
        (ts)=> this.timerPromo = ts, countdown.DAYS | countdown.HOURS | countdown.MINUTES | countdown.SECONDS )
      }
    },
    error => {
      console.log(error)
      this.ruta.navigate['/listado']
    })
    
    this.cartButton ? this.tituloCarrito = "Eliminar del carrito de compras" : this.tituloCarrito = "Añadir al carrito de compras"
    this.favButton ? this.tituloFavorito = "Eliminar de mis favoritos" : this.tituloFavorito = "Añadir a mis favoritos"
    
  }
  
  ngDoCheck(){
    if(this.producto.tiempoPromo){
      if(new Date() > this.fechaPromo){
        this.producto.tiempoPromo = null
        this.producto.precioPromo = null
        this.timerPromo = null
        if(this.admin){
          this.consultaBackend.editarProducto(this.producto).subscribe(res=>console.log(res), err=>console.log(err))
        }
      }
    }
  }
  
  listarCategoria(categoria){
    this.listaSubCategorias = []
    this.consultaBackend.listarSubCategorias(categoria).subscribe(res=>{
      this.listaSubCategorias = res.listaSubCat.subCategoria
    })
    return this.listaSubCategorias
  }

  editarProducto() {
    //funcion de proceso administracion pagina
    if(this.producto.precioPromo > this.producto.precio){
      return swal({title: 'Error para establecer promocion', text:'El precio de la promocion debe ser menor al precio original', timer: 2500, icon: 'warning'})
    }
    if(this.producto.precioPromo && !this.producto.tiempoPromo){
      return swal({title: 'Error para establecer promocion', text:'Si se establece una promocion, esta debe tener una fecha limite', timer: 2500, icon: 'warning'})      
    }
    if(!this.producto.nombre || !this.producto.marca || !this.producto.categoria|| !this.producto.precio|| !this.producto.categoria|| !this.producto.descripcion){
      return swal({title: 'No se puede editar el producto', text:'Validar campos requeridos', timer: 5000, icon: 'info'})
    }
    this.consultaBackend.editarProducto(this.producto).subscribe(res => {
      swal({title:"Proceso exitoso", text:"El producto ha sido actualizado" + res.mensaje, icon:"success", timer: 2000});      
    }, error => swal('Proceso fallido', 'No se pudo editar producto' + error , 'warning'))
  }

  validarUsuario(){
    if(!this.auth.usuarioLogueado()){
      swal({
        title: 'Es necesario registrarse en la pagina',
        text: 'Para administrar tus favoritos o el carrito de comprar, por favor registrate en la pagina \n Desea regristrase?',
        icon: 'info',
        buttons: [true, true]        
      }).then((registrarUsuario)=>{
        registrarUsuario ? this.ruta.navigate(['registro']): this.ruta.navigate(['listado'])
      })
      return false
    }
    return true
  }

  adminFavs() {
    if(!this.validarUsuario()) return this.ruta.navigate(['/'])
    //se establece esta variable para poder insertar el id del producto a la lista de favoritos
    this.usuario.listaFavoritos = this.producto._id
    
    if (!this.favButton) {
      this.consultaBackend.agregaFav(this.usuario).subscribe(res => {
        this.usuario = res.listaFav
        this.comComp.mensajeroFavs(this.usuario.listaFavoritos.length)
        this.favButton = true     
        this.tituloFavorito = 'Eliminar de mis favoritos'  
      },
      err => { swal("No se agrego el producto a favoritos, por favor contactar al administrador", { icon: 'info', text: err }) }
      )
    } 
    else {
      this.consultaBackend.borrarFav(this.usuario).subscribe(res => {
        this.usuario = res.borraFav
        this.comComp.mensajeroFavs(this.usuario.listaFavoritos.length)
        this.favButton = false
        this.tituloFavorito = 'Agregar a mis favoritos'
      },
      err => { swal("No se pudo eliminar el producto de tus favoritos, por favor contactar al administrador", { icon: 'info', text: err }) }
      )
    }
  }
  
  adminCarrito(){
    if(!this.validarUsuario()) return this.ruta.navigate(['/'])
    
    this.usuario.listaCompras = this.producto._id
    
    !this.cartButton ? (this.consultaBackend.agregaCart(this.usuario).subscribe(res => {
      this.usuario = res.addCart
      this.comComp.mensajeroCarrito(this.usuario.listaCompras.length)
      this.cartButton = true
      this.tituloCarrito = "Eliminar del carrito de compras"
    })): (this.consultaBackend.borrarCart(this.usuario).subscribe(res=>{
      this.usuario = res.delCart
      this.comComp.mensajeroCarrito(this.usuario.listaCompras.length)
      this.cartButton = false
      this.tituloCarrito = "Agregar al carrito de compras"
    }))
  }

  eliminarProducto() {
    //funcion de proceso administracion pagina
    swal({
      title: "Proceso de eliminacion del producto",
      text: "Confirma que desea eliminar el producto? ",
      icon: "warning",
      buttons: [true, true],
      dangerMode: true,
    }).then((value) => {
      if (value) {
        this.consultaBackend.eliminarProducto(this.producto._id).subscribe(res => {
          swal("El producto ha sido eliminado", {
            icon: "success",
            timer: 3000,
            text: res.mensaje
          }).then(() => {this.ruta.navigate(['listado'])});
        },
          error => {
            swal("No se pudo eliminar el producto", { icon: "info", text: error});
          }
        )
      } else {
        swal({
          title: "Cancelado proceso de eliminacion",
          text: "No se ha eliminado el producto",
          timer: 1200
        });
      }
    });
  }

  DocUpload(event) {
    this.producto.imagen = event.body.imagen
  }

  deleteImage(e){
    swal({title: 'Eliminacion de imagen', 
    text: 'Proceso de eliminacion de imagen, no se podra recuperar la imagen, desea continuar?', 
    buttons: [true, true],
    icon: 'warning',
    closeOnClickOutside: true,
    closeOnEsc: true,
    dangerMode: true}).then((value)=>{
      value ? (this.consultaBackend.borrarImagen(e).subscribe(res=>{
        swal({title: 'Imagen borrada', text: res.mensaje + 'proceso exitoso', icon: 'success', timer: 1200}) , this.producto.imagen = ''
      })) : swal({text: 'No se ha borrado la imagen', icon: 'info', timer: 1200})
    })    
  }

  cancela() {
    this.ruta.navigate(['/'])
  }
}
