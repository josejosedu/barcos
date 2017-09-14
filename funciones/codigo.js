/********************************************************************/
/********************************************************************/
/********************************************************************/
/***************DATOS MODIFICABLES***********************************/

barcosDe1=4;		//Para cambiar la cantidad de barcos de tamaño 1, cambiar este numero
barcosDe2=3;		//Para cambiar la cantidad de barcos de tamaño 2, cambiar este numero
barcosDe3=2;		//Para cambiar la cantidad de barcos de tamaño 3, cambiar este numero
barcosDe4=1;		//Para cambiar la cantidad de barcos de tamaño 4, cambiar este numero
//La multiplicacion de las filas por las columnas, debe de ser mayor o igual que la suma de barcos(el tamaño de cada barco por su cantidad)
//El TAMAÑO MÍNIMO que ha de tener pero no se puede usar es en el que la suma de barcos (el tamaño de cada barco por su cantidad) es igual 
//a filas por columnas, pero usando este tamaño mínimo, habrá problemas, ya que puede que coloque algunos barcos sin dejar espacio para los
//siguientes, por lo que, a mas pequeño el tablero, puede QUEDAR BLOQUEADO en función de como genere los barcos aleatoriamente
filas=10;		//Para cambiar el tamaño del tablero cambiar estos datos, filas y columnas
columnas=10;	//Para cambiar el tamaño del tablero cambiar estos datos, filas y columnas

/***************DATOS MODIFICABLES***********************************/
/********************************************************************/
/********************************************************************/
/********************************************************************/

datosBarcos=[barcosDe1,barcosDe2,barcosDe3,barcosDe4];

turno=0;
tocados=0;
vidaBarco=[];
nombreBarco=[];
totalBarcos=barcosDe1;			//SUMA DE TODOS LOS BARCOS, PARA SABER CUANDO ACABAR LA PARTIDA el valor empieza con la suma los barcos de 1

nombres=[];		
puntos=[];

barcos=[];

totalCasillas=filas*columnas;
numeros=[];

estadoMusica=true;
efectosSonido=true;

function numJugadores(){
	numjug=document.getElementById("numjug").value;
	eliminarElemento("padre","jugadores");				//Elimino la capa inicial mediante la funcion eliminar, para no acumularlo aqui
	
	var capanombres=document.createElement("div");
	var padre=document.getElementById("padre");			
	capanombres.id="capanombres";
	
	for(i=0;i<numjug;i++)					//Tantos campos de entrada como numero de jugadores, para introducir el nombre de cada jugador
	{
		var salto=document.createElement("br");			//para insertar saltos de línea, no se otra manera
		var nombre=document.createElement("input");		//Campo de escritura
		var etiqueta=document.createElement("label");	//Etiqueta del numero de jugador
		var texto=document.createTextNode("Jugador "+(i+1)+"  ");	//Texto del numero de jugador
		etiqueta.appendChild(texto);
		nombre.id="jug"+i;
		nombre.type="text";
		capanombres.appendChild(etiqueta);
		capanombres.appendChild(nombre);
		capanombres.appendChild(salto);
		padre.appendChild(capanombres);
	}
	var siguiente=document.createElement("input");	//Boton para pasar a lo siguiente
	siguiente.type="button";
	siguiente.value="Siguiente";
	siguiente.id="siguiente";
	siguiente.onclick=leerJugadores;		//Esta función cogerá los nombres de cada jugador y los guarda en una variable array global
	padre.appendChild(siguiente);
}//fin numJugadores()


function leerJugadores(){			//Función para leer los nombres de los jugadores introducidos en los campos input
	for(i=0;i<numjug;i++)
	{
		nombres[i]=document.getElementById("jug"+i).value;
		puntos[i]=0;			//También inicializamos un array con los puntos de cada jugador, inicialmente 0
	}
	crearJuego();
}

function crearJuego(){		//Esta función llama a otras que son las encargadas de crear el juego
	eliminarElemento("padre","capanombres");
	eliminarElemento("padre","siguiente");

	crearBarcos();

	arrayNumeros();
	generarBarcos(1,barcosDe1);		//El primer numero el tamaño, y el seguno la cantidad de barcos de ese tamaño
	generarBarcos(2,barcosDe2);
	generarBarcos(3,barcosDe3);
	generarBarcos(4,barcosDe4);	

	guardarBarcos();
	crearTablero();
	ponerJugadores();	
}

