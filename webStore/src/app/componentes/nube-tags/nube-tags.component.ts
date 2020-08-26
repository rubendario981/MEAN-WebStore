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
  constructor(private listaSubCategorias: ProductoService) {
    this.url = variable.url
  }

  ngOnInit(): void {
    this.listaSubCategorias.listarSubCategorias().subscribe(
      res=>{
        if(res.filtrarSubCat) this.arraySubCats = res.filtrarSubCat
        console.log(this.arraySubCats.shift())
      },

      error=> console.log(error)
    )
  }

}
