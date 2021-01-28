import { AfterContentChecked, Component, DoCheck, OnInit } from '@angular/core';
import { ProductoService } from '../../modelos-servicios/producto.service';
import { modeloProducto } from  '../../modelos-servicios/modeloProducto';
import { variable } from '../../modelos-servicios/constantes';
import { Timer } from '../../modelos-servicios/Timer';
import * as countdown from 'countdown'
import { AuthService } from 'src/app/modelos-servicios/auth.service';

countdown.setLabels(' milisegundo| segundo| minuto| hora| dia| semana| mes| año| decada| siglo| milenio',
' milissegundos| segundos| minutos| horas| dias| semanas| meses| años| decadas| siglos| milenios',
' y ', ' + ', 'ahora')

@Component({
  selector: 'app-listado-productos',
  templateUrl: './listado-productos.component.html',
  styleUrls: ['./listado-productos.component.css'],
  providers: [ProductoService]
})
export class ListadoProductosComponent implements OnInit, AfterContentChecked, DoCheck {

  public producto: modeloProducto[];
  public url: String;
  public fecha: Date;
  public idUsuario: string;
  public rolUsuario: string

  constructor(private consultaBackend: ProductoService, private auth: AuthService) { 
    this.url = variable.url;
    this.fecha = new Date()
  }

  ngOnInit(): void {
    if (this.auth.identificaUsuario()) {
      this.idUsuario = this.auth.identificaUsuario().split('"')[3];
      this.consultaBackend.identificaUsuario(this.idUsuario).subscribe(res=>{
        this.rolUsuario = res.findUser.rol
      })
    }
    this.listarArticulos()
  }
  
  listarArticulos(){
    this.consultaBackend.listarArticulos().subscribe(res =>{
      this.producto = res.listaProductos;
      this.producto.forEach(el => {
        if(el.tiempoPromo){
          el.tiempoPromo = new Date(el.tiempoPromo.toString().replace('T00', 'T05'))
          if(this.fecha > el.tiempoPromo){
            el.tiempoPromo = null;
            el.precioPromo = null;
          }
        }
      });
    },
    err=>{
      console.log(err);
    })
    
  }

  ngAfterContentChecked(){
    if(this.producto){
      this.producto.forEach(el => {
        if(el.tiempoPromo){
          el.tiempoPromo = new Date(el.tiempoPromo.toString().replace('T00', 'T05'))
          let contador: Timer
          let timerId: number
          timerId = countdown(el.tiempoPromo, (ts)=>{contador = ts}, countdown.DAYS | countdown.HOURS | countdown.MINUTES | countdown.SECONDS)
          Object.defineProperty(el, 'timerPromo', {value: contador, writable: true})           
        }
      });
    }
  }

  ngDoCheck(){
    if(this.producto){
      this.producto.forEach(el => {
        if(el.tiempoPromo){
          if(new Date() > el.tiempoPromo){
            el.tiempoPromo = null
            el.precioPromo = null
            if(this.rolUsuario === 'administrador'){
              this.consultaBackend.editarProducto(el).subscribe(res=>console.log(res), err=>console.log(err))
            }
          }
        }
      });
    }
  }
  
}
