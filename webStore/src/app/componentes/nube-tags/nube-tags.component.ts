import { Component, OnInit, DoCheck, Input  } from '@angular/core';
import { ActivatedRoute, Params, Route } from '@angular/router'
import { modeloSubCategorias } from  '../../modelos-servicios/modeloSubCategorias';
import { ProductoService } from '../../modelos-servicios/producto.service';
import { variable } from '../../modelos-servicios/constantes'
import { from } from 'rxjs';

@Component({
  selector: 'app-nube-tags',
  templateUrl: './nube-tags.component.html',
  styleUrls: ['./nube-tags.component.css'],
  providers: [ProductoService]
})
export class NubeTagsComponent implements OnInit, DoCheck {

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

  ngDoCheck(){
    /* console.log('inicia do check')
    this.paramRuta.params.subscribe((varPara: Params) =>
    this.parametros = '../'
    console.log(this.url + this.parametros)
    ) */
  }

}
