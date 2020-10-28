import { Component, OnInit, Input  } from '@angular/core';
import { ProductoService } from '../../modelos-servicios/producto.service';
import { variable } from '../../modelos-servicios/constantes'

@Component({
  selector: 'app-nube-tags',
  templateUrl: './nube-tags.component.html',
  styleUrls: ['./nube-tags.component.css'],
  providers: [ProductoService]
})
export class NubeTagsComponent implements OnInit {

  arraySubCats: any  
  url: string
  @Input () parametros: String
  constructor(private consultaBackend: ProductoService) {
    this.url = variable.url
    this.parametros = '../busqueda/'
    this.arraySubCats = []
  }

  ngOnInit(): void {
    let nubePalabras: String
    this.consultaBackend.listarTags().subscribe(res=>{
      res.listado.forEach(element => {
        nubePalabras += ',' + (Object.values(element))
      });
      this.arraySubCats = nubePalabras.split(",")
      this.arraySubCats.shift()
    },
      error=> {console.log(error), this.arraySubCats = []}
    )    
  }
}
