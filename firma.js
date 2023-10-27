//Obtenemos referencias a los elementos HTML
const canvas = document.querySelector('canvas');
const form = document.querySelector('.firma-pad-form');
const botonLimpiar = document.querySelector('.boton-limpiar');
const botonImagen = document.querySelector('.boton-imagen');
const botonContrato = document.querySelector('.boton-contrato');

//Obtenemos el contexto del canvas para dibujar en 3D
const ctx = canvas.getContext('2d');
//Bandera que indica si ya comenzamos a presionar el boton del mouse sin soltarlo
let modoEscritura = false;
//Variables para guardar la posicion del cursos
let xAnterior = o, yAnterior = 0, xActual = 0, yActual = 0;
//variables de estilo
const COLOR = 'blue';
const GROSOR = 2;

//Boton enviar del form
form.addEventListener('submit', (e) => {
    //Previene que se envie el formulario
    e.preventDefault();

    //Borramos la imagen anterior para poner la nueva a enviar
    const resultadoContenedor = document.querySelector('.firma-resultado-contenedor');
    const imagenAnterior = document.querySelector('.forma-imagen');
    if(imagenAnterior){
        imagenAnterior.remove
    }
    //Creamos la nueva imagen con lo que tenga el canvas
    const imagenURL = canvas.toDataURL();
    const imagen = document.createElement('img');
    imagen.src = imagenURL;
    imagen.height = canvas.height;
    imagen.width = canvas.width;
    imagen.classList.add('firma-imagen');
    //Agregamos la imagen al HTML
    resultadoContenedor.appendChild(imagen);
    //Limpiamos el Canvas
    limpiarPad();
});

//funcion que limpia el canvas poniendole un fondo blanco
const limpiarPad = () => {
    ctx.fillStyle = 'while';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
limpiarPad();

//Evento click del link "limpiar"
botonLimpiar.addEventListener('click', (e) => {
    //Previene que se ejecute el link
    e.preventDefault();
    limpiarPad();
});

//Clic para descargar la imagen de la firma
botonImagen.addEventListener('click', (e) => {
    //Previene que se ejecute el link
    e.preventDefault();

    const enlace = document.createElement('a');
    //Titulo de la imagen
    enlace.download = "Firma.png";
    //Convertir la firma a Base64 y ponerlo en el enlace
    enlace.href = canvas.toDataURL();
    //Click en el enlace para descargar
    enlace.click();
});

window.obtenerImagen = () => {
    return canvas.toDataURL();
};

botonContrato.addEventListener('click', (e) => {
    //Previene que se ejecute el link
    e.preventDefault();

    //Abre una ventana nueva hija
    const ventana = window.open('contrato.html');
});

//Obtiene la posicion del cursor REVISAR
const obtenerPosicionCursor = (e) => {
    positionX = e.clientX - e.target.getBounfingClientRect().left;
    positionY = e.clientY - e.target.getBounfingClientRect().top;

    return [positionX, positionY];
};

const OnClicOToqueIniciado = (e) => {
    modoEscritura = true;
    [xActual, yActual] = obtenerPosicionCursor(e);

    ctx.beginPath();
    ctx.fillStyle = COLOR;
    ctx.fillRect(xActual, yActual, GROSOR, GROSOR);
    ctx.closePath();
}

//AL mover el dedo o en el mouse sin despegarlo dibujamos las lineas
const OnMouseODedoMovido = (e) => {
    if(!modoEscritura) return;

    let target = e;
    if(e.type.includes("touch")){
        target = e.touches[0]; //Solo un dedo
    }
    xAnterior = xActual;
    yAnterior = yActual;
    [xActual, yActual] = obtenerPosicionCursor(target);

    ctx.beginPath();
    ctx.lineWidth = GROSOR;
    ctx.strokeStyle = COLOR;
    ctx.moveTo(xAnterior, yAnterior);
    ctx.lineTo(xActual, yActual);
    ctx.stroke();
    ctx.closePath();
}

//AL levantar el dedo o el mouse, dejamos de dibujar lineas
function OnClicDedoLEvantado(){
    modoEscritura = false;
}

//Eventos al iniciar el trazado
['mousedown', 'touchstart'].forEach(nombreEvento => {
    canvas.addEventListener(nombreEvento, OnClicOToqueIniciado, { passive: true});
});

//Eventos al mover el mouse o dedo en el trazado
['mousemove', 'touchmove'].forEach(nombreEvento => {
    canvas.addEventListener(nombreEvento, OnMouseODedoMovido, {passive: true});
});

//Al levantar el dedo o el mouse
['mouseup', 'touchend'].forEach(nombreEvento => {
    canvas.addEventListener(nombreEvento, OnClicDedoLEvantado, {passive: true});
})