
import{ ModuleWithProviders } from '@angular/core';
import {Routes, RouterModule } from '@angular/router';

//se importan componentes del sitio 
import {InicioComponent} from '../app/componentes/inicio/inicio.component';
import {BusquedaComponent} from '../app/componentes/busqueda/busqueda.component';
import {ErrorComponent } from '../app/componentes/error/error.component'
import {ListadoProductosComponent} from '../app/componentes/listado-productos/listado-productos.component';

const misRutas: Routes=[
    {path: '', component: InicioComponent},
    {path: 'inicio', component: InicioComponent},
    {path: 'listado', component: ListadoProductosComponent},
    {path: 'busqueda', component: BusquedaComponent},
    {path: '**', component: ErrorComponent}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(misRutas);
//export const MisRutasRoutes = RouterModule.forChild(misRutas);