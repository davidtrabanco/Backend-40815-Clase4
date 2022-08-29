const fs = require("fs");
const path = require('path')

class FileManager{
    constructor(filePath){
        this.filePath = filePath;
    }

    async readFileJSON(){
        try {
            const fileData = await fs.promises.readFile( this.filePath, "utf-8");
            return JSON.parse(fileData);
        } catch (error) {
            console.error(error);
        }
    }

    async writeFileJSON(data){
        try {
            const dataTxt = JSON.stringify(data);
            await fs.promises.writeFile( this.filePath, dataTxt )
            return "saved"
        } catch (error) {
            console.error(error);
        }
    }

    async appendFileJSON(data){
        try {
            const dataTxt = JSON.stringify(data);
            await fs.promises.appendFile( this.filePath, dataTxt )
            return "saved" 
        } catch (error) {
            console.error(error);
        }

    }

    async unlink(){
        try {
            await fs.promises.unlink( this.filePath )
            return "deleted"
        } catch (error) {
            console.error(error);
        }
    }
}

class Contenedor extends FileManager{
    constructor(filePath){
        super(filePath);
        this.objects = [];
        this.lastId = 0;
    }

    async getAll(){
        //leo el contenido del archivo y lo cargo en la variable
        this.objects = await this.readFileJSON();
        
        //obtengo el último ID:
        if(this.objects.length != 0){
            this.lastId = this.objects[this.objects.length-1].id
        }

        return this.objects;
    }

    async save(object){
        //obtengo el último id:
        await this.getAll();

        //Agrego el ID al objeto enviado
        this.lastId++;
        object['id'] = this.lastId;

        //Agrego el objeto nuevo al array
        this.objects.push(object);

        //guardo el objeto en el archivo
        await this.writeFileJSON(this.objects)

        return object.id;
    }

    async getById(id){
        //actualizo en memoria todos los registros
        await this.getAll();

        //retorno el objecto filtrado:
        const objFound = this.objects.filter( obj=> obj.id == id);
        
        return objFound[0] === undefined ? null : objFound[0];
    }

    async deleteById(id){
        //actualizo en memoria todos los registros
        await this.getAll();

        //Elimino el registro indicado mediante filtro y lo guardo
        this.objects = this.objects.filter( (obj) => obj.id != id );
        await this.writeFileJSON( this.objects );
    }

    async deleteAll(){
        this.objects = [];
        this.writeFileJSON( this.objects );
    }
    
}


let filePath = path.parse(__dirname); //obtengo el directorio de trabajo
filePath = `${filePath.dir}\\${filePath.base}\\products.json`; //creo la ruta

const productos = new Contenedor(filePath);

//Obtengo todos los productos:
const getAllProducts = async ()=>{
    console.log(await productos.getAll());
}


// //Agrego un producto:
const addNewProduct = async(newProduct) =>{
    const newID = await productos.save(newProduct)
    console.log(`Producto agregado con ID:${newID}`);
}

//Obtengo un producto por ID:
const getById = async (id) => {
    console.log(`Resultado de la búsqueda ID:${id}:
    ${ JSON.stringify( await productos.getById(id)) }`)
}


//Eliminar productos por id:
const deleteById = async (id)=>{
    await productos.deleteById(id);
    getAllProducts();
}

//Eliminar todo
const deleteAll = async () =>{
    await productos.deleteAll();
}

//++++++++++++++++++ PRUEBAS +++++++++++++++++++++++++++

getAllProducts()

const newProduct = {
    title: 'Cartuchera',
    price: 289,
    thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png'
}

//addNewProduct(newProduct);

getById(3);

//deleteById(3);

// deleteAll();

