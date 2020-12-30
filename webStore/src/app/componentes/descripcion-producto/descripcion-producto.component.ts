import { Component, DoCheck, OnInit } from '@angular/core';
import { ProductoService } from '../../modelos-servicios/producto.service';
import { variable } from '../../modelos-servicios/constantes'
import { ActivatedRoute, Router, Params } from '@angular/router';
import { modeloProducto } from '../../modelos-servicios/modeloProducto';
import { modeloUsuario } from '../../modelos-servicios/modeloUsuario';
import { AuthService } from '../../modelos-servicios/auth.service';
import { ComunicandoComponentesService } from 'src/app/modelos-servicios/ComunicandoComponentes.service';
import swal from 'sweetalert';
import { Variable } from '@angular/compiler/src/render3/r3_ast';
import { date } from '@ng-validators/ng-validators';

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
  public fecha = new Date()
  public fechaPromo: any

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
    },
    error => {
      console.log(error)
      this.ruta.navigate['/listado']
    })
    
    this.cartButton ? this.tituloCarrito = "Eliminar del carrito de compras" : this.tituloCarrito = "Añadir al carrito de compras"
    this.favButton ? this.tituloFavorito = "Eliminar de mis favoritos" : this.tituloFavorito = "Añadir a mis favoritos"
    
  }

  ngDoCheck(){    
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
      swal('Error para establecer promocion', 'El precio de la promocion debe ser menor al precio original', 'error')
    }
    else{
      this.fechaPromo = new Date()
      if(this.producto.tiempoPromo){
        this.fechaPromo.setDate(this.fecha.getDate() + parseInt(this.producto.tiempoPromo)) 
        this.producto.tiempoPromo = this.fechaPromo
      }
      this.consultaBackend.editarProducto(this.producto).subscribe(res => {
        swal("Proceso exitoso", "El producto ha sido actualizado", "success");      
      },
        error => swal('Proceso fallido', 'No se pudo editar producto' + error , 'warning')
      )
    }
  }

  validarUsuario(){
    if(!this.auth.usuarioLogueado()){
      swal({
        title: 'Es necesario registrarse en la pagina',
        text: 'Para administrar tus favoritos o el carrito de comprar, por favor registrate en la pagina',
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
    }).then((eliminarProducto) => {
      if (eliminarProducto) {
        this.consultaBackend.eliminarProducto(this.producto._id).subscribe(res => {
          swal("El producto ha sido eliminado", {
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
            swal("No se pudo eliminar el producto", {
              icon: "info",
              text: error
            });
          }
        )
        //una vez eliminado el producto verificar si la categoria quedo vacia para proceder a eliminar
        this.consultaBackend.eliminarCategoria(this.producto.categoria).subscribe(res=>{
          console.log(`Se ha eleminado la categria si queda vacia la categoria ${res}`)
        })
      } else {
        swal({
          title: "Cancelado proceso de eliminacion",
          text: "No se ha eliminado el producto"
        });
      }
      this.ruta.navigate(['detallesProducto/', this.producto._id])
    });
  }

  DocUpload(event) {
    this.producto.imagen = event.body.imagen
  }

  cancela() {
    this.ruta.navigate(['/'])
  }
}
