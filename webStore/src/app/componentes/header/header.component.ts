import { Component, OnInit, DoCheck } from '@angular/core';
import { Router } from '@angular/router'
import { AuthService } from '../../modelos-servicios/auth.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [AuthService]
})
export class HeaderComponent implements OnInit, DoCheck{
  public busqueda: String;
  public userLogged: boolean;

  constructor(private ruta: Router, private consultaBackend: AuthService) { }

  ngOnInit(): void {
    
  }
  
  ngDoCheck(){
    this.userLogged = this.consultaBackend.usuarioLogueado()

  }

  buscar(){
    this.ruta.navigate(['busqueda/' + this.busqueda])
  }
}
