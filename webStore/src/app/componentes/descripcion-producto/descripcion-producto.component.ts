import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../modelos-servicios/producto.service';
import { variable } from '../../modelos-servicios/constantes'
import { ActivatedRoute, Router, Params } from '@angular/router';
import { modeloProducto } from '../../modelos-servicios/modeloProducto';
import { modeloUsuario } from '../../modelos-servicios/modeloUsuario';
import { AuthService } from '../../modelos-servicios/auth.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-descripcion-producto',
  templateUrl: './descripcion-producto.component.html',
  styleUrls: ['./descripcion-producto.component.css'],
  providers: [ProductoService, AuthService]
})
export class DescripcionProductoComponent implements OnInit {

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

  url: String
  listaCategorias: []
  listaSubCategorias: []
  admin: boolean
  parametro: string
  favButton: boolean
  cartButton: boolean
  tituloCarrito: String

  constructor(private consultaBackend: ProductoService, private paramRuta: ActivatedRoute, private ruta: Router, private auth: AuthService) {
    this.url = variable.url
    this.admin = false
    this.parametro = '../../busqueda/'
    this.favButton = false
    this.cartButton = false
    this.tituloCarrito = 'Agregar al carrito de compras'
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

  ngOnInit(): void {
    if (this.auth.identificaUsuario()) {
      this.usuario._id = this.auth.identificaUsuario().split('"')[3];
      this.consultaBackend.identificaUsuario(this.usuario._id).subscribe(res => {
        if (res.findUser.rol == 'administrador') this.admin = true
      },
        error => { console.log(error)
        }
      )

      this.consultaBackend.identificaUsuario(this.usuario._id).subscribe(res=>{
        this.favButton = res.findUser.listaFavoritos.includes(this.producto._id)
        this.cartButton = res.findUser.listaCompras.includes(this.producto._id)
      })
    }

    this.consultaBackend.listarCategorias().subscribe(res => {
      this.listaCategorias = res.filtrarCat
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

  }

  listarCategoria(categoria){
    this.listaSubCategorias = []
    this.consultaBackend.listarSubCategorias(categoria).subscribe(res=>{
      this.listaSubCategorias = res.listaSubCat.subCategoria
    })
    return this.listaSubCategorias
  }

  editarProducto() {
    this.consultaBackend.editarProducto(this.producto).subscribe(
      res => {
        if (res.actualizaProducto) {
          this.producto = res.actualizaProducto
        }
      },
      error => alert('No se pudo editar producto' + error)
    )
    swal("El producto ha sido actualizado", {
      icon: "success",
    });
  }

  adminFavs() {
    if(!this.auth.usuarioLogueado()){
      swal({
        title: 'Es necesario registrarse en la pagina',
        text: 'Para administrar tus favoritos o el carrito de comprar, por favor registrate en la pagina',
        icon: 'info',
        buttons: [true, true]        
      }).then((registrarUsuario)=>{
        registrarUsuario ? this.ruta.navigate(['registro']): this.ruta.navigate(['listado'])
      })
      return
    }

    this.usuario.listaFavoritos = this.producto._id

    if (!this.favButton) {
      this.consultaBackend.agregaFav(this.usuario).subscribe(res => {
        if (res) {
          this.usuario = res.listaFav
          this.favButton = true
        }
      },
        error => { swal("No se agrego el producto a favoritos, por favor contactar al administrador", { icon: 'info', text: error }) }
      )
    } 
    else {
      this.consultaBackend.borrarFav(this.usuario).subscribe(res => {
        if (res) {
          this.usuario = res.borraFav
          this.favButton = false
        }
      },
        err => { console.log('No se pudo eliminar de favoritos ' + err) }
      )
    }
  }

  adminCarrito(){
    if(!this.auth.usuarioLogueado()){
      swal({
        title: 'Es necesario registrarse en la pagina',
        text: 'Para administrar tus favoritos o el carrito de comprar, por favor registrate en la pagina',
        icon: 'info',
        buttons: [true, true]        
      }).then((registrarUsuario)=>{
        registrarUsuario ? this.ruta.navigate(['registro']): this.ruta.navigate(['listado'])
      })
      return
    }
    
    this.usuario.listaCompras = this.producto._id

    this.cartButton ? this.consultaBackend.borrarCart(this.usuario).subscribe(res=>{
      this.cartButton = false
      this.tituloCarrito = "Agregar al carrito de compras"
    }): this.consultaBackend.agregaCart(this.usuario).subscribe(res=>{
      this.cartButton = true
      this.tituloCarrito = "Eliminar del carrito de compras"
    })
  }

  eliminarProducto() {
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
