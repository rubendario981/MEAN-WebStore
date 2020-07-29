import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './componentes/header/header.component';
import { NavegacionComponent } from './componentes/navegacion/navegacion.component';
import { ListadoProductosComponent } from './componentes/listado-productos/listado-productos.component';
import { DescripcionProductoComponent } from './componentes/descripcion-producto/descripcion-producto.component';
import { FooterComponent } from './componentes/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NavegacionComponent,
    ListadoProductosComponent,
    DescripcionProductoComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
