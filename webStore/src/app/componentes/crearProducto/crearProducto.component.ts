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
import { FormControl, FormGroup, Validators } from '@angular/forms';

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
  idCategoria = ''

  url = variable.url
  
  nowDate = new Date().toISOString().slice(0, 10);
  formularioProducto: FormGroup;

  constructor (private _router: Router, private consultaBackend: ProductoService, 
    private auth: AuthService, private comComp: ComunicandoComponentesService) {
      
      this.producto = new modeloProducto('', '', '', '', '', '', null, null, null, null, '', '') 

      this.nuevaSubCategoria = new modeloCategorias('', '')
  }

  afuConfig = {
    multiple: false,
    formatsAllowed: ".jpg, .png, .gif, .jpeg",
    maxSize: "50",
    uploadAPI: {
      url: this.url + 'subirImagen/'
    },
    theme: 'attachPin',
    hideProgressBar: false,
    hideResetBtn: false,
    hideSelectBtn: false,
    replaceTexts: {
      selectFileBtn: 'Select Files',
      resetBtn: 'Reset',
      uploadBtn: 'Upload',
      attachPinBtn: 'Selecciona la imagen...',
      afterUploadMsg_success: 'Successfully Uploaded !',
      afterUploadMsg_error: 'Upload Failed !',
      sizeLimit: 'Tamaño limite alcanzado'
    }
  };

  ngOnInit() {    
    if (this.auth.identificaUsuario()) {
      this.usuario._id = this.auth.identificaUsuario().split('"')[3];
      this.consultaBackend.identificaUsuario(this.usuario._id).subscribe(res => {
        if (res.findUser.rol != 'administrador') this._router.navigate(['listado'])
      }, 
      error => swal({title: 'Usuario no autorizado', text: error, timer: 1500})   
      )
    }
    this.listarCategorias()
    this.initFormProducto()
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

  deleteCat(cat){
    swal({title: 'Proceso eliminacion categoria ', 
      text: `Confirma que desea eleminar ${cat.categoria}`,
      dangerMode: true,
      buttons: [true, true]
    }).then((value)=>{
      value ? (
        this.consultaBackend.eliminarCategoria(cat._id).subscribe(res=>{
          swal({title: 'Proceso exitoso', text: res.mensaje + 'Categoria eliminada', timer: 1500}) 
          this.listarCategorias()
        }, error => swal({title: 'Fallo en el proceso', text: error.mensaje + ' ' + error, timer: 1500}))
      ) : (swal({title:'Eliminacion categoria cancelada', text: 'Todo esta bien', timer: 1000}))
    })
  }

  deleteSubCat(subCat){
    this.consultaBackend.eliminarSubCategoria(this.idCategoria, subCat).subscribe(res=>{
      console.log(res)
    })
  }

  restoreCategories(){
    this.consultaBackend.restoreCategories().subscribe(res=> console.log(res), error => console.warn(error))
  }

  listarSubCats(cat){
    this.listaSubCategorias = []
    if(cat != 0){
      this.consultaBackend.listarSubCategorias(cat).subscribe(res=>{
        this.idCategoria = res.listaSubCat._id
        this.listaSubCategorias = res.listaSubCat.subCategoria
      })
    }
    return this.listaSubCategorias
  }

  soloNumeros(e){
    return e.charCode >= 48 && e.charCode <= 57
  }

  crearCategoria(categoria) {
    this.nuevaCategoria.categoria = categoria
    this.consultaBackend.crearCategoria(this.nuevaCategoria).subscribe(res => {
      swal({title:'Exito en operacion ', text:`Categoria ${categoria} creada satisfactoriamente`, timer: 1500})
      this.listarCategorias() 
    },
    err => swal({ title: 'Error al crear categoria ' + err, text: 'Ya existe la categoria ' + categoria, timer: 3000}))
    this.nuevaCategoria = {categoria: '', subCategoria: ''}
  }

  crearSubCategoria(subCat) {
    this.nuevaSubCategoria = subCat
    this.consultaBackend.crearSubCategoria(this.nuevaSubCategoria).subscribe(res => {
      swal({title: 'Proceso exitoso', text: 'Sub categoria ' + subCat.subCategoria + ' creada en ' + subCat.categoria, timer: 2000})
      this.listarSubCats(subCat.categoria)
    },
    err => {
      err.headers = 402 ? swal({title: 'Error al crear la subcategoria', text: err.message}) :
      console.log('Manage errors: ' + err)
    })
    this.nuevaSubCategoria.subCategoria = '' // = { categoria: 0, subCategoria: '' }
  }

  initFormProducto(){
    this.formularioProducto = new FormGroup({
      nombre: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]),
      marca: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(26)]),
      precio: new FormControl(null,[Validators.required]),
      precioPromo: new FormControl(null),
      tiempoPromo: new FormControl(null),
      descripcion: new FormControl('', [Validators.required, Validators.minLength(8)]),
      categoria: new FormControl(null, [Validators.required]),
      subCategoria: new FormControl(null, [Validators.required])
    })
  }

  crearProducto() {
    if (this.formularioProducto.valid) {
      this.producto = this.formularioProducto.value
      this.consultaBackend.crearProducto(this.producto).subscribe(res => {
        swal({ title: "Producto creado", text: 'Se ha creado producto de manera exitosa', icon: "info", timer: 3000 });
      },
        err => {
          swal("No se pudo crear producto", 'Error creando producto ' + err, "warning");
        }
      )
      this.formularioProducto.reset()
      this.producto.imagen = ''
    }      
  }

  validarPrecioPromocion(precio, precioPromo){
    if(precioPromo > precio){
      this.formularioProducto.controls.precioPromo.setErrors(Validators.max(this.formularioProducto.controls.precio.value)) 
      return true
    } else{
      this.formularioProducto.controls.precioPromo.clearValidators()
      return false
    }
  }

  validarTiempoPromo(){
    if((this.formularioProducto.controls.precioPromo.value > 0) && !this.formularioProducto.controls.tiempoPromo.value){
      this.formularioProducto.controls.tiempoPromo.setErrors(Validators.required)
      return true
    }else{
      this.formularioProducto.controls.tiempoPromo.clearValidators()
      return false
    }
  }

  subirImagen(e){
    this.producto.imagen = e.body.imagen
  }

  borrarImagen(){
    if(this.producto.imagen){
      this.consultaBackend.borrarImagen(this.producto.imagen).subscribe(res=>{
        swal({title: 'Imagen borrada', text: res.mensaje, timer: 1000})
      }), err=>{swal({title: 'Imagen no borrada', text: err.mensaje, timer: 1000})}
      this.producto.imagen = ''
    }
  }

  cancela() {    
    this.nuevaCategoria = {categoria: '', subCategoria: []}
  }
}