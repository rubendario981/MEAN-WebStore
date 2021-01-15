import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../modelos-servicios/producto.service';
import { modeloProducto } from  '../../modelos-servicios/modeloProducto';
import { variable } from '../../modelos-servicios/constantes'
import { AuthService } from 'src/app/modelos-servicios/auth.service';

@Component({
  selector: 'app-listado-productos',
  templateUrl: './listado-productos.component.html',
  styleUrls: ['./listado-productos.component.css'],
  providers: [ProductoService]
})
export class ListadoProductosComponent implements OnInit {

  public producto: modeloProducto[];
  public url: String;
  public fecha: Date;

  constructor(private consultaBackend: ProductoService, private auth: AuthService) { 
    this.url = variable.url;
    this.fecha = new Date()
  }

  ngOnInit(): void {
    this.consultaBackend.listarArticulos().subscribe(res =>{
      this.producto = res.listaProductos;
    },
    err=>{
      console.log(err);
    })
  }

}
