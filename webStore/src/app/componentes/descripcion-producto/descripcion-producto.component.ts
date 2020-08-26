import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ProductoService } from '../../modelos-servicios/producto.service';
import { modeloProducto } from  '../../modelos-servicios/modeloProducto';
import { variable } from '../../modelos-servicios/constantes'

@Component({
  selector: 'app-descripcion-producto',
  templateUrl: './descripcion-producto.component.html',
  styleUrls: ['./descripcion-producto.component.css'],
  providers: [ProductoService]
})
export class DescripcionProductoComponent implements OnInit {

  public producto: modeloProducto;
  //public url: String;
  url = variable.url 

  constructor(
    private detalleProd: ProductoService,
    private idProducto: ActivatedRoute,
    private ruta: Router) {}

  ngOnInit() {
    console.log(this.url)
    this.idProducto.params.subscribe(params =>{ 
      let id = params['id'];

      this.detalleProd.detalleProducto(id).subscribe(
        res =>{
          if(res.prod) {
            console.log(res.prod)
            this.producto = res.prod
          }
          else{ this.ruta.navigate['/listado']}
        },
        error => console.log(error)
      )
    
    
    })
  }

}
