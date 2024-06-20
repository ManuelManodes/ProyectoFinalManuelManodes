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
      <option value="">Selecciona una respuesta</option>
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
    `);
    $selectAnswer.val(""); // Reset the answer selection
  }

  function saveStudentResults(student, responses) {
    const studentResults =
      JSON.parse(localStorage.getItem("studentResults")) || {};
    studentResults[student] = responses;
    localStorage.setItem("studentResults", JSON.stringify(studentResults));
  }

  function determineResult(answers) {
    const sum = answers.reduce((total, answer) => total + parseInt(answer), 0);
    const average = sum / answers.length;

    if (average <= 1.5) {
      return "Parece que tienes un interés bajo en programación. Podrías considerar explorar otras áreas.";
    } else if (average <= 2.5) {
      return "Tienes un interés moderado en programación. Podrías beneficiarte de cursos adicionales y proyectos prácticos.";
    } else {
      return "Tienes un alto interés en programación. ¡Podrías considerar una carrera en el desarrollo de software!";
    }
  }

  function showResult() {
    const resultText = determineResult(answers);
    $resultContainer.removeClass("hidden");
    $testContainer.addClass("hidden");
    $resultText.text(resultText);
    Swal.fire({
      title: "Test Completado",
      text: resultText,
      icon: "success",
      confirmButtonText: "OK",
    });
  }

  $nextBtn.on("click", () => {
    const answer = $selectAnswer.val();
    if (answer && answer !== "") {
      answers.push(parseInt(answer));
      currentQuestionIndex++;
      if (currentQuestionIndex < questions.length) {
        loadQuestion(currentQuestionIndex);
      } else {
        if (selectedStudent) {
          saveStudentResults(selectedStudent, answers);
          showResult();
        } else {
          Swal.fire({
            title: "Error",
            text: "Por favor, selecciona un alumno.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    } //else {
    //Swal.fire({
    // title: "Error",
    //text: "Por favor, selecciona una respuesta.",
    //icon: "error",
    //confirmButtonText: "OK",
    //});
    // }
  });

  $retryBtn.on("click", () => {
    currentQuestionIndex = 0;
    answers = [];
    loadQuestion(currentQuestionIndex);
    $resultContainer.addClass("hidden");
    $testContainer.removeClass("hidden");
  });

  const $studentSelect = $("#student-select");

  $studentSelect.on("change", () => {
    selectedStudent = $studentSelect.val();
  });

  // Initialize the first question
  loadQuestion(currentQuestionIndex);
});
