import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../modelos-servicios/producto.service';
import { modeloCategorias } from '../../modelos-servicios/modeloCategorias';
import { variable } from '../../modelos-servicios/constantes';

@Component({
  selector: 'app-navegacion',
  templateUrl: './navegacion.component.html',
  styleUrls: ['./navegacion.component.css'],
  providers: [ProductoService]
})
export class NavegacionComponent implements OnInit {

  public url: string;
  public categorias: any;

  constructor(private consultaBackEnd: ProductoService) {
    this.url = variable.url
    this.categorias = []
  }

  ngOnInit(): void {
    this.consultaBackEnd.listarCategorias().subscribe(res => {
      this.categorias = res.listCategories;      
    })
  }
}
