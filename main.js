document.addEventListener("DOMContentLoaded", () => {
  console.log("JavaScript is loaded and ready to add functionality.");

  const form = document.getElementById("formUsuario");
  const tablaUsuarios = document
    .getElementById("tablaUsuarios")
    .querySelector("tbody");
  const buscarRutInput = document.getElementById("buscarRut");
  const buscarRutButton = document.getElementById("buscarRutButton");
  const themeToggleButton = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");
  const menuToggleButton = document.getElementById("menu-toggle");
  const sidebar = document.querySelector(".sidebar");
  const topbar = document.querySelector(".topbar");
  const content = document.querySelector(".content");
  const nombreEjemploSelect = document.getElementById("nombre-ejemplo");

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
    tablaUsuarios.innerHTML = "";
    users.forEach((user) => {
      const newRow = tablaUsuarios.insertRow();
      newRow.innerHTML = `
              <td>${user.rut}</td>
              <td>${user.nombre}</td>
              <td>${user.apellido}</td>
              <td>${user.correo}</td>
              <td>${user.telefono}</td>
              <td>${user.curso}</td>
              <td>${user.nombreEjemplo}</td>
          `;
    });
  }

  function updateNombreEjemploOptions() {
    const users = loadFromLocalStorage();
    const selectedNombres = users.map((user) => user.nombreEjemplo);
    const availableNombres = nombresEjemplo.filter(
      (nombre) => !selectedNombres.includes(nombre)
    );

    nombreEjemploSelect.innerHTML =
      '<option value="">Seleccione un nombre</option>';
    availableNombres.forEach((nombre) => {
      const option = document.createElement("option");
      option.value = nombre;
      option.textContent = nombre;
      nombreEjemploSelect.appendChild(option);
    });
  }

  function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    sidebar.classList.toggle("dark-mode");
    topbar.classList.toggle("dark-mode");
    content.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
      themeIcon.classList.remove("fa-moon");
      themeIcon.classList.add("fa-sun");
    } else {
      themeIcon.classList.remove("fa-sun");
      themeIcon.classList.add("fa-moon");
    }
  }

  const users = loadFromLocalStorage();
  renderTable(users);
  updateNombreEjemploOptions();

  themeToggleButton.addEventListener("click", toggleDarkMode);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const rut = document.getElementById("rut").value.trim();
    const nombre = document.getElementById("nombre").value.trim().toLowerCase();
    const apellido = document
      .getElementById("apellido")
      .value.trim()
      .toLowerCase();
    const correo = document.getElementById("correo").value.trim().toLowerCase();
    const telefono = document.getElementById("telefono").value.trim();
    const curso = document.getElementById("curso").value.trim();
    const nombreEjemplo = document
      .getElementById("nombre-ejemplo")
      .value.trim();

    const rutRegex = /^[0-9]+[-|‐]{1}[0-9kK]{1}$/;
    const nombreApellidoRegex = /^[a-zA-Z\s]+$/;
    const correoRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const telefonoRegex = /^[0-9]{9}$/;

    document
      .querySelectorAll(".error-message")
      .forEach((el) => (el.style.display = "none"));

    let isValid = true;

    if (!rutRegex.test(rut)) {
      document.getElementById("error-rut").textContent = "Rut inválido";
      document.getElementById("error-rut").style.display = "block";
      isValid = false;
    } else {
      const rutExists = users.some((user) => user.rut === rut);
      if (rutExists) {
        document.getElementById("error-rut").textContent = "Rut ya registrado";
        document.getElementById("error-rut").style.display = "block";
        isValid = false;
      }
    }

    if (!nombreApellidoRegex.test(nombre)) {
      document.getElementById("error-nombre").textContent = "Nombre inválido";
      document.getElementById("error-nombre").style.display = "block";
      isValid = false;
    }

    if (!nombreApellidoRegex.test(apellido)) {
      document.getElementById("error-apellido").textContent =
        "Apellido inválido";
      document.getElementById("error-apellido").style.display = "block";
      isValid = false;
    }

    if (!correoRegex.test(correo)) {
      document.getElementById("error-correo").textContent = "Correo inválido";
      document.getElementById("error-correo").style.display = "block";
      isValid = false;
    }

    if (!telefonoRegex.test(telefono)) {
      document.getElementById("error-telefono").textContent =
        "Teléfono inválido";
      document.getElementById("error-telefono").style.display = "block";
      isValid = false;
    }

    if (curso === "") {
      document.getElementById("error-curso").textContent =
        "Seleccione un curso";
      document.getElementById("error-curso").style.display = "block";
      isValid = false;
    }

    if (nombreEjemplo === "") {
      document.getElementById("error-nombre-ejemplo").textContent =
        "Seleccione un nombre de ejemplo";
      document.getElementById("error-nombre-ejemplo").style.display = "block";
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
      form.reset();
    }
  });

  buscarRutButton.addEventListener("click", (event) => {
    event.preventDefault();

    const buscarRut = buscarRutInput.value.trim();
    const rutRegex = /^[0-9]+[-|‐]{1}[0-9kK]{1}$/;

    document
      .querySelectorAll(".error-message")
      .forEach((el) => (el.style.display = "none"));

    if (!rutRegex.test(buscarRut)) {
      document.getElementById("error-rut").textContent = "Rut inválido";
      document.getElementById("error-rut").style.display = "block";
      return;
    }

    const user = users.find((user) => user.rut === buscarRut);

    if (user) {
      tablaUsuarios.innerHTML = "";
      const newRow = tablaUsuarios.insertRow();
      newRow.innerHTML = `
              <td>${user.rut}</td>
              <td>${user.nombre}</td>
              <td>${user.apellido}</td>
              <td>${user.correo}</td>
              <td>${user.telefono}</td>
              <td>${user.curso}</td>
              <td>${user.nombreEjemplo}</td>
          `;
    } else {
      document.getElementById("rut").value = buscarRut;
      document.getElementById("nombre").focus();
    }
  });

  menuToggleButton.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
    topbar.classList.toggle("collapsed");
    content.classList.toggle("collapsed");
  });

  const links = document.querySelectorAll(".sidebar a");

  function handleNavigation(targetId) {
    document.querySelectorAll(".content-section").forEach((section) => {
      section.classList.add("hidden");
    });
    document.getElementById(targetId).classList.remove("hidden");
  }

  links.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      history.pushState({ targetId }, "", `#${targetId}`);
      handleNavigation(targetId);

      if (targetId === "test-vocacional") {
        const script = document.createElement("script");
        script.src = "test-vocacional.js";
        document.body.appendChild(script);
      }
    });
  });

  window.addEventListener("popstate", (event) => {
    if (event.state && event.state.targetId) {
      handleNavigation(event.state.targetId);
    }
  });

  if (window.location.hash) {
    const targetId = window.location.hash.substring(1);
    handleNavigation(targetId);

    if (targetId === "test-vocacional") {
      const script = document.createElement("script");
      script.src = "test-vocacional.js";
      document.body.appendChild(script);
    }
  } else {
    document.querySelector("#agregar-apoderado-link").click();
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

    const ctxIncidencias = document
      .getElementById("chartIncidencias")
      .getContext("2d");
    generateChart(ctxIncidencias, "bar", incidenciasData);

    const ctxVocacional = document
      .getElementById("chartVocacional")
      .getContext("2d");
    generateChart(ctxVocacional, "bar", vocacionalData);

    const ctxUsuarios = document
      .getElementById("chartUsuarios")
      .getContext("2d");
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
    const weatherInfo = document.getElementById("weather-info");
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
      weatherInfo.innerHTML = weatherDataList.join(" | ");
    } catch (error) {
      weatherInfo.textContent = "No se pudo obtener la información del clima";
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
});
