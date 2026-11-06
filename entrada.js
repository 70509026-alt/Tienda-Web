/* =============================================================
   Curso       : Diseño Web (24UC00351)
   Semana      : 10 — Funciones: alcance, flecha, argumentos y recursión
   Laboratorio : GL10 — Las piezas del carrito
   Docente     : Carlos del Carpio
   Institución : Universidad Continental
   ============================================================= */
const consulta = new URLSearchParams(location.search);

const entradaRunner = consulta.get("runner") ?? "1";
const entradaMochila = consulta.get("mochila") ?? "1";
const entradaTermo = consulta.get("termo") ?? "2";
const entradaEntrega = consulta.get("entrega") ?? "recojo";
const entradaDistrito = consulta.get("distrito") ?? "Cercado";
const entradaCupon = consulta.get("cupon") ?? "";
const entradaPedido = consulta.get("pedido") ?? "41";
