/* =============================================================
   Curso       : Diseño Web (24UC00351)
   Semana      : 10 — Funciones: alcance, flecha, argumentos y recursión
   Laboratorio : GL10 — Las piezas del carrito
   Docente     : Carlos del Carpio
   Institución : Universidad Continental
   ============================================================= */

// TODO A1
const redondear = (valor) => Math.round(valor * 100) / 100;

// TODO A2
function importe(precio, cantidad) {
   return redondear(precio * cantidad)
}

// TODO A3
function sumar (...numeros) {
   let acumulado = 0;
   for (const n of numeros) {
      acumulado += n;
   }
   return redondear(acumulado);
}


// TODO A4
const igvIncluido = (total, tasa = 0.18) => redondear (total * tasa / (1 + tasa));

// TODO B1
const normalizarCodigo = (texto) => texto.trim().toUpperCase();

function descuentoCupon(codigo, subtotal, importeRunner) {
   let descuento = 0;
   switch (normalizarCodigo(codigo)) {
      case "CONTI10":
         descuento = subtotal * 0.10;
         break;
      case "BIENVENIDA":
         if (subtotal >= 200) {
            descuento = 30;
         }
         break;
      case "RUNNER20":
         descuento = importeRunner * 0.20;
         break;
      default:
         descuento = 0;
   }
   return redondear (descuento);
}

// TODO B2

function costoEnvio(entrega, distrito, neto, minimoGratis = 650) {
  if (entrega === "recojo") {
    return 0;
  }
  if (neto >= minimoGratis) {
    return 0;
  }
  if (distrito === "Cerro Colorado" || distrito === "Socabaya") {
    return 15;
  }
  return 10;
}
// TODO B3

function rellenar(numero, ancho) {
  let texto = String(numero);
  while (texto.length < ancho) {
    texto = "0" + texto;
  }
  return texto;
}

const codigoPedido = (numero) => "EC-" + rellenar(numero, 6);

// TODO B4

function mediasParaGratis(neto, precioMedias = 19.9, meta = 650) {
  if (neto >= meta) {
    return 0; 
  }
  return 1 + mediasParaGratis(neto + precioMedias, precioMedias, meta);
}


function maxCuotas(total, n = 6) {
  if (n === 1 || total / n >= 50) {
    return n; 
  }
  return maxCuotas(total, n - 1); 
}

// TODO B5

function crearContador(inicio) {
  let actual = inicio; 
  return () => {
    actual += 1;
    return actual;
  };
}

console.log("funciones.js cargado");
