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

  constructor(private consultaBackend: ProductoService) { 
    this.url = variable.url;
  }

  ngOnInit(): void {
    this.consultaBackend.listarArticulos().subscribe(
      res =>{
        if(res.mensaje == 'ok'){
          this.producto = res.listaProductos;
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