function crearBarcos(){				//Creamos un array con tantos barcos como casillas, al inicio todos con valor 0
	for(i=0;i<totalCasillas;i++)
		barcos[i]=0;
}

function arrayNumeros(){			//Esta función es exclusivamente para la generación de barcos en posición horizontal
	for(i=1;i<=columnas;i++)
		numeros[i]=(i*columnas)+"";
}

function generarBarcos(tamanio,cantidad){	//Genera barcos de tamaño="tamanio" y cantidad que le pasemos, en posiciones aleatorias del tablero
//No  los crea en el tablero en si, si no que los crea en el array "barcos", en sus posiciones adecuadas, para que a la hora de establecer cada
//índice de ese array ("barcos"), con una casilla del tablero, cada valor será el id de cada casilla
if(filas>=tamanio || columnas>=tamanio)			//Para que si se hace un tablero muy pequeño, solo coloque los barcos que entren en ese tablero
	for(i=0;i<cantidad;i++)
	{
		var vh=aleatorio(1,0);	//Determina posición aleatorio, vertical u horizontal	
		var contador=0;
		var entrar=true;
		if(vh==1)	//horizontal
		{
			var maximo=(numeros[aleatorio(numeros.length,0)])-tamanio;	
			var colocar=aleatorio(maximo,(maximo-(columnas-tamanio)));
			while(contador!=tamanio)
			{
				if(barcos[colocar+contador]!=0)		//Si las posiciones donde se ha de colocar estan todas libres
				{
					entrar=false;
					i--;
					break;		//Si encuentro una que no esté libre paro la busqueda
				}
				contador++;
			}
			if(entrar)		//Solo entra si todas las posiciones donde se ha de colocar el barco estaban libre, y esto, lo coloca
				for(j=colocar;j!=colocar+tamanio;j++)
					barcos[j]=tamanio+""+i;
		}
		else		//vertical
		{
			var colocar=aleatorio(totalCasillas-((tamanio-1)*columnas),0);
			while(contador!=tamanio)
			{
				if(barcos[colocar+(contador*columnas)]!=0)
				{
					entrar=false;
					i--;
					break;
				}
				contador++;
			}
			if(entrar)
				for(j=colocar;j!=colocar+(tamanio*columnas);j+=columnas)
					barcos[j]=tamanio+""+i;
		}
	}
}//fin generarBarcos()

function guardarBarcos(){	//Genera dos arrays, el primero son los nombres de los barcos, genera algo así:
//[10,11,12,13,20,21,22,30,31,40], esto es para llevar un recuento de las veces que se ha picado en un barco y así saber cuando se ha undido
	var z=0;
	for(i=1;i<datosBarcos.length;i++)
		for(j=0;j<datosBarcos[i];j++,z++)
		{
			nombreBarco[z]=(i+1)+""+j;		//Nombres de los barcos
			vidaBarco[z]=0;
			totalBarcos+=i+1;		//Para saber cuando acabar la partida
		}
}

function crearTablero(){		//Creamos gráficamente el tablero, todas las casillas
	var capagrandre=document.createElement("div");
	capagrandre.id="capagrande";
	var ancho=(90/columnas)+"%";		//Divido 90, porque si cogemos 100 se sale, por margenes y el borde.
	var alto=(90/filas)+"%";			//Es para que se adapte automáticamente en funcion del numero de filas o columnas
	for(i=0;i<totalCasillas;i++)
	{
		var capa=document.createElement("div");
		capa.id=barcos[i];		//Como id le establecemos en orden, a cada casilla un índice del array barcos, donde se han creado aleatoriamente
		capa.style.width=ancho;		
		capa.style.height=alto;		
		capa.style.backgroundImage="url('imagenes/tablon.png')";		
		capa.style.backgroundSize="100% 100%";
		capa.onclick=comprobar;			//Para que cada vez que se haga click en una casilla se evalue lo que sucede con esa casilla
		capagrandre.appendChild(capa);
	}
	var leyenda=document.createElement("div");
	leyenda.id="leyenda";
	document.getElementById("padre").appendChild(leyenda);
	document.getElementById("padre").appendChild(capagrandre);
}

