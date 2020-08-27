import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ProductoService } from '../../modelos-servicios/producto.service';
import { modeloProducto } from  '../../modelos-servicios/modeloProducto';
import { variable } from '../../modelos-servicios/constantes'

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

  constructor(private detalleProd: ProductoService, private idProducto: ActivatedRoute, private ruta: Router) {

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
    this.detalleProd.listarCategorias().subscribe(
      res => this.listaCategorias = res.filtrarCat,
      err => console.log(err)
    )
    this.detalleProd.listarSubCategorias().subscribe(
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

      this.detalleProd.detalleProducto(id).subscribe(
        res =>{
          if(res.prod) {
            this.producto = res.prod
            console.log(this.producto)
          }
          else{ this.ruta.navigate['/listado']}
        },
        error => console.log(error)
      )
    })
  }
  editarProducto(){
    console.log('llamado metodo edita prod')
    console.log(this.producto)
    this.detalleProd.editarProducto(this.producto).subscribe(
      res =>{
        if(res.actualizaProducto){
          this.producto = res.actualizaProducto
        }
      },
      error => alert('No se pudo editar producto' + error)
    )
  }
  
  obtenerCategoria(){
    console.log(this.producto.categoria)
  }
  
  obtenerSubCategoria(){
    console.log(this.producto.subCategoria)
  }

  DocUpload(event){
    this.producto.imagen = event.body.imagen
  }

  cancela() {
    this.ruta.navigate(['/'])
  }


}
