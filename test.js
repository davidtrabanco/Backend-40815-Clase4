
let numerosRandom =[]


for (let index = 0; index < 10000; index++) {
    random = parseInt(Math.random() * 20 )

    if(numerosRandom[random]!=undefined){
        numerosRandom[random][random]++
    }else{
        numerosRandom[random]={[random]:1}
    }
}

console.log( numerosRandom);


let numeros = []; //numeros aleatorios
let objetoNumeros = []; // el objeto con claves y valor {1:0,2:3... 5:10 }

const generarNumeros = () => {
	for (i = 0; i < 10000; i++) {
		numeros.push(parseInt(Math.random() * 20 + 1));
	}
	console.log(numeros);
	verificar();
};

const verificar = () => {
	let contador = 0;
	let indice;
	for (let j = 1; j <= 20; ) {
		indice = numeros.indexOf(j);
		if (indice != -1) {
			contador++;
			numeros.splice(indice, 1);
		} else {
			objetoNumeros.push({ [j]: contador });
			contador = 0;
			j++;
		}
	}
	console.log(JSON.stringify(objetoNumeros, null, 2));
};

generarNumeros();
