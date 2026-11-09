// reto.js — Cajero automático

// 1. Referencias
let formulario = document.getElementById("formulario");
let mensaje = document.getElementById("mensaje");
let historial = document.getElementById("historial");
let titularTexto = document.getElementById("titular");
let saldoFinalTexto = document.getElementById("saldoFinal");
let totalDepositadoTexto = document.getElementById("totalDepositado");
let totalRetiradoTexto = document.getElementById("totalRetirado");
let operacionesTexto = document.getElementById("operaciones");


// 3. Lógica
formulario.addEventListener("submit", procesarFormulario);

function agregarHistorial(texto) {
  let fila = document.createElement("li");
  fila.textContent = texto;
  historial.appendChild(fila);
}

function procesarFormulario(evento) {
  evento.preventDefault();
  historial.innerHTML = "";

  let titular = document.getElementById("titularEntrada").value.trim();
  let saldo = parseFloat(document.getElementById("saldoEntrada").value);
  let operacionesPendientes = document.getElementById("operacionesEntrada").value.trim();

  // Validación del titular y del saldo inicial
  if (titular === "" || Number.isNaN(saldo) || saldo < 0) {
    mensaje.textContent = "Ingresa un titular y un saldo inicial válidos.";
    return;
  }
  if (operacionesPendientes === "") {
    mensaje.textContent = "Ingresa al menos una operación.";
    return;
  }

  let totalDepositado = 0;
  let totalRetirado = 0;
  let operacionesExitosas = 0;
  let retirosExitosos = 0;
  let opcion = 0;

  do {
    // Extraer la siguiente operación (sin arreglos)
    let textoOperacion = "";
    let posicionPuntoComa = operacionesPendientes.indexOf(";");
    if (posicionPuntoComa === -1) {
      textoOperacion = operacionesPendientes.trim();
      operacionesPendientes = "";
    } else {
      textoOperacion = operacionesPendientes.slice(0, posicionPuntoComa).trim();
      operacionesPendientes = operacionesPendientes.slice(posicionPuntoComa + 1);
    }

    // Obtener la opción y el monto (si lo hay)
    opcion = parseInt(textoOperacion, 10);
    let monto = NaN;
    let posicionDosPuntos = textoOperacion.indexOf(":");
    if (posicionDosPuntos !== -1) {
      monto = parseFloat(textoOperacion.slice(posicionDosPuntos + 1));
    }

    if (opcion === 1) {
      agregarHistorial("Consulta de saldo: $" + saldo.toLocaleString("es-CO"));
      operacionesExitosas++;
    } else if (opcion === 2) {
      if (Number.isNaN(monto) || monto <= 0) {
        agregarHistorial("Depósito rechazado: el monto debe ser mayor que 0.");
      } else if (monto > 2000000) {
        agregarHistorial("Depósito rechazado: el máximo por depósito es $2.000.000.");
      } else {
        saldo += monto;
        totalDepositado += monto;
        operacionesExitosas++;
        agregarHistorial("Depósito exitoso: $" + monto.toLocaleString("es-CO"));
      }
    } else if (opcion === 3) {
      if (Number.isNaN(monto) || monto <= 0) {
        agregarHistorial("Retiro rechazado: el monto debe ser mayor que 0.");
      } else if (monto % 10000 !== 0) {
        agregarHistorial("Retiro rechazado: el monto debe ser múltiplo de $10.000 (" + monto.toLocaleString("es-CO") + ").");
      } else if (monto > saldo) {
        agregarHistorial("Retiro rechazado: saldo insuficiente (" + monto.toLocaleString("es-CO") + ").");
      } else if (retirosExitosos >= 3) {
        agregarHistorial("Retiro rechazado: máximo 3 retiros por sesión.");
      } else {
        saldo -= monto;
        totalRetirado += monto;
        retirosExitosos++;
        operacionesExitosas++;
        agregarHistorial("Retiro exitoso: $" + monto.toLocaleString("es-CO"));
      }
    } else if (opcion === 4) {
      agregarHistorial("Salida del cajero.");
    } else {
      agregarHistorial("Opción inválida: " + textoOperacion);
    }
  } while (opcion !== 4 && operacionesPendientes.trim() !== "");

  // Resumen final
  titularTexto.textContent = titular;
  saldoFinalTexto.textContent = "$" + saldo.toLocaleString("es-CO");
  totalDepositadoTexto.textContent = "$" + totalDepositado.toLocaleString("es-CO");
  totalRetiradoTexto.textContent = "$" + totalRetirado.toLocaleString("es-CO");
  operacionesTexto.textContent = operacionesExitosas;
  mensaje.textContent = "Sesión finalizada.";
}
