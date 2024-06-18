$(document).ready(() => {
  const $testContainer = $("#test-container");
  const $questionContainer = $("#question-container");
  const $selectAnswer = $("#select-answer");
  const $nextBtn = $("#next-btn");
  const $resultContainer = $("#result-container");
  const $resultText = $("#result-text");
  const $retryBtn = $("#retry-btn");

  const questions = [
    "En una escala del 1 al 3, ¿cuánta experiencia tienes en lenguajes de programación?",
    "¿Qué nivel de interés tienes en aprender sobre diferentes áreas de la tecnología, siendo 1 bajo interés y 3 alto interés?",
    "¿Cuántos proyectos tecnológicos has llevado a cabo, ya sea de forma individual o en equipo?",
    "¿Cómo te sientes al enfrentarte a problemas complejos de programación, siendo 1 poco seguro y 3 muy seguro?",
    "En una escala del 1 al 3, ¿qué tan hábil te consideras en el uso de herramientas de desarrollo como IDEs, control de versiones y sistemas operativos?",
    "¿Cuánto te gustaría explorar áreas específicas de la informática, siendo 1 poco interesado y 3 muy interesado?",
    "En una escala del 1 al 3, ¿qué nivel de experiencia tienes con conceptos de desarrollo de software como algoritmos, estructuras de datos y paradigmas de programación?",
    "¿Qué tanto te atraen la gestión de proyectos tecnológicos, la investigación en informática y el desarrollo de software, siendo 1 poco atraído y 3 muy atraído?",
    "¿En qué medida te mantienes al tanto de las tendencias y avances en tecnología y programación, siendo 1 poco informado y 3 muy informado?",
  ];

  let currentQuestionIndex = 0;
  let answers = [];
  let selectedStudent = "";

  function loadQuestion(index) {
    $questionContainer.html(`<p>${questions[index]}</p>`);
    $selectAnswer.html(`
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
    `);
  }

  function showResult() {
    $resultContainer.removeClass("hidden");
    $testContainer.addClass("hidden");
    $resultText.text(`Tus respuestas: ${answers.join(", ")}`);
  }

  $nextBtn.on("click", () => {
    const answer = $selectAnswer.val();
    if (answer) {
      answers.push(answer);
      currentQuestionIndex++;
      if (currentQuestionIndex < questions.length) {
        loadQuestion(currentQuestionIndex);
      } else {
        if (selectedStudent) {
          const studentResults =
            JSON.parse(localStorage.getItem("studentResults")) || {};
          studentResults[selectedStudent] = answers;
          localStorage.setItem(
            "studentResults",
            JSON.stringify(studentResults)
          );
          showResult();
        } else {
          alert("Por favor, selecciona un alumno.");
        }
      }
    } else {
      alert("Por favor, selecciona una respuesta.");
    }
  });

  $retryBtn.on("click", () => {
    currentQuestionIndex = 0;
    answers = [];
    loadQuestion(currentQuestionIndex);
    $resultContainer.addClass("hidden");
    $testContainer.removeClass("hidden");
  });

  // Initialize the student selection
  const $studentSelect = $('<select id="student-select"></select>');
  $studentSelect.html(`
    <option value="">Selecciona un alumno</option>
    <option value="Ana López">Ana López</option>
    <option value="Carlos Pérez">Carlos Pérez</option>
    <option value="María Rodríguez">María Rodríguez</option>
    <option value="Luis García">Luis García</option>
    <option value="Elena Fernández">Elena Fernández</option>
    <option value="Jorge Martínez">Jorge Martínez</option>
    <option value="Sofía Sánchez">Sofía Sánchez</option>
    <option value="Miguel Gómez">Miguel Gómez</option>
    <option value="Laura Díaz">Laura Díaz</option>
    <option value="Raúl Torres">Raúl Torres</option>
  `);
  $testContainer.prepend($studentSelect);

  $studentSelect.on("change", () => {
    selectedStudent = $studentSelect.val();
  });

  // Initialize the first question
  loadQuestion(currentQuestionIndex);
});
