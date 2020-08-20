import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../modelos-servicios/producto.service';
//import { modeloCat } from '../../modelos-servicios/modeloCategoria';
import { variable } from '../../modelos-servicios/constantes';

@Component({
  selector: 'app-navegacion',
  templateUrl: './navegacion.component.html',
  styleUrls: ['./navegacion.component.css'],
  providers: [ProductoService]
})
export class NavegacionComponent implements OnInit {

  url = variable.url;
  misCategorias: [];
  constructor(
    private _rutas: ProductoService
    
    ) {
  }

  ngOnInit(): void {
    this._rutas.listarCategorias().subscribe(
      res =>{
        if(res.mensaje == 'ok'){
          this.misCategorias = res.filtrarCat;  
        }
        else{
          console.log('Problemas con el servidor')
        }
      },
      err=>{
        console.log(err);
      }
    )
  }

}
