
const nombre = document.getElementById("nombre");
const btnEnviar = document.getElementById("btnEnviar");
const mensaje = document.getElementById("mensaje");
const botonGuardar = document.getElementById("guardarNombre");
const botonEliminar = document.getElementById("eliminarNombre");
const botonGuardarPuntaje = document.getElementById("Guardar puntaje");
const contenedorCards = document.querySelector(".cards");
let puntos = 0;
let preguntasRespondidas = 0;

//preguntas de la trivia desde el json//
fetch("preguntas.json")
  .then((respuesta) => respuesta.json())
  .then((data) => {
    iniciarTrivia(data); // función que carga las preguntas en pantalla
  })
  .catch((error) => {
    console.error("Error al cargar las preguntas:", error);
  });


// Objeto jugador
const jugador = {
  nombre: "",
  puntaje: 0,
  respuestas: [],
  ganoEntradas: false
};

// array de preguntas se generó un json aparte para un código más limpio//

// Cargar nombre
btnEnviar.addEventListener("click", () => {
  const nuevoTexto = nombre.value.trim();
  if (nuevoTexto !== "") {
    jugador.nombre = nuevoTexto;
    mensaje.textContent = `¡Hola, ${nuevoTexto}! Bienvenido/a a la trivia.`;
  } else {
    mensaje.textContent = "Debes ingresar un texto válido.";
  }
});

// Guardar jugador en localStorage
botonGuardar.addEventListener("click", () => {
  localStorage.setItem("jugador", JSON.stringify(jugador));
  alert("Datos guardados correctamente.");
});

// Eliminar jugador
botonEliminar.addEventListener("click", () => {
  localStorage.removeItem("jugador");
  alert("Datos eliminados.");
});

// Cargar preguntas dinámicamente. Se crea una función "iniciar trivia"//
function iniciarTrivia(preguntas) {
  preguntas.forEach((preguntaObj, index) => {
    const card = document.createElement("div");
    card.className = "card";

    const pregunta = document.createElement("p");
    pregunta.className = "pregunta";
    pregunta.textContent = preguntaObj.texto;

    const opciones = document.createElement("div");
    opciones.className = "opciones";

    preguntaObj.opciones.forEach((opcion) => {
      const boton = document.createElement("button");
      boton.className = "btn";
      boton.textContent = opcion.texto;
      boton.dataset.correcto = opcion.correcto;

      boton.addEventListener("click", () => {
        manejarRespuesta(boton, card, opcion.correcto);
      });

      opciones.appendChild(boton);
    });

    const respuesta = document.createElement("div");
    respuesta.className = "respuesta";

    card.appendChild(pregunta);
    card.appendChild(opciones);
    card.appendChild(respuesta);

    contenedorCards.appendChild(card);
  });
}


// Función que maneja la respuesta
function manejarRespuesta(boton, card, esCorrecta) {
  const respuesta = card.querySelector(".respuesta");
  const textoPregunta = card.querySelector(".pregunta").textContent;
  const textoOpcion = boton.textContent;

  jugador.respuestas.push({
    pregunta: textoPregunta,
    respuestaDada: textoOpcion,
    correcta: esCorrecta
  });

  if (esCorrecta) {
    puntos += 30;
    jugador.puntaje = puntos;
    boton.style.backgroundColor = "#4CAF50"; // verde
    boton.style.color = "white";
    respuesta.textContent = "¡Correcto!";
    respuesta.style.color = "#4CAF50";
  } else {
    puntos -= 10;
    jugador.puntaje = puntos;
    boton.style.backgroundColor = "#f44336"; // rojo
    boton.style.color = "white";
    respuesta.textContent = "Incorrecto.";
    respuesta.style.color = "#f44336";
  }

  preguntasRespondidas++;

  // Mostrar resultado final
  if (preguntasRespondidas === preguntas.length) {
    const puntosGanador = document.getElementById("puntosGanador");
    if (puntos >= 200) {
      jugador.ganoEntradas = true;
      puntosGanador.textContent = "🎉 ¡Ganaste 2 entradas al teatro! 🎭";
      puntosGanador.style.color = "#9C27B0";
    } else {
      jugador.ganoEntradas = false;
      puntosGanador.textContent = "😢 Estuviste cerca, será la próxima.";
      puntosGanador.style.color = "#8D6E63";
    }
  }


  // Deshabilitar todos los botones de esta tarjeta
  const botones = card.querySelectorAll(".btn");
  botones.forEach((btn) => {
    btn.disabled = true;
  });

  // Actualizar puntaje en pantalla
  document.getElementById("puntuacion").textContent = puntos;
}
