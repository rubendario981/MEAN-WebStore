import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../modelos-servicios/producto.service';
import { modeloCat } from '../../modelos-servicios/modeloCategoria';
import { variable } from '../../modelos-servicios/constantes';

@Component({
  selector: 'app-navegacion',
  templateUrl: './navegacion.component.html',
  styleUrls: ['./navegacion.component.css'],
  providers: [ProductoService]
})
export class NavegacionComponent implements OnInit {

  url = variable.url;
  public categoria: modeloCat[];
  misCategorias: [];
  misCategorias3: [];
  constructor(private _listarCategorias: ProductoService) {
  }

  ngOnInit(): void {
    this._listarCategorias.listarCategorias().subscribe(
      res =>{
        if(res.mensaje == 'ok'){
          this.categoria = res.filtrarCat;
          
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
