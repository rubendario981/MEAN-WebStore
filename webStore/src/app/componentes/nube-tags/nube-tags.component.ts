import { Component, OnInit } from '@angular/core';
import { modeloSubCategorias } from  '../../modelos-servicios/modeloSubCategorias';
import { ProductoService } from '../../modelos-servicios/producto.service';
import { variable } from '../../modelos-servicios/constantes'

@Component({
  selector: 'app-nube-tags',
  templateUrl: './nube-tags.component.html',
  styleUrls: ['./nube-tags.component.css'],
  providers: [ProductoService]
})
export class NubeTagsComponent implements OnInit {

  arraySubCats: modeloSubCategorias []  
  url: string
  parametros: String
  constructor(private serviciosProducto: ProductoService) {
    this.url = variable.url
  }

  ngOnInit(): void {
    this.serviciosProducto.listarSubCategorias().subscribe(
      res=>{
        if(res.filtrarSubCat) this.arraySubCats = res.filtrarSubCat
        this.arraySubCats.shift()
      },
      error=> console.log(error)
    )
  }

}
