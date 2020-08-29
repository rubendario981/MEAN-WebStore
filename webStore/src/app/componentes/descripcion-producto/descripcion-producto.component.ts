import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ProductoService } from '../../modelos-servicios/producto.service';
import { modeloProducto } from  '../../modelos-servicios/modeloProducto';
import { variable } from '../../modelos-servicios/constantes'
import swal from 'sweetalert';

@Component({
  selector: 'app-descripcion-producto',
  templateUrl: './descripcion-producto.component.html',
  styleUrls: ['./descripcion-producto.component.css'],
  providers: [ProductoService]
})
export class DescripcionProductoComponent implements OnInit {

  public producto: modeloProducto= {
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

  url = variable.url   
  listaCategorias: []
  listaSubCategorias: []

  constructor(private consultaBackend: ProductoService, private idProducto: ActivatedRoute, private ruta: Router) {

  }  
    
  afuConfig = {
    multiple: false,
    formatsAllowed: ".jpg,.png",
    maxSize: "1",
    uploadAPI: {
      url: 'http://localhost:3000/subirImagen/'
    },headers: {
      "Content-Type" : "text/plain;charset=UTF-8"
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
    this.consultaBackend.listarCategorias().subscribe(
      res => this.listaCategorias = res.filtrarCat,
      err => console.log(err)
    )
    this.consultaBackend.listarSubCategorias().subscribe(
      res =>{
        if(res) {
          this.listaSubCategorias = res.filtrarSubCat
          this.listaSubCategorias.shift()
        }
      },
      err => console.log(err)
    )
    this.idProducto.params.subscribe(params =>{ 
      let id = params['id'];

      this.consultaBackend.detalleProducto(id).subscribe(
        res =>{
          if(res.prod) {
            this.producto = res.prod
          }
          else{ this.ruta.navigate['/listado']}
        },
        error => console.log(error)
      )
    })
  }
  editarProducto(){    
    this.consultaBackend.editarProducto(this.producto).subscribe(
      res =>{
        if(res.actualizaProducto){
          this.producto = res.actualizaProducto          
        }
      },
      error => alert('No se pudo editar producto' + error)
    )
    swal("El producto ha sido actualizado", {
      icon: "success",
    });
  }
  eliminarProducto(){
    swal({
      title: "Proceso de eliminacion del producto" ,
      text: "Confirma que desea eliminar el producto? ",
      icon: "warning",
      buttons: [true, true],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        this.consultaBackend.eliminarProducto(this.producto._id).subscribe(
          res =>{
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
              if(value === "aceptar") this.ruta.navigate(['listado'])
            });         
          },
          error=>{
            swal("No se pudo eliminar el producto", {
              icon: "info",              
              text: error
            });
          }
        )
      } else {
        swal({          
          title: "Cancelado proceso de eliminacion" ,
          text: "No se ha eliminado el producto"});        
        }
        this.ruta.navigate(['detallesProducto/', this.producto._id])
    });
  }
  
  obtenerCategoria(){
  }
  
  obtenerSubCategoria(){
  }

  DocUpload(event){
    this.producto.imagen = event.body.imagen
  }

  cancela() {
    this.ruta.navigate(['/'])
  }
}
