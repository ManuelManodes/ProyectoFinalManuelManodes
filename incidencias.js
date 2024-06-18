$(document).ready(() => {
  const $incidenciaForm = $("#incidenciaForm");
  const $incidenciasTableBody = $("#incidenciasTableBody");

  // Función para guardar incidencias en localStorage
  function saveIncidenciasToLocalStorage(incidencias) {
    localStorage.setItem("incidencias", JSON.stringify(incidencias));
  }

  // Función para cargar incidencias desde localStorage
  function loadIncidenciasFromLocalStorage() {
    const incidencias = localStorage.getItem("incidencias");
    return incidencias ? JSON.parse(incidencias) : [];
  }

  // Función para renderizar las incidencias en la tabla
  function renderIncidenciasTable(incidencias) {
    $incidenciasTableBody.empty();
    incidencias.forEach((incidencia) => {
      const newRow = `
        <tr>
          <td>${incidencia["nombre-colegio"]}</td>
          <td>${incidencia["descripcion-incidencia"]}</td>
          <td>${new Date(incidencia.fecha).toLocaleString()}</td>
        </tr>
      `;
      $incidenciasTableBody.append(newRow);
    });
  }

  // Cargar y renderizar incidencias al iniciar la página
  const incidencias = loadIncidenciasFromLocalStorage();
  renderIncidenciasTable(incidencias);

  // Manejar el evento de envío del formulario de incidencias
  $incidenciaForm.on("submit", (event) => {
    event.preventDefault();

    const nuevaIncidencia = {
      fecha: new Date().toISOString(),
    };

    const inputs = $incidenciaForm.find("input, textarea, select");
    inputs.each(function () {
      nuevaIncidencia[this.name] = this.value;
    });

    incidencias.push(nuevaIncidencia);

    saveIncidenciasToLocalStorage(incidencias);
    renderIncidenciasTable(incidencias);

    $incidenciaForm[0].reset();
  });
});
