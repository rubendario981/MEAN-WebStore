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

  listaCategorias: []
  listaSubCategorias: []

  url: String

  constructor (private _router: Router,  private _servicioProducto: ProductoService) {
    this.url = variable.url    
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
    this._servicioProducto.listarCategorias().subscribe(
      res => this.listaCategorias = res.filtrarCat,
      err => console.log(err)
    )
    this._servicioProducto.listarSubCategorias().subscribe(
      res =>{if(res) this.listaSubCategorias = res.filtrarSubCat},
      err => console.log(err)
    )
  }

  crearCategoria() {
    delete(this.producto._id)
    delete(this.producto.nombre)
    delete(this.producto.marca)
    delete(this.producto.descripcion)
    delete(this.producto.precio)
    delete(this.producto.fecha)
    delete(this.producto.imagen)
    console.log(this.producto)
    this._servicioProducto.crearCategoria(this.producto).subscribe(
      res => {
        if(res.mensaje == 'ok') {      
          res.categoriaNueva = this.producto
          this._router.navigate(['/crearProducto'])
        }
      },
      err => {
        console.log('No se pudo crear la categoria ') 
        console.log(err)
      }
    )
  }

  crearSubCategoria() {
    delete(this.producto._id)
    delete(this.producto.nombre)
    delete(this.producto.marca)
    delete(this.producto.descripcion)
    delete(this.producto.precio)
    delete(this.producto.categoria)
    delete(this.producto.fecha)
    delete(this.producto.imagen)
    console.log(this.producto)
    this._servicioProducto.crearSubCategoria(this.producto).subscribe(
      res =>{
        if(res) res.subCategoriaNueva = this.producto
      },
      err => console.log(err)
    )

  }

  obtenerCategoria(){
    console.log(this.producto.categoria)
  }

  obtenerCategoria2(){
    console.log(this.producto.categoria)
  }

  obtenerSubCategoria(){

  }

  crearProducto() {
    console.log('respuetsa al crear producto')
    
    this._servicioProducto.crearProducto(this.producto).subscribe(
      res => {
        alert('Se ha creado el producto')
        res.productoCreado = this.producto
      },
      err => console.log(err)
    )
  }

  DocUpload(event){
    this.producto.imagen = event.body.imagen
  }

  cancela() {
    this._router.navigate(['/'])
  }


}
