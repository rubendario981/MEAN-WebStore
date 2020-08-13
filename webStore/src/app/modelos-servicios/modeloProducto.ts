export class modeloProducto{
    constructor(
        public _id: String,
        public nombre: String,
        public marca: String,
        public descripcion: String,
        public categoria: String,
        public subCategoria: String,
        public precio: Number,
        public fecha: Date,
        public imagen: String
    ){}
}