import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../modelos-servicios/producto.service';
import { modeloCat } from '../../modelos-servicios/modeloCategoria';
import { ModeloSubCategoria } from '../../modelos-servicios/modeloSubCategoria';
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
  public subCategoria: modeloCat[];
  misCategorias: [];
  misCategorias3: [];
  constructor(
    private _rutas: ProductoService
    
    ) {
  }

  ngOnInit(): void {
    this._rutas.listarCategorias().subscribe(
      res =>{
        if(res.mensaje == 'ok'){
          this.categoria = res.listaCat;
          this.subCategoria = res.listaSubCat
          
        }
        else{
          console.log('Problemas con el servidor')
        }
      },
      err=>{
        console.log(err);
      }
    )
/* 
    this._rutas.listarSubCategorias().subscribe(
      res =>{ 
        if(res.mensaje == 'ok'){
          this.subCategoria = res.filtrarSubCat
        }
        else{
          console.log('Problemas con el servidor')
        }
      },
      err =>{
        console.log(err)
      }
    ) */
  }

}
