import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../modelos-servicios/producto.service';
import { AuthService } from '../../modelos-servicios/auth.service';
import { Router } from '@angular/router'
import swal from 'sweetalert'

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
  providers: [ProductoService]
})
export class PerfilComponent implements OnInit {
  public nombres: String;
  public nickName: String;
  public correo: String;
  public idUsuario: String;
  constructor(private cBackEnd: ProductoService, private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
    const id = this.auth.identificaUsuario().split('"')[3];
    this.cBackEnd.identificaUsuario(id).subscribe(
      res=>{
        this.nombres = res.findUser.nombres
        this.nickName = res.findUser.nickName
        this.correo = res.findUser.correo
        this.idUsuario = id
      },
      error=>{
        console.log('error en perfilamiento ' + error)
      }
    )
  }

  eliminaUsuario(){
    swal({
      title: "Proceso de eliminacion usuario" ,
      text: "Confirma que desea darse de baja del sistema? ",
      icon: "warning",
      buttons: [true, true],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        this.cBackEnd.eliminaUsuario(this.idUsuario).subscribe(
          res =>{
            swal("Te haz dado de baja de nuestro sistema", {
              icon: "success",
              buttons: {
                ok: {
                  text: "Enterado",
                  value: "aceptar",
                }
              },
            })
            .then((value) => {
              if(value === "aceptar") this.auth.salida()
            });         
          },
          error=>{
            swal("Hubo un error en la eliminacion del usuario", {
              icon: "warning",              
              text: 'Por favor contacta al administrador del sitio'
            });
            console.log(error)
            this.router.navigate(['/'])
          }
        )
      } else {
        swal({          
          title: "Cancelado proceso de eliminacion" ,
          text: "Sigues en el sistema"});        
        }
    });
  }


}