function ponerJugadores(){		//Creamos gráficamente el marcador con la puntuación de cada jugador
	var izq=0;
	var alt=0;
	for(i=0;i<numjug;i++)	//En función de los jugadores que haya se crearán tantos tablones
	{
		var capa=document.createElement("div");
		capa.id="jugador"+i;
		capa.style.marginLeft=izq+"%";
		capa.style.backgroundImage="url(imagenes/jugador.png)";
		if(i==0){
			capa.style.width="16.5%";
			capa.style.height="19.5%"
			capa.style.opacity=1;
		}
		capa.style.marginTop=alt+"%";
		capa.style.position="absolute";
		
		switch(i)		//Simple colocación de cada tablón de puntuación
		{
			case 0:
				izq+=80;
			break;

			case 1:
				izq-=80;
				alt+=36;
			break;

			case 2:
				izq+=80;
			break;
		}

		var texto=document.createTextNode(nombres[i]);
		var parrafo=document.createElement("p");
		parrafo.appendChild(texto);
		capa.appendChild(parrafo);	
		var texto=document.createElement("p");
		texto.id="puntos"+i;				//Le damos un id para poder actualizarlo y borrarlo cuando sea necesario
		texto.innerHTML=(0);				//Todos empiezan con 0 puntos
		capa.appendChild(texto);
		document.getElementById("padre").appendChild(capa);
	}
}//fin ponerJugadores()

function comprobar(){	//Cuando se hace click en una casilla se ejecuta esta función. La casilla cambiará de color, en función de su id
	
	if(efectosSonido)	//Si los efectos de sonido estan activados, que se ejecute la función para que reproduzca el sonido al click
		sonidoClick();
	var ide=parseInt(this.id.charAt(0));	//Obtenemos el id de la casilla que ha sido pulsada, solo nos interesa el primer número, es decir,
											//solo nos interesa el tamaño del barco, no el numero (nombre), del barco

	var casillaCompleta=this.id;
	switch(ide)
	{
		case 4:		
			this.style.backgroundImage="url(./imagenes/ba4.png)";
		break;

		case 3:		
			this.style.backgroundImage="url(./imagenes/ba3.png)";
		break;

		case 2:		
			this.style.backgroundImage="url(./imagenes/ba2.png)";
		break;

		case 1:		
			this.style.backgroundImage="url(./imagenes/ba1.png)";
		break;

		case 0:		
			this.style.backgroundImage="url(imagenes/agua.gif)";
			this.style.opacity="0.7";
		break;
	}
	this.onclick="";		//Para deshabilitar el click de la casilla que hemos picado
	jugar(casillaCompleta);
}//fin comprobar()

function jugar(casilla){
	var ide=casilla.charAt(0);
	if(tocados!=totalBarcos)
	{
		if(ide!=0)		//Cuando no sea agua
		{
			tocados++;
			if(sumarBarco(casilla,ide))
			{
				puntos[turno]+=2;
			}
			else
				puntos[turno]++;
			//Actualizar los puntos de los usuarios								
			var texto=document.createElement("p");		
			texto.id="puntos"+turno;					//Le damos un id para poder borrarlo
			texto.innerHTML=(puntos[turno]);	//Actualizamos los puntos del jugador que ha jugado
			eliminarElemento("jugador"+turno,"puntos"+turno);
			document.getElementById("jugador"+turno).appendChild(texto);
		}
		else
		{
			document.getElementById("jugador"+turno).style.width="14%";
			document.getElementById("jugador"+turno).style.height="17%"
			document.getElementById("jugador"+turno).style.opacity=0.65;
			if(turno==nombres.length-1)		//Cuando este jugando el ultimo jugador, que el turno pase de nuevo al primero
				turno=0;
			else 						//El turno pasa al siguiente
				turno++;
			document.getElementById("jugador"+turno).style.width="16.8%";
			document.getElementById("jugador"+turno).style.height="19.2%"
			document.getElementById("jugador"+turno).style.opacity=1;
		}
	}
		/***************************/
	if(tocados==totalBarcos) //Comparamos si son iguales al salir de hacer click
		finDeJuego();
}//fin jugar()

