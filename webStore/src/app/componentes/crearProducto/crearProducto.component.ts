import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { modeloProducto } from 'src/app/modelos-servicios/modeloProducto';
import { ProductoService } from 'src/app/modelos-servicios/producto.service';
import { variable } from '../../modelos-servicios/constantes'

@Component({
  selector: 'app-crearProducto',
  templateUrl: './crearProducto.component.html',
  styleUrls: ['./crearProducto.component.css'],
  providers: [ProductoService]
})
export class CrearProductoComponent implements OnInit {

  producto: modeloProducto = {
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

  categorias: []
  subCategorias: []

  url: String

  constructor
    (private _router: Router,
      private _servicioProducto: ProductoService) {
    this.url = variable.url
  }

  afuConfig = {
    multiple: false,
    formatsAllowed: ".jpg,.png",
    maxSize: "1",
    uploadAPI: {
      url: this.url + 'subirImagen/' + this.producto._id
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


  ngOnInit(){
    console.log('hola')
    this._servicioProducto.listarCategorias().subscribe(
      res => {
        if(res.mensaje == 'ok'){
          this.categorias = res.filtrarCat         
        }         
      },
      err => console.log(err)
      )
    
      this._servicioProducto.listarSubCategorias().subscribe(
        res => {
          if(res.mensaje == 'ok'){
            this.subCategorias = res.filtrarSubCat         
          }         
        },
        err => console.log(err)
        )
  }

  crearProducto() {
    console.log('respuetsa al crear producto')
    console.log(this.producto)
    /* 
    this._servicioProducto.crearProducto(this.producto).subscribe(
      res => {
        alert('Se ha creado el producto')
        console.log(res)
      },
      err => console.log(err)
    ) */
  }

  DocUpload(e) {
  }

  cancela() {
    this._router.navigate(['/'])
  }


}
