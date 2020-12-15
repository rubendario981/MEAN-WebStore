import { Component, OnInit, DoCheck, Input, AfterContentInit, AfterContentChecked } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../modelos-servicios/auth.service';
import { ProductoService } from '../../modelos-servicios/producto.service';
import { modeloUsuario } from '../../modelos-servicios/modeloUsuario';
import swal from 'sweetalert'
import { ComunicandoComponentesService } from 'src/app/modelos-servicios/ComunicandoComponentes.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [AuthService, ProductoService]
})
export class HeaderComponent implements OnInit, DoCheck, AfterContentInit {
  public busqueda: String;
  public userLogged: boolean;
  
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
  
  public nombreUsuario: String;

  @Input() cantFav: number

  constructor(private ruta: Router, 
    private auth: AuthService, 
    public comComp: ComunicandoComponentesService,
    private cBend: ProductoService) {
  }

  llamadoServicio(){
  }
  
  ngAfterContentInit(){
    //console.log('Llamado al servicio desde header ' + this.comComp.recibiendoFavoritos)

  }
  
  ngOnInit(): void {
    if (this.auth.identificaUsuario()) {
      this.usuario._id = this.auth.identificaUsuario().split('"')[3];
      this.cBend.identificaUsuario(this.usuario._id).subscribe(res => {
        this.usuario.nombres = res.findUser.nickName
        this.nombreUsuario = res.findUser.nickName
        if (!this.nombreUsuario) {
          this.nombreUsuario = res.findUser.nombres
        }
      },
        error => {
          console.log(error)
        }
      )     
      
      // this.cBend.validarFav(this.usuario._id).subscribe(res=>{
      //   this.cantFav = res.validarFav.listaFavoritos.length
      // })
    }
  }

  ngDoCheck() {
    this.userLogged = this.auth.usuarioLogueado();
    // this.cantFav = this.comComp.recibiendoFavoritos
    // console.log('recibiendo desde servicio' + this.cantFav)
    this.llamadoServicio()
  }

  aviso() {
    swal('Aviso', {
      icon: 'info',
      text: 'Muy pronto se implementara esta funcionalidad'
    })
    this.ruta.navigate(['/listado'])
  }

  buscar() {
    this.ruta.navigate(['busqueda/' + this.busqueda])
  }
}