function sumarBarco(numBarco,ide){	//Para saber cuántos puntos se han de sumar, en función de si ha tocado un barco(1) o lo ha undido(2)
	if(ide==1)				//Si el barco es de tamaño 1, devuelver true (cuando devuelve true, la función "jugar" suma dos puntos, si no 1)
		return true;	
	else
	{
	var i;
	for(i=0;nombreBarco[i]!=numBarco;i++){}		//Como al array de nombreBarco le corresponde el mismo índice de vidaBarco con su vida, voy
	vidaBarco[i]++;								//hasta su vida para sumarle uno, como que una parte ha sido descubierta
	if(vidaBarco[i]==ide)			//Si la vida del barco, es igual al tamaño del barco, devuelver true
		return true;
	}
	return false;		//Si ninguna de las anteriores, devuelve false y solo sumará un punto la función jugar
}

/*FUNCIONALIDAD DE SONIDOS*/

function sonidoClick(){				//Ejecutar un pequeño audio al hacer click en una casilla
	eliminarElemento("padre","sonido");		//Coge el elemento audio del html, y lo elimina, porque solo se reproduce una vez,
	var sound=document.createElement("audio");		//al principio esta puesto manualmente, para la primera vez poder cogerlo y borrarlo
	sound.src="./sonidos/espada.wav";
	sound.autoplay=true;			//Para que se reproduzca automáticamente
	sound.id="sonido";				//Para poder volverlo a coger por esta función y eliminarlo la siguiente vez
	padre.appendChild(sound);		//Lo añadimos, y al momento se reproduce, por el autoplay
}

function pararMusica(){				//Esto cada vez que se hace click en la imagen de parar audio se ejecuta
	var sound=document.getElementById("musica");
	sound.muted=estadoMusica;		//Coge el elemento introducido manualmente en el html (que es el que contiene el audio y su ruta),
	estadoMusica=!estadoMusica;		//y le cambia la propiedad muted a estadoMusica, y la propiedad estadoMusica se cambia de valor,
	cambiarImagenSonido();			//Para cambiarlo a lo contrario la próxima vez que se ejecute esta función
}

function cambiarImagenSonido(){		//Cambia la imagen de el estado actual de la música
	var imagen=document.getElementById("imagenSonido");
	if(estadoMusica)
		imagen.src="imagenes/continuar.png";
	else
		imagen.src="imagenes/silencio.png";
}

function efectos(){				//Cambia la imagen del estado actual de los efectos de sonido
	var imagen=document.getElementById("efectosSonido");
	if(efectosSonido)
		imagen.src="imagenes/noefectos.png";
	else
		imagen.src="imagenes/efectos.png";
	efectosSonido=!efectosSonido;		//Cambia el valor de esta propiedad, para que en la funcion comprobar no se reproduzca nada al hacer click

}//fin efectos()

/*TRANSICIONES Y FIN DE JUEGO*/

function finDeJuego(){
	var padre=document.getElementById("padre");								
	var parrafo=document.createElement("p");								//Creamos un párrafo en el body
	parrafo.innerHTML="SE ACABO";
	parrafo.id="finjuego";													//Id para darle estilo desde el css
	padre.appendChild(parrafo);												//Añadimos el parrafo al body
	var casilla=document.getElementsByTagName("div")						//Cogemos todos los div 
	for(i=0;i<casilla.length;i++)											//Recorremos el array de div
	{
			if(casilla[i].id==0)									//Los que aun estaban tapados se pondrán a agua (se destaparán)
			{											
			casilla[i].style.backgroundImage="url(imagenes/agua.gif)";
			casilla[i].style.opacity="0.7";
			casilla[i].onclick="";
			}
	}		
	
	var tablero=document.getElementById("capagrande");						//Cogemos el tablero
	var opacidad=1;										//Variable que disminuirá para que se desvanezcan los elementos a finalizar la partida
	var limpiar=setInterval(	//Intervalo que irá haciendo todos los elementos transparentes
	function()
	{										
		tablero.style.opacity=opacidad;
		parrafo.style.opacity=opacidad;
		document.getElementById("leyenda").style.opacity=opacidad;
		for(i=0;i<numjug;i++)
				document.getElementById("jugador"+i).style.opacity=opacidad;
		if(opacidad<=0)									//Cuando todos son completamente invisiles, se eliminarán y se destruye el intervalo
		{														
			for(i=0;i<numjug;i++)
				padre.removeChild(document.getElementById("jugador"+i));

			padre.removeChild(document.getElementById("capagrande"));
			padre.removeChild(document.getElementById("finjuego"));
			padre.removeChild(document.getElementById("leyenda"));
			clearInterval(limpiar);
		}
		opacidad=opacidad-0.03;
	},60);			//Fin del intrevalo limpiar elementos (animacion)
	
	setTimeout(ponerMarcador,3000);		//Tiempo que pasa desde que finaliza la partida, hasta que aparece el marcador final, para que de tiempo a la animación anterior
		
}//fin finDeJuego()

