/* =============================================================
   Curso       : Diseño Web (24UC00351)
   Semana      : 10 — Funciones: alcance, flecha, argumentos y recursión
   Laboratorio : GL10 — Las piezas del carrito
   Docente     : Carlos del Carpio
   Institución : Universidad Continental
   ============================================================= */
(() => {
  const FUNCIONES = [
    "redondear", "importe", "sumar", "igvIncluido",
    "normalizarCodigo", "descuentoCupon", "costoEnvio",
    "rellenar", "codigoPedido", "mediasParaGratis", "maxCuotas", "crearContador",
  ];

  const PRECIOS = { runner: 249, mochila: 179, termo: 89 };

  const buscar = (nombre) => {
    try {
      const f = (0, eval)(nombre);
      return typeof f === "function" ? f : null;
    } catch (e) {
      return null;
    }
  };

  const falta = (nombre) => ({ estado: "falta", nombre });
  const listo = (valor) => ({ estado: "ok", valor });

  const llamar = (nombre, ...args) => {
    const f = buscar(nombre);
    if (!f) return falta(nombre);
    for (const a of args) {
      if (a && a.estado && a.estado !== "ok") return a;
    }
    const valores = args.map((a) => (a && a.estado === "ok" ? a.valor : a));
    try {
      return listo(f(...valores));
    } catch (e) {
      console.error(`Error dentro de ${nombre}():`, e);
      return { estado: "error", nombre, mensaje: `${e.name}: ${e.message}` };
    }
  };

  const valorDe = (r) => (r && r.estado === "ok" ? r.valor : undefined);

  const calcular = () => {
    const v = {};
    v.precioRunner = listo(PRECIOS.runner);
    v.precioMochila = listo(PRECIOS.mochila);
    v.precioTermo = listo(PRECIOS.termo);

    const cR = Number(entradaRunner);
    const cM = Number(entradaMochila);
    const cT = Number(entradaTermo);
    v.cantRunner = listo(cR);
    v.cantMochila = listo(cM);
    v.cantTermo = listo(cT);

    const enRango = [cR, cM, cT].every((c) => Number.isInteger(c) && c >= 0 && c <= 10);
    v.valido = enRango && cR + cM + cT > 0;
    v.mensajeError = !enRango
      ? "Cada cantidad debe ser un número entero entre 0 y 10."
      : (cR + cM + cT === 0 ? "Tu carrito está vacío." : "");
    v.unidades = listo(cR + cM + cT);

    v.importeRunner = llamar("importe", PRECIOS.runner, cR);
    v.importeMochila = llamar("importe", PRECIOS.mochila, cM);
    v.importeTermo = llamar("importe", PRECIOS.termo, cT);
    v.subtotal = llamar("sumar", v.importeRunner, v.importeMochila, v.importeTermo);

    v.descuento = llamar("descuentoCupon", entradaCupon, v.subtotal, v.importeRunner);
    const codigo = llamar("normalizarCodigo", entradaCupon);
    const desc = valorDe(v.descuento);
    const cod = valorDe(codigo);
    v.mensajeCupon = listo(
      typeof cod !== "string" || cod === "" ? "" :
      typeof desc === "number" && desc > 0 ? `${cod} aplicado` : `${cod} no aplica a este pedido`
    );

    const neto = llamar("redondear", (valorDe(v.subtotal) ?? NaN) - (valorDe(v.descuento) ?? NaN));
    if (v.subtotal.estado !== "ok") v.neto = v.subtotal;
    else if (v.descuento.estado !== "ok") v.neto = v.descuento;
    else v.neto = neto;

    v.envio = llamar("costoEnvio", entradaEntrega, entradaDistrito, v.neto);
    const env = valorDe(v.envio);
    v.mensajeEnvio = listo(
      typeof env !== "number" ? "" :
      entradaEntrega === "recojo" ? "recojo en el campus" :
      env === 0 ? "delivery gratis" : `delivery a ${entradaDistrito}`
    );

    v.total = v.envio.estado === "ok"
      ? llamar("redondear", valorDe(v.neto) + env)
      : v.envio;
    v.igv = llamar("igvIncluido", v.total);
    v.base = v.igv.estado === "ok"
      ? llamar("redondear", valorDe(v.total) - valorDe(v.igv))
      : v.igv;

    v.maxCuotas = llamar("maxCuotas", v.total);
    const mx = valorDe(v.maxCuotas);
    const tot = valorDe(v.total);
    v.plan = [];
    if (Number.isInteger(mx) && mx >= 1 && mx <= 6 && typeof tot === "number") {
      for (let n = 1; n <= mx; n++) v.plan.push(`${n} x S/ ${(tot / n).toFixed(2)}`);
    }

    v.mediasSugeridas = v.valido && entradaEntrega === "delivery" && typeof env === "number" && env > 0
      ? llamar("mediasParaGratis", v.neto)
      : listo(0);

    return v;
  };

  const formatear = (celda, r, formato) => {
    celda.classList.remove("pendiente", "tipo-texto", "tipo-error");
    celda.removeAttribute("title");
    if (!r || r.estado === "falta") {
      celda.textContent = formato === "texto" ? "" : "—";
      celda.classList.add("pendiente");
      if (r) celda.title = `Falta la función ${r.nombre}()`;
      return;
    }
    if (r.estado === "error") {
      celda.textContent = "error";
      celda.classList.add("tipo-error");
      celda.title = `${r.nombre}(): ${r.mensaje}`;
      return;
    }
    const valor = r.valor;
    if (formato === "texto") {
      celda.textContent = valor ? `· ${valor}` : "";
      return;
    }
    if (formato === "codigo") {
      celda.textContent = String(valor);
      if (typeof valor !== "string") {
        celda.classList.add("tipo-error");
        celda.title = "codigoPedido() debe devolver un string";
      }
      return;
    }
    if (typeof valor === "string") {
      celda.textContent = `"${valor}"`;
      celda.classList.add("tipo-texto");
      celda.title = "Se esperaba un number y llegó un string";
      return;
    }
    if (typeof valor !== "number" || Number.isNaN(valor)) {
      celda.textContent = String(valor);
      celda.classList.add("tipo-error");
      celda.title = `Valor recibido: ${String(valor)}`;
      return;
    }
    if (formato === "cantidad") celda.textContent = String(valor);
    else if (formato === "resta") celda.textContent = valor > 0 ? `− S/ ${valor.toFixed(2)}` : "S/ 0.00";
    else celda.textContent = `S/ ${valor.toFixed(2)}`;
  };

  let siguientePedido = null;
  let numeroActual = Number(entradaPedido);

  const prepararContador = () => {
    const r = llamar("crearContador", numeroActual);
    if (r.estado !== "ok" || typeof r.valor !== "function") return { estado: r.estado === "ok" ? "error" : r.estado, nombre: "crearContador", mensaje: "debe devolver una función" };
    siguientePedido = r.valor;
    return listo(siguientePedido());
  };

  const codigoActual = (numero) => (numero.estado === "ok" ? llamar("codigoPedido", numero) : numero);

  const pintar = (v, codigo) => {
    const todo = { ...v, codigo };
    document.querySelectorAll("[data-valor]").forEach((celda) => {
      formatear(celda, todo[celda.dataset.valor], celda.dataset.formato || "soles");
    });

    const listas = FUNCIONES.filter((n) => buscar(n));
    const estado = document.getElementById("estado");
    if (listas.length === 0) {
      estado.textContent = "Todavía no hay funciones en funciones.js. Si ya escribiste alguna, abre la consola (F12) y lee el primer error en rojo.";
      estado.className = "estado estado--alerta";
    } else {
      const faltan = FUNCIONES.filter((n) => !listas.includes(n));
      estado.textContent = faltan.length
        ? `Funciones listas: ${listas.length} de ${FUNCIONES.length}. Faltan: ${faltan.join(", ")}.`
        : `Funciones listas: ${FUNCIONES.length} de ${FUNCIONES.length}.`;
      estado.className = faltan.length ? "estado" : "estado estado--ok";
    }

    const error = document.getElementById("error");
    const ticket = document.getElementById("ticket");
    error.hidden = v.valido;
    error.textContent = v.mensajeError;
    ticket.classList.toggle("ticket--invalido", !v.valido);

    const lista = document.getElementById("cuotas");
    lista.innerHTML = "";
    v.plan.forEach((linea) => {
      const li = document.createElement("li");
      li.textContent = linea;
      lista.append(li);
    });

    const medias = valorDe(v.mediasSugeridas);
    document.getElementById("sugerencia").classList.toggle("extra--activo", typeof medias === "number" && medias > 0);

    const total = valorDe(v.total);
    const boton = document.getElementById("confirmar");
    boton.textContent = typeof total === "number" && Number.isFinite(total)
      ? `Confirmar pedido · S/ ${total.toFixed(2)}`
      : "Confirmar pedido";
    boton.disabled = !v.valido;
  };

  const sincronizarFormulario = () => {
    const form = document.getElementById("form-eleccion");
    const datos = new URLSearchParams(location.search);
    for (const [clave, valor] of datos) {
      const campo = form.elements[clave];
      if (campo) campo.value = valor;
    }
    form.elements.pedido.value = String(numeroActual);
  };

  sincronizarFormulario();
  const datos = calcular();
  let numero = prepararContador();
  let codigo = codigoActual(numero);
  pintar(datos, codigo);

  document.getElementById("confirmar").addEventListener("click", () => {
    const registro = document.getElementById("registro");
    if (!siguientePedido || codigo.estado !== "ok") {
      registro.textContent = "Para registrar pedidos faltan crearContador() o codigoPedido().";
      return;
    }
    const registrado = codigo.valor;
    numeroActual = numero.valor;
    numero = listo(siguientePedido());
    codigo = codigoActual(numero);
    document.getElementById("form-eleccion").elements.pedido.value = String(numeroActual);
    pintar(datos, codigo);
    registro.textContent = `Pedido ${registrado} registrado. El siguiente será ${valorDe(codigo) ?? "—"}.`;
  });
})();
