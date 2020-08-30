import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../modelos-servicios/producto.service';
import { variable } from '../../modelos-servicios/constantes'
import { ActivatedRoute, Router, Params } from '@angular/router'
import { modeloProducto } from  '../../modelos-servicios/modeloProducto';
import swal from 'sweetalert'

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styleUrls: ['./busqueda.component.css'], 
  providers: [ProductoService]
})
export class BusquedaComponent implements OnInit {
  
  arrayProductos: modeloProducto []
  url: String
  parametro = "../"

  constructor(private consultaBackend: ProductoService, private paramRuta: ActivatedRoute, private ruta: Router) {
    this.url = variable.url;
  }

  ngOnInit() {    
    this.paramRuta.params.subscribe((params: Params) =>{ 
      let varBusqueda = params['params'];
      console.log(varBusqueda)
      this.consultaBackend.busqueda(varBusqueda).subscribe(
        res =>{  
          this.arrayProductos = res.encontrados
        },
        error => {
          swal("Informacion!!", "No se han encontrado productos con el criterio " + varBusqueda, "info")
          this.arrayProductos = []
        }
      )
    })   
  }
}
