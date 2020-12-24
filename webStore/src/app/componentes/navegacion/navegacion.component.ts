import { AfterViewInit, Component, DoCheck, OnInit } from '@angular/core';
import { ProductoService } from '../../modelos-servicios/producto.service';
import { variable } from '../../modelos-servicios/constantes';
import { ComunicandoComponentesService } from 'src/app/modelos-servicios/ComunicandoComponentes.service';

@Component({
  selector: 'app-navegacion',
  templateUrl: './navegacion.component.html',
  styleUrls: ['./navegacion.component.css'],
  providers: [ProductoService]
})
export class NavegacionComponent implements OnInit, DoCheck, AfterViewInit {

  public url: string;
  public categorias: any;

  constructor(private consultaBackEnd: ProductoService, private comComp: ComunicandoComponentesService) {
    this.url = variable.url
    this.categorias = []
  }

  ngOnInit(): void {

  }

  ngDoCheck(){
    if(this.comComp.sendCategories()){
      this.categorias = this.comComp.sendCategories()
    }
  }

  ngAfterViewInit(){
    this.consultaBackEnd.listarCategorias().subscribe(res => {
      this.comComp.receivedCategories(res.listCategories);      
    })
  }
}
