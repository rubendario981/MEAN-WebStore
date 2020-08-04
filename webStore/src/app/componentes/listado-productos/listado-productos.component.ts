import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../modelos-servicios/producto.service';
import { modeloProducto } from  '../../modelos-servicios/modeloProducto';
import { variable } from '../../modelos-servicios/constantes'

@Component({
  selector: 'app-listado-productos',
  templateUrl: './listado-productos.component.html',
  styleUrls: ['./listado-productos.component.css'],
  providers: [ProductoService]
})
export class ListadoProductosComponent implements OnInit {

  public producto: modeloProducto[];
  public url: String;

  constructor(private _listadoArticulos: ProductoService) { 
    this.url = variable.url;
  }

  ngOnInit(): void {
    this._listadoArticulos.listarArticulos().subscribe(
      res =>{
        if(res.mensaje == 'ok'){
          this.producto = res.productos;
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
