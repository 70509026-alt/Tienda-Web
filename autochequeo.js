/* =============================================================
   Curso       : Diseño Web (24UC00351)
   Semana      : 10 — Funciones: alcance, flecha, argumentos y recursión
   Laboratorio : GL10 — Las piezas del carrito · autochequeo
   Docente     : Carlos del Carpio
   Institución : Universidad Continental
   ============================================================= */
(() => {
  const buscar = (nombre) => {
    try {
      const f = (0, eval)(nombre);
      return typeof f === "function" ? f : null;
    } catch (e) {
      return null;
    }
  };

  const cerca = (a, b) => typeof a === "number" && Math.abs(a - b) < 1e-9;

  const esFlecha = (f) => typeof f === "function" && !("prototype" in f) && !/^\s*(async\s+)?function\b/.test(f.toString());
  const esDeclaracion = (f) => typeof f === "function" && /^\s*function\b/.test(f.toString());

  const cuerpo = (f) => {
    const s = f.toString();
    const i = s.indexOf("{");
    const flecha = s.indexOf("=>");
    if (flecha >= 0 && (i < 0 || flecha < i)) return s.slice(flecha + 2);
    return i >= 0 ? s.slice(i) : s;
  };
  const sinComentarios = (t) => t.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
  const recursiva = (f, nombre) => {
    const c = sinComentarios(cuerpo(f));
    return new RegExp(`\\b${nombre}\\s*\\(`).test(c) && !/\b(for|while)\b/.test(c);
  };

  const PRUEBAS = [
    ["A1", "redondear(0.1 + 0.2) devuelve 0.3", (f) => cerca(f.redondear(0.1 + 0.2), 0.3)],
    ["A1", "redondear(92.44067) devuelve 92.44 y redondear(513.559) devuelve 513.56", (f) => cerca(f.redondear(92.44067), 92.44) && cerca(f.redondear(513.559), 513.56)],
    ["A1", "redondear es una función flecha", (f) => esFlecha(f.redondear)],

    ["A2", "importe(249, 1) devuelve 249 e importe(89, 2) devuelve 178", (f) => f.importe(249, 1) === 249 && f.importe(89, 2) === 178],
    ["A2", "importe(19.9, 3) devuelve 59.7 (ya redondeado)", (f) => cerca(f.importe(19.9, 3), 59.7)],
    ["A2", "importe está escrita como declaración de función", (f) => esDeclaracion(f.importe)],

    ["A3", "sumar(249, 179, 178) devuelve 606", (f) => cerca(f.sumar(249, 179, 178), 606)],
    ["A3", "sumar() sin argumentos devuelve 0", (f) => f.sumar() === 0],
    ["A3", "sumar(0.1, 0.2) devuelve 0.3 y sumar(5) devuelve 5", (f) => cerca(f.sumar(0.1, 0.2), 0.3) && cerca(f.sumar(5), 5)],
    ["A3", "sumar recibe cualquier cantidad de argumentos con un parámetro rest", (f) => f.sumar.length === 0 && /\.\.\.\s*[A-Za-z_$]/.test(f.sumar.toString())],

    ["A4", "igvIncluido(606) devuelve 92.44", (f) => cerca(f.igvIncluido(606), 92.44)],
    ["A4", "igvIncluido(836) devuelve 127.53", (f) => cerca(f.igvIncluido(836), 127.53)],
    ["A4", "igvIncluido(110, 0.10) devuelve 10 (otra tasa)", (f) => cerca(f.igvIncluido(110, 0.10), 10)],
    ["A4", "La tasa tiene valor por defecto: igvIncluido.length es 1", (f) => f.igvIncluido.length === 1],

    ["B1", "normalizarCodigo(\"  conti10 \") devuelve \"CONTI10\"", (f) => f.normalizarCodigo("  conti10 ") === "CONTI10" && f.normalizarCodigo("") === ""],
    ["B1", "normalizarCodigo es una función flecha", (f) => esFlecha(f.normalizarCodigo)],
    ["B1", "CONTI10 sobre S/ 606 descuenta 60.60", (f) => cerca(f.descuentoCupon("CONTI10", 606, 249), 60.6)],
    ["B1", "« conti10 » con espacios y minúsculas también descuenta 60.60", (f) => cerca(f.descuentoCupon(" conti10 ", 606, 249), 60.6)],
    ["B1", "BIENVENIDA descuenta 30 si el subtotal llega a S/ 200", (f) => cerca(f.descuentoCupon("BIENVENIDA", 606, 249), 30) && cerca(f.descuentoCupon("bienvenida", 200, 0), 30)],
    ["B1", "BIENVENIDA no descuenta con un subtotal de S/ 89", (f) => f.descuentoCupon("BIENVENIDA", 89, 0) === 0],
    ["B1", "RUNNER20 descuenta 49.80 (20 % del Runner, no del subtotal)", (f) => cerca(f.descuentoCupon("RUNNER20", 606, 249), 49.8)],
    ["B1", "Un código inexistente o vacío devuelve 0", (f) => f.descuentoCupon("XYZ", 606, 249) === 0 && f.descuentoCupon("", 606, 249) === 0],

    ["B2", "Recojo en el campus: 0", (f) => f.costoEnvio("recojo", "Cercado", 606) === 0],
    ["B2", "Delivery a Cayma con neto 606: 10", (f) => f.costoEnvio("delivery", "Cayma", 606) === 10],
    ["B2", "Delivery a Socabaya o Cerro Colorado con neto 606: 15", (f) => f.costoEnvio("delivery", "Socabaya", 606) === 15 && f.costoEnvio("delivery", "Cerro Colorado", 606) === 15],
    ["B2", "Delivery con neto 855: 0 en cualquier distrito", (f) => f.costoEnvio("delivery", "Cayma", 855) === 0 && f.costoEnvio("delivery", "Socabaya", 855) === 0],
    ["B2", "Neto 545.40 a Cayma: 10 (no llega al mínimo)", (f) => f.costoEnvio("delivery", "Cayma", 545.4) === 10],
    ["B2", "El mínimo es un parámetro con valor por defecto: con 600, un neto de 606 sale gratis", (f) => f.costoEnvio.length === 3 && f.costoEnvio("delivery", "Cayma", 606, 600) === 0],

    ["B3", "rellenar(42, 6) devuelve \"000042\" y rellenar(7, 3) devuelve \"007\"", (f) => f.rellenar(42, 6) === "000042" && f.rellenar(7, 3) === "007"],
    ["B3", "rellenar no recorta: rellenar(123456, 3) devuelve \"123456\"", (f) => f.rellenar(123456, 3) === "123456"],
    ["B3", "rellenar(0, 2) devuelve \"00\" (un string)", (f) => f.rellenar(0, 2) === "00"],
    ["B3", "codigoPedido(42) devuelve \"EC-000042\"", (f) => f.codigoPedido(42) === "EC-000042" && f.codigoPedido(1234567) === "EC-1234567"],
    ["B3", "codigoPedido reutiliza rellenar en lugar de repetir su lógica", (f) => /\brellenar\s*\(/.test(sinComentarios(cuerpo(f.codigoPedido)))],

    ["B4", "mediasParaGratis(606) devuelve 3 y mediasParaGratis(545.4) devuelve 6", (f) => f.mediasParaGratis(606) === 3 && f.mediasParaGratis(545.4) === 6],
    ["B4", "mediasParaGratis(650) y mediasParaGratis(700) devuelven 0", (f) => f.mediasParaGratis(650) === 0 && f.mediasParaGratis(700) === 0],
    ["B4", "mediasParaGratis(600, 10, 650) devuelve 5 (otros valores)", (f) => f.mediasParaGratis(600, 10, 650) === 5 && f.mediasParaGratis.length === 1],
    ["B4", "mediasParaGratis es recursiva (se llama a sí misma, sin for ni while)", (f) => recursiva(f.mediasParaGratis, "mediasParaGratis")],
    ["B4", "maxCuotas: 606 → 6, 179 → 3, 89 → 1", (f) => f.maxCuotas(606) === 6 && f.maxCuotas(179) === 3 && f.maxCuotas(89) === 1],
    ["B4", "maxCuotas: 120 → 2 y 299.99 → 5", (f) => f.maxCuotas(120) === 2 && f.maxCuotas(299.99) === 5],
    ["B4", "maxCuotas es recursiva (se llama a sí misma, sin for ni while)", (f) => recursiva(f.maxCuotas, "maxCuotas")],

    ["B5", "crearContador(41) devuelve una función", (f) => typeof f.crearContador(41) === "function"],
    ["B5", "Ese contador devuelve 42, luego 43, luego 44", (f) => { const c = f.crearContador(41); return c() === 42 && c() === 43 && c() === 44; }],
    ["B5", "Dos contadores no comparten memoria", (f) => { const a = f.crearContador(41); const b = f.crearContador(0); a(); a(); return b() === 1 && a() === 44 && b() === 2; }],
  ];

  const NOMBRES = ["redondear", "importe", "sumar", "igvIncluido", "normalizarCodigo", "descuentoCupon",
    "costoEnvio", "rellenar", "codigoPedido", "mediasParaGratis", "maxCuotas", "crearContador"];

  const propiasDeVentana = () => {
    const marco = document.createElement("iframe");
    marco.hidden = true;
    document.body.append(marco);
    const limpias = new Set(Object.getOwnPropertyNames(marco.contentWindow));
    marco.remove();
    return limpias;
  };

  const boton = document.createElement("button");
  boton.type = "button";
  boton.className = "autochequeo__boton";
  boton.textContent = "Autochequeo";

  const caja = document.createElement("section");
  caja.className = "autochequeo";
  caja.hidden = true;
  caja.setAttribute("aria-live", "polite");

  const ejecutar = () => {
    const f = {};
    NOMBRES.forEach((n) => { f[n] = buscar(n); });
    const limpias = propiasDeVentana();
    const antes = new Set(Object.getOwnPropertyNames(window));

    const filas = PRUEBAS.map(([parte, texto, prueba]) => {
      let ok = false;
      try { ok = !!prueba(f); } catch (e) { ok = false; }
      return { parte, texto, ok };
    });

    const despues = Object.getOwnPropertyNames(window);
    const filtradas = despues.filter((n) => !limpias.has(n) && !NOMBRES.includes(n) && !/^(on|webkit|__)/.test(n));
    const nuevas = despues.filter((n) => !antes.has(n));
    const fugas = [...new Set([...filtradas, ...nuevas])].filter((n) => !NOMBRES.includes(n) && typeof window[n] !== "function");
    filas.push({
      parte: "Todas",
      texto: fugas.length
        ? `Variables globales sin declarar: ${fugas.join(", ")}`
        : "Ninguna función crea variables globales sin declarar",
      ok: fugas.length === 0,
    });

    const bien = filas.filter((x) => x.ok).length;
    caja.innerHTML = `<h2>Autochequeo · ${bien} de ${filas.length}</h2>`;
    const lista = document.createElement("ul");
    filas.forEach((x) => {
      const li = document.createElement("li");
      li.className = x.ok ? "ok" : "falla";
      li.textContent = `${x.ok ? "✓" : "✗"} ${x.parte} · ${x.texto}`;
      lista.append(li);
    });
    caja.append(lista);
    const cerrar = document.createElement("button");
    cerrar.type = "button";
    cerrar.textContent = "Cerrar";
    cerrar.addEventListener("click", () => { caja.hidden = true; });
    caja.append(cerrar);
    caja.hidden = false;
    console.table(filas);
  };

  boton.addEventListener("click", ejecutar);
  document.body.append(boton, caja);
})();
