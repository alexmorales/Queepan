// Función para leer parámetros de la URL
function getParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    id: parseInt(params.get("id") || "1"),
    formato: params.get("formato") || "vertical"
  };
}

// Cargar productos y renderizar en index.html
async function cargarGaleria() {
  const res = await fetch("/data/productos.json");
  const productos = await res.json();
  const contenedor = document.getElementById("galeria");

  productos.forEach(prod => {
    const card = document.createElement("div");
    card.className = "col-md-4 mb-4";
    card.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="/img/producto1.png" class="card-img-top" alt="${prod.nombre}">
        <div class="card-body">
          <h5 class="card-title">${prod.nombre}</h5>
          <p class="card-text">Haz clic para ver la información nutricional.</p>
          <a href="/detalle.html?id=${prod.id}&formato=vertical" class="btn btn-warning">Ver detalle</a>
        </div>
      </div>
    `;
    contenedor.appendChild(card);
  });
}

// Cargar detalles del producto en detalle.html
async function cargarDetalle() {
  const { id, formato } = getParams();
  const res = await fetch("/data/productos.json");
  const productos = await res.json();
  const producto = productos.find(p => p.id === id);
  if (!producto) return;

  document.getElementById("nombreProducto").textContent = producto.nombre;
  document.getElementById("formatoSelect").value = formato;
  renderDetalle(producto, formato);

  // Cambiar formato desde el selector
  document.getElementById("formatoSelect").addEventListener("change", (e) => {
    const nuevoFormato = e.target.value;
    window.location.href = `/detalle.html?id=${id}&formato=${nuevoFormato}`;
  });
}

// Renderizar detalle en HTML
function renderDetalle(producto, formato) {
  const contenedor = document.getElementById("detalleProducto");
  const datos = producto.presentaciones[formato];
  contenedor.innerHTML = "";

  if (formato === "tabular") {
    let tabla = `<div class="table-responsive"><table class="table table-bordered"><thead><tr>`;
    Object.keys(datos[0]).forEach(key => tabla += `<th>${key}</th>`);
    tabla += `</tr></thead><tbody>`;
    datos.forEach(fila => {
      tabla += "<tr>";
      Object.values(fila).forEach(valor => tabla += `<td>${valor}</td>`);
      tabla += "</tr>";
    });
    tabla += "</tbody></table></div>";
    contenedor.innerHTML = tabla;

  } else if (formato === "vertical") {
    contenedor.innerHTML = `
      <ul class="list-group">
        ${datos.map(item => `<li class="list-group-item d-flex justify-content-between"><strong>${item["Nutriente"]}</strong><span>${item["Por 100 g"]} / ${item["Por porción"]}</span></li>`).join("")}
      </ul>
    `;
  } else if (formato === "lineal") {
    contenedor.innerHTML = datos.map(item => `<p>${item["Texto"]}</p>`).join("");
  }
}

// Detección automática por página
document.addEventListener("DOMContentLoaded", () => {
  if (document.body.id === "index") {
    cargarGaleria();
  } else if (document.body.id === "detalle") {
    cargarDetalle();
  }
});
