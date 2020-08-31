import { Component, OnInit, Input  } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
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
  @Input () parametros: String
  constructor(private consultaBackend: ProductoService, private paramRuta: ActivatedRoute) {
    this.url = variable.url
    this.parametros = '../busqueda/'
  }

  ngOnInit(): void {
    this.consultaBackend.listarSubCategorias().subscribe(
      res=>{
        if(res.filtrarSubCat) this.arraySubCats = res.filtrarSubCat
        this.arraySubCats.shift()
      },
      error=> console.log(error)
    )    
  }
}
