import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../modelos-servicios/producto.service';
import { variable } from '../../modelos-servicios/constantes'
import { ActivatedRoute, Params } from '@angular/router'
import { modeloProducto } from  '../../modelos-servicios/modeloProducto';
import swal from 'sweetalert'

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styleUrls: ['./busqueda.component.css'], 
  providers: [ProductoService]
})
export class BusquedaComponent implements OnInit {
  
  public arrayProductos: modeloProducto [];
  public url: String;
  public parametro: string;
  public fecha: Date;

  constructor(private consultaBackend: ProductoService, private paramRuta: ActivatedRoute) {
    this.url = variable.url;
    this.parametro = '../';
    this.fecha = new Date();
  }

  ngOnInit() {    
    this.paramRuta.params.subscribe((params: Params) =>{ 
      let varBusqueda = params['params'];
      this.consultaBackend.busqueda(varBusqueda).subscribe(res =>{  
        this.arrayProductos = res.encontrados
      },
      error => {
        swal("Informacion!!", "No se han encontrado productos con el criterio " + varBusqueda + "info" + error)
        this.arrayProductos = []
      })
    })   
  }
}
