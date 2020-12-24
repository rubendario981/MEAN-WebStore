import { Component, DoCheck, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { modeloProducto } from 'src/app/modelos-servicios/modeloProducto';
import { ProductoService } from 'src/app/modelos-servicios/producto.service';
import { modeloUsuario } from 'src/app/modelos-servicios/modeloUsuario';
import { modeloCategorias } from  '../../modelos-servicios/modeloCategorias';
import { AuthService } from 'src/app/modelos-servicios/auth.service'
import { variable } from '../../modelos-servicios/constantes'
import swal from 'sweetalert'
import { ComunicandoComponentesService } from 'src/app/modelos-servicios/ComunicandoComponentes.service';

@Component({
  selector: 'app-crearProducto',
  templateUrl: './crearProducto.component.html',
  styleUrls: ['./crearProducto.component.css'],
  providers: [ProductoService]
})
export class CrearProductoComponent implements OnInit, DoCheck {

  public producto: modeloProducto
  
  public usuario: modeloUsuario ={    
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

  public nuevaCategoria: modeloCategorias={
    categoria: '',
    subCategoria: []
  }
  
  public nuevaSubCategoria: modeloCategorias
  
  listaCategorias: []
  listaSubCategorias: []

  url: String

  constructor (private _router: Router, private consultaBackend: ProductoService, 
    private auth: AuthService, private comComp: ComunicandoComponentesService) {
      this.url = variable.url    
      this.producto = new modeloProducto('', '', '', '', '', '', null, null, null, null, '', '')
      this.nuevaSubCategoria = new modeloCategorias('', '')
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
    if (this.auth.identificaUsuario()) {
      this.usuario._id = this.auth.identificaUsuario().split('"')[3];
      this.consultaBackend.identificaUsuario(this.usuario._id).subscribe(res => {
        if (res.findUser.rol != 'administrador') this._router.navigate(['listado'])
      }, 
      error => swal({title: 'Usuario no identificado', text: error})   
      )
    }

    this.listarCategorias()
  }

  ngDoCheck(){
    if(this.comComp.sendCategories()){
      this.comComp.sendCategories()
      this.listaCategorias = this.comComp.sendCategories()
    }
  }

  listarCategorias(){
    this.consultaBackend.listarCategorias().subscribe(res => {
      this.comComp.receivedCategories(res.listCategories)
    })
  }

  listarSubCats(cat){
    this.listaSubCategorias = []
    this.consultaBackend.listarSubCategorias(cat).subscribe(res=>{
      this.listaSubCategorias = res.listaSubCat.subCategoria
    })
    return this.listaSubCategorias
  }

  crearCategoria(categoria) {
    this.nuevaCategoria.categoria = categoria
    this.consultaBackend.crearCategoria(this.nuevaCategoria).subscribe(res => {
      swal('Exito en operacion ', `Categoria ${categoria} creada satisfactoriamente`)
    },
    err => swal({ text: 'Ya existe la categoria ' + categoria, title: 'Error al crear categoria ' + err}))
    this.nuevaCategoria = {categoria: '', subCategoria: ''}
    this.listarCategorias()
  }

  crearSubCategoria(subCat) {
    this.nuevaSubCategoria = subCat
    this.consultaBackend.crearSubCategoria(this.nuevaSubCategoria).subscribe(res => {
      swal('Sub categoria ' + subCat.subCategoria + ' creada en ' + subCat.categoria)
    },
    err => {
      err.headers = 402 ? swal({ text: 'Ya existe la sub-categoria' + this.nuevaSubCategoria.subCategoria, title: 'Error al crear la subcategoria' }) :
      console.log('Manage errors: ' + err)
    })
    this.nuevaSubCategoria = { categoria: 0, subCategoria: '' }
  }

  crearProducto() {
    this.consultaBackend.crearProducto(this.producto).subscribe(res => {
      swal("Producto creado", 'Se ha creado producto de manera exitosa', "info");
      },
      err => {
        swal("No se pudo crear producto", 'Error creando producto ' + err, "warning");
      }
    )    
    document.getElementsByTagName('form')[1].reset()
  }

  DocUpload(event){
    this.producto.imagen = event.body.imagen
  }

  cancela() {    
    this.nuevaCategoria = {categoria: '', subCategoria: []}
  }


}
