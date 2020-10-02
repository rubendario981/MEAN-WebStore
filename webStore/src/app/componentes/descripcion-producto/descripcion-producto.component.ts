import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../modelos-servicios/producto.service';
import { variable } from '../../modelos-servicios/constantes'
import { ActivatedRoute, Router, Params } from '@angular/router';
import { modeloProducto } from '../../modelos-servicios/modeloProducto';
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

  url: String
  listaCategorias: []
  listaSubCategorias: []
  admin: boolean
  parametro = '../../busqueda/'

  constructor(private consultaBackend: ProductoService, private paramRuta: ActivatedRoute, private ruta: Router, private auth: AuthService) {
    this.url = variable.url
    this.admin = false
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
      const id = this.auth.identificaUsuario().split('"')[3];
      this.consultaBackend.identificaUsuario(id).subscribe(
        res => {
          if (res.findUser.rol == 'administrador') this.admin = true
        },
        error => {
          console.log(error)
        }
      )
    }

    this.consultaBackend.listarCategorias().subscribe(
      res => this.listaCategorias = res.filtrarCat,
      err => console.log(err)
    )
    this.consultaBackend.listarSubCategorias().subscribe(
      res => {
        if (res) {
          this.listaSubCategorias = res.filtrarSubCat
        }
      },
      err => console.log(err)
    )
    this.paramRuta.params.subscribe(params => {
      let id = params['id'];

      this.consultaBackend.detalleProducto(id).subscribe(
        res => {
          if (res) {
            this.producto = res.prod
          }
          else { this.ruta.navigate['/listado'] }
        },
        error => console.log(error)
      )
    })
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

  eliminarProducto() {
    swal({
      title: "Proceso de eliminacion del producto",
      text: "Confirma que desea eliminar el producto? ",
      icon: "warning",
      buttons: [true, true],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        this.consultaBackend.eliminarProducto(this.producto._id).subscribe(
          res => {
            swal("El producto ha sido eliminado", {
              icon: "success",
              buttons: {
                ok: {
                  text: "Enterado",
                  value: "aceptar",
                }
              },
            })
              .then((value) => {
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

  obtenerCategoria() {
  }

  obtenerSubCategoria() {
  }

  DocUpload(event) {
    this.producto.imagen = event.body.imagen
  }

  cancela() {
    this.ruta.navigate(['/'])
  }
}
