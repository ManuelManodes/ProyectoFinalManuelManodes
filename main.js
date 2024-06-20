$(document).ready(() => {
  console.log("JavaScript is loaded and ready to add functionality.");

  const $form = $("#formUsuario");
  const $tablaUsuarios = $("#tablaUsuarios tbody");
  const $buscarRutInput = $("#buscarRut");
  const $buscarRutButton = $("#buscarRutButton");
  const $themeToggleButton = $("#theme-toggle");
  const $themeIcon = $("#theme-icon");
  const $menuToggleButton = $("#menu-toggle");
  const $sidebar = $(".sidebar");
  const $topbar = $(".topbar");
  const $content = $(".content");
  const $footer = $(".footer"); // Agregar el footer
  const $nombreEjemploSelect = $("#nombre-ejemplo-usuario");

  const nombresEjemplo = [
    "Ana López",
    "Carlos Pérez",
    "María Rodríguez",
    "Luis García",
    "Elena Fernández",
    "Jorge Martínez",
    "Sofía Sánchez",
    "Miguel Gómez",
    "Laura Díaz",
    "Raúl Torres",
  ];

  function saveToLocalStorage(users) {
    localStorage.setItem("users", JSON.stringify(users));
  }

  function loadFromLocalStorage() {
    const users = localStorage.getItem("users");
    return users ? JSON.parse(users) : [];
  }

  function renderTable(users) {
    $tablaUsuarios.empty();
    users.forEach((user) => {
      const newRow = `
        <tr>
          <td>${user.rut}</td>
          <td>${user.nombre}</td>
          <td>${user.apellido}</td>
          <td>${user.correo}</td>
          <td>${user.telefono}</td>
          <td>${user.curso}</td>
          <td>${user.nombreEjemplo}</td>
        </tr>
      `;
      $tablaUsuarios.append(newRow);
    });
  }

  function updateNombreEjemploOptions() {
    const users = loadFromLocalStorage();
    const selectedNombres = users.map((user) => user.nombreEjemplo);
    const availableNombres = nombresEjemplo.filter(
      (nombre) => !selectedNombres.includes(nombre)
    );

    $nombreEjemploSelect
      .empty()
      .append('<option value="">Seleccione un nombre</option>');
    availableNombres.forEach((nombre) => {
      const option = $("<option></option>").val(nombre).text(nombre);
      $nombreEjemploSelect.append(option);
    });
  }

  function toggleDarkMode() {
    $("body").toggleClass("dark-mode");
    $sidebar.toggleClass("dark-mode");
    $topbar.toggleClass("dark-mode");
    $content.toggleClass("dark-mode");
    $footer.toggleClass("dark-mode");
    if ($("body").hasClass("dark-mode")) {
      $themeIcon.removeClass("fa-moon").addClass("fa-sun");
    } else {
      $themeIcon.removeClass("fa-sun").addClass("fa-moon");
    }
  }

  const users = loadFromLocalStorage();
  renderTable(users);
  updateNombreEjemploOptions();

  $themeToggleButton.on("click", toggleDarkMode);

  $form.on("submit", (event) => {
    event.preventDefault();

    const rut = $("#rut-usuario").val().trim();
    const nombre = $("#nombre-usuario").val().trim().toLowerCase();
    const apellido = $("#apellido-usuario").val().trim().toLowerCase();
    const correo = $("#correo-usuario").val().trim().toLowerCase();
    const telefono = $("#telefono-usuario").val().trim();
    const curso = $("#curso-usuario").val().trim();
    const nombreEjemplo = $("#nombre-ejemplo-usuario").val().trim();

    const rutRegex = /^[0-9]+[-|‐]{1}[0-9kK]{1}$/;
    const nombreApellidoRegex = /^[a-zA-Z\s]+$/;
    const correoRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const telefonoRegex = /^[0-9]{9}$/;

    $(".error-message").hide();

    let isValid = true;

    if (!rutRegex.test(rut)) {
      $("#error-rut").text("Rut inválido").show();
      isValid = false;
    } else {
      const rutExists = users.some((user) => user.rut === rut);
      if (rutExists) {
        $("#error-rut").text("Rut ya registrado").show();
        isValid = false;
      }
    }

    if (!nombreApellidoRegex.test(nombre)) {
      $("#error-nombre").text("Nombre inválido").show();
      isValid = false;
    }

    if (!nombreApellidoRegex.test(apellido)) {
      $("#error-apellido").text("Apellido inválido").show();
      isValid = false;
    }

    if (!correoRegex.test(correo)) {
      $("#error-correo").text("Correo inválido").show();
      isValid = false;
    }

    if (!telefonoRegex.test(telefono)) {
      $("#error-telefono").text("Teléfono inválido").show();
      isValid = false;
    }

    if (curso === "") {
      $("#error-curso").text("Seleccione un curso").show();
      isValid = false;
    }

    if (nombreEjemplo === "") {
      $("#error-nombre-ejemplo").text("Seleccione un nombre de ejemplo").show();
      isValid = false;
    }

    if (isValid) {
      const newUser = {
        rut,
        nombre,
        apellido,
        correo,
        telefono,
        curso,
        nombreEjemplo,
      };

      users.push(newUser);
      saveToLocalStorage(users);
      renderTable(users);
      updateNombreEjemploOptions();
      $form[0].reset();
      Swal.fire({
        title: "Usuario Guardado",
        text: "El usuario ha sido guardado exitosamente.",
        icon: "success",
        confirmButtonText: "OK",
      });
    }
  });

  $buscarRutButton.on("click", (event) => {
    event.preventDefault();

    const buscarRut = $buscarRutInput.val().trim();
    const rutRegex = /^[0-9]+[-|‐]{1}[0-9kK]{1}$/;

    $(".error-message").hide();

    if (!rutRegex.test(buscarRut)) {
      $("#error-rut").text("Rut inválido").show();
      return;
    }

    const user = users.find((user) => user.rut === buscarRut);

    if (user) {
      $tablaUsuarios.empty();
      const newRow = `
        <tr>
          <td>${user.rut}</td>
          <td>${user.nombre}</td>
          <td>${user.apellido}</td>
          <td>${user.correo}</td>
          <td>${user.telefono}</td>
          <td>${user.curso}</td>
          <td>${user.nombreEjemplo}</td>
        </tr>
      `;
      $tablaUsuarios.append(newRow);
    } else {
      $("#rut-usuario").val(buscarRut).focus();
    }
  });

  $menuToggleButton.on("click", () => {
    $sidebar.toggleClass("collapsed");
    $topbar.toggleClass("collapsed");
    $content.toggleClass("collapsed");
    $footer.toggleClass("collapsed"); // Agregar el footer
  });

  const $links = $(".sidebar a");

  function handleNavigation(targetId) {
    $(".content-section").addClass("hidden");
    $(`#${targetId}`).removeClass("hidden");
  }

  $links.on("click", function (event) {
    event.preventDefault();
    const targetId = $(this).attr("href").substring(1);
    history.pushState({ targetId }, "", `#${targetId}`);
    handleNavigation(targetId);

    if (targetId === "test-vocacional") {
      const script = $("<script></script>").attr("src", "test-vocacional.js");
      $("body").append(script);
    }
  });

  $(window).on("popstate", (event) => {
    if (event.originalEvent.state && event.originalEvent.state.targetId) {
      handleNavigation(event.originalEvent.state.targetId);
    }
  });

  if (window.location.hash) {
    const targetId = window.location.hash.substring(1);
    handleNavigation(targetId);

    if (targetId === "test-vocacional") {
      const script = $("<script></script>").attr("src", "test-vocacional.js");
      $("body").append(script);
    }
  } else {
    $("#agregar-apoderado-link").click();
  }

  function generateChart(ctx, type, data, options) {
    return new Chart(ctx, {
      type: type,
      data: data,
      options: options,
    });
  }

  function loadCharts() {
    const incidencias = JSON.parse(localStorage.getItem("incidencias")) || [];
    const incidenciasData = {
      labels: incidencias.map((incidencia) =>
        new Date(incidencia.fecha).toLocaleDateString()
      ),
      datasets: [
        {
          label: "Incidencias",
          data: incidencias.map(() => 1),
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };

    const studentResults =
      JSON.parse(localStorage.getItem("studentResults")) || {};
    const vocacionalData = {
      labels: Object.keys(studentResults),
      datasets: [
        {
          label: "Respuestas promedio",
          data: Object.values(studentResults).map((responses) => {
            const sum = responses.reduce((a, b) => a + Number(b), 0);
            return sum / responses.length;
          }),
          backgroundColor: "rgba(153, 102, 255, 0.2)",
          borderColor: "rgba(153, 102, 255, 1)",
          borderWidth: 1,
        },
      ],
    };

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const cursos = users.map((user) => user.curso);
    const uniqueCursos = [...new Set(cursos)];
    const usuariosData = {
      labels: uniqueCursos,
      datasets: [
        {
          label: "Usuarios",
          data: uniqueCursos.map(
            (curso) => users.filter((user) => user.curso === curso).length
          ),
          backgroundColor: "rgba(255, 159, 64, 0.2)",
          borderColor: "rgba(255, 159, 64, 1)",
          borderWidth: 1,
        },
      ],
    };

    const ctxIncidencias = $("#chartIncidencias").get(0).getContext("2d");
    generateChart(ctxIncidencias, "bar", incidenciasData);

    const ctxVocacional = $("#chartVocacional").get(0).getContext("2d");
    generateChart(ctxVocacional, "bar", vocacionalData);

    const ctxUsuarios = $("#chartUsuarios").get(0).getContext("2d");
    generateChart(ctxUsuarios, "bar", usuariosData);
  }

  loadCharts();

  const estadoIconos = {
    Cubierto: "fa-cloud",
    Despejado: "fa-sun",
    Niebla: "fa-smog",
    Nublado: "fa-cloud",
    "Nubosidad parcial": "fa-cloud-sun",
    "Nubosidad parcial y chubascos": "fa-cloud-sun-rain",
    "Cubierto y niebla": "fa-cloud-sun",
  };

  async function fetchWeather(codes) {
    const $weatherInfo = $("#weather-info");
    let weatherDataList = [];
    try {
      const weatherPromises = codes.map(async (codigo) => {
        try {
          const response = await fetch(
            `https://api.gael.cloud/general/public/clima/${codigo}`
          );
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          if (data) {
            const estadoIcono =
              estadoIconos[data.Estado] || "fa-question-circle";
            return `
              <span>${data.Estacion}</span>
              <span><i class="fas fa-thermometer-half"></i> ${data.Temp}°C</span>
              <span><i class="fas fa-tint"></i> ${data.Humedad}%</span>
              <span><i class="fas ${estadoIcono}"></i> ${data.Estado}</span>
            `;
          } else {
            return "No se pudo obtener la información del clima";
          }
        } catch (error) {
          console.error(
            `Error fetching weather data for code ${codigo}:`,
            error
          );
          return `No se pudo obtener información para el código ${codigo}`;
        }
      });
      weatherDataList = await Promise.all(weatherPromises);
      $weatherInfo.html(weatherDataList.join(" | "));
    } catch (error) {
      $weatherInfo.text("No se pudo obtener la información del clima");
      console.error("Error fetching weather data:", error);
    }
  }

  const codes = [
    "SCAR",
    "SCDA",
    "SCFA",
    "SCCF",
    "SCAT",
    "SCSE",
    "SCSN",
    "SCVM",
    "SCQN",
    "SCEL",
    "SCIC",
    "SCCH",
    "SCIE",
    "SCQP",
    "SCVD",
    "SCTE",
    "SCBA",
    "SCMK",
    "SCHR",
    "SCCI",
    "SCIP",
  ];
  fetchWeather(codes);

  // Highlight search input text
  const $mainInput = $("#main-input");

  function highlightText(textToHighlight) {
    const regex = new RegExp(`(${textToHighlight})`, "gi");
    $(".content-section").each(function () {
      $(this)
        .find("*")
        .contents()
        .each(function () {
          if (this.nodeType === 3 && this.nodeValue.match(regex)) {
            const parent = this.parentNode;
            const highlightedText = this.nodeValue.replace(
              regex,
              '<span class="highlight">$1</span>'
            );
            const wrapper = document.createElement("span");
            wrapper.innerHTML = highlightedText;
            while (wrapper.firstChild) {
              parent.insertBefore(wrapper.firstChild, this);
            }
            parent.removeChild(this);
          }
        });
    });
  }

  function removeHighlights() {
    $(".highlight").each(function () {
      const text = $(this).text();
      $(this).replaceWith(text);
    });
  }

  $mainInput.on("input", function () {
    const searchText = $(this).val().trim();
    removeHighlights();
    if (searchText) {
      highlightText(searchText);
    }
  });
});