function ponerMarcador(){									//Al tiempo de eliminarse todos los elementos, creamos el tablon final de puntuaciones
	var padre=document.getElementById("padre");
	var capa=document.createElement("div");		
	capa.id="tablonPuntuaciones";											//Id para dar estilos desde el css
	var puntuacion=document.createElement("p");
	puntuacion.innerHTML="PUNTUACION";
	puntuacion.id="puntuacion";
	capa.appendChild(puntuacion);											
	burbuja();				//Ordenamos el array de puntos de mayor a menor, usando sort, llamando a la funcion de comparacion, para mostrar luego los puntos ordenados
	for(i=0;i<numjug;i++)													//añado a la capa las puntuaciones
	{		
			puntuacion=document.createElement("p");
			puntuacion.innerHTML=nombres[i]+" : "+puntos[i];
			puntuacion.id="puntuaciones";
			if(i==0){puntuacion.style.fontSize="3.5em";}					//El que ha ganado aparecerá mas grande
			capa.appendChild(puntuacion);
	}

	padre.appendChild(capa);												//Se añade la capa al body
	var transparencia=0;													//Variable para que el tablon final aparezca poco a poco (esta variable se irá incrementando)
	
	var tablon=setInterval(		//Intervalo que hará que el tablón aparezca poco a poco, aumentando su opacidad
	function()				
	{										
		capa.style.opacity=transparencia;
		if(transparencia>=1)								//Cuando la transparencia alcance el valor deseado, finaliza el intervalo
			clearInterval(tablon);

		transparencia=transparencia+0.01;	
	},15);		//fin del intervalo aparecer tablon (animacion)													
	
	setTimeout(botonReiniciar,3000);		//Al acabar de poner las puntuaciones llama a una funcion para poner el boton de reiniciar
}//fin ponerMarcador()	
		
		
function botonReiniciar(){
	var padre=document.getElementById("padre");
	
	var botonReiniciar=document.createElement("div");				//Se crea el botón
	botonReiniciar.id="Reiniciar";		//Id para darle estilos distintos para el movil y el ordenador
	botonReiniciar.onclick=reiniciar;
	
	var parrafo=document.createElement("p");
	parrafo.id="sigFinal";
	parrafo.innerHTML="REINICIAR";
	
	botonReiniciar.appendChild(parrafo);
	padre.appendChild(botonReiniciar);
}//fin botonReiniciar()
		
function reiniciar(){		
	location.href = 'index.html';		//Esto lleva a una localización, en este caso la misma página, así se actualiza y se puede empezar de nuevo	
}		

function burbuja(){						//Metodo de la burbuja, ordena el array puntos,y segun este tambien va ordenando el array de nombres
	var aux,aux2;
    for(i=0;i<(puntos.length-1);i++)
	    for(j=0;j<(puntos.length-i);j++)
	    {
	        if(puntos[j]<puntos[j+1])
	        {
	             aux=puntos[j];
				 aux2=nombres[j];
				 
	             puntos[j]=puntos[j+1];
				 nombres[j]=nombres[j+1];
				 
	             puntos[j+1]=aux;
				 nombres[j+1]=aux2;
	        }
	    } 
}//fin burbuja()

/*FUNCIONES GENÉRICAS*/

function aleatorio(maximo,minimo){		//Aleatorio entre dos números, pasándole el máximo y el mínimo
	return Math.round(Math.random()*(maximo-minimo)+minimo);
}		

function eliminarElemento(padre,hijo){		//Elementos a eliminar, pasandole los ids del padre y el hijo
	var elim1=document.getElementById(padre);
	var elim2=document.getElementById(hijo);
	elim1.removeChild(elim2);
}