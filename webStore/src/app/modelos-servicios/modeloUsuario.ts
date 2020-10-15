export class modeloUsuario{
    constructor(
        public _id: String,
        public listaCompras: any,
        public listaFavoritos: any,
        public nombres: String,
        public nickName: String,
        public correo: String,
        public password: String,
        public password2: String,
        public rol: String,
    ){}
}