import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { modeloProducto } from 'src/app/modelos-servicios/modeloProducto';
import { ProductoService } from 'src/app/modelos-servicios/producto.service';
import { variable } from 'src/app/modelos-servicios/constantes'

@Component({
  selector: 'app-carrousel-products',
  templateUrl: './carrousel-products.component.html',
  styleUrls: ['./carrousel-products.component.css']
})
export class CarrouselProductsComponent implements OnInit{
  @Input () mainCategory
  @Output () idProd = new EventEmitter<string>()
  productos: modeloProducto[]
  url = variable.url
  
  constructor(private consultaBackEnd: ProductoService) { }

  ngOnChanges(){
    if(this.mainCategory){
      this.consultaBackEnd.busqueda(this.mainCategory).subscribe(res=>{
        this.productos = res.encontrados
      })
    }
  }

  reloadProd(msj: string){
    this.idProd.emit(msj)
    window.scrollTo(0,0)
  }
  
  ngOnInit(): void {
  }

}
