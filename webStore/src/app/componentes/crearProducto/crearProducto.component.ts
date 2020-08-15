import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { modeloProducto } from 'src/app/modelos-servicios/modeloProducto';
import { modeloCategoria } from 'src/app/modelos-servicios/modeloCategoria';
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

  categoria: modeloCategoria= {
    nombreCat: '', 
    nombreSubCat: ''
  };
  subCategoria: String
  listaCategorias: []
  listaSubCategorias: []

  url: String

  constructor (private _router: Router,  private _servicioProducto: ProductoService) {
    this.url = variable.url
  }
/* 
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
  }; */


  ngOnInit() {
    this._servicioProducto.listarCategorias().subscribe(
      res => {
        if (res.mensaje == 'ok') {
          this.listaCategorias = res.filtrarCat
        }
      },
      err => console.log(err)
    )
  }

  crearCategoria() {
    console.log('respuesta del metodo crear categoria')
    this._servicioProducto.crearCategoria(this.categoria.nombreCat).subscribe(
      res => {
        if(res.mensaje == 'ok') {
          
          console.log('Nom categoria ' + res.categoriaNueva)
          console.log('cont response ' + res.mensaje)

        }
      },
      err => {
        console.log('No se pudo crear la categoria ') 
        console.log(err)
      }
    )
  }

  crearSubCategoria() {
    console.log('respuesta del metodo crear subcategoria ****')
  }

  crearProducto() {
    console.log('respuetsa al crear producto')
    console.log(this.producto)
    
    this._servicioProducto.crearProducto(this.producto).subscribe(
      res => {
        alert('Se ha creado el producto')
        console.log(res)
      },
      err => console.log(err)
    )
  }

  DocUpload(e) {
  }

  cancela() {
    this._router.navigate(['/'])
  }


}
