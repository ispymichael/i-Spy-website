(function () {
  "use strict";

  const config = window.ISPY_QUIZ_CONFIG;
  const root = document.getElementById("ispy-quiz");
  const questionCount = config.questions.length;
  const state = {
    screen: "intro",
    questionIndex: 0,
    answers: {},
    emailCaptured: false
  };

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function interpolate(template, values) {
    return template.replace(/\{(\w+)\}/g, function (_, key) {
      return values[key] || "";
    });
  }

  function renderParagraphs(value) {
    return String(value)
      .split(/\n{2,}/)
      .map(function (paragraph) {
        return "<p>" + escapeHtml(paragraph.trim()) + "</p>";
      })
      .join("");
  }

  function getQuestion() {
    return config.questions[state.questionIndex];
  }

  function getSelectedAnswer(question) {
    const answerId = state.answers[question.id];
    return question.answers.find(function (answer) {
      return answer.id === answerId;
    });
  }

  function addWeights(scores, weights) {
    Object.keys(weights || {}).forEach(function (outcome) {
      scores[outcome] = (scores[outcome] || 0) + weights[outcome];
    });
  }

  function compareOutcomes(a, b, scores) {
    const difference = scores[b] - scores[a];
    if (difference !== 0) return difference;
    return config.tieBreakPriority.indexOf(a) - config.tieBreakPriority.indexOf(b);
  }

  function calculateResult() {
    const scores = {};
    Object.keys(config.outcomes).forEach(function (key) {
      scores[key] = 0;
    });

    config.questions.forEach(function (question) {
      const answer = getSelectedAnswer(question);
      if (answer && question.type !== "role") {
        addWeights(scores, answer.weights);
      }
    });

    const ranked = Object.keys(scores).sort(function (a, b) {
      return compareOutcomes(a, b, scores);
    });

    return {
      scores: scores,
      primary: ranked[0],
      secondary: ranked[1]
    };
  }

  function selectedRole() {
    const roleQuestion = config.questions.find(function (question) {
      return question.type === "role";
    });
    return state.answers[roleQuestion.id] || "other";
  }

  function selectedPain() {
    const painQuestion = config.questions.find(function (question) {
      return question.type === "pain";
    });
    return getSelectedAnswer(painQuestion);
  }

  function button(text, className, attributes) {
    return (
      '<button class="' +
      className +
      '" ' +
      (attributes || "") +
      ">" +
      escapeHtml(text) +
      "</button>"
    );
  }

  function renderIntro() {
    root.innerHTML =
      '<section class="quiz-card quiz-card--intro">' +
      '<h1 class="quiz-intro-title"><span>' +
      escapeHtml(config.meta.titleLineOne) +
      '</span><span>' +
      escapeHtml(config.meta.titleLineTwo) +
      "</span></h1>" +
      renderParagraphs(config.meta.intro) +
      (config.meta.estimatedTime
        ? '<p class="time-note">' + escapeHtml(config.meta.estimatedTime) + "</p>"
        : "") +
      '<div class="actions actions--start">' +
      button(config.meta.startButton, "button button--primary", 'data-action="start"') +
      "</div>" +
      "</section>";
  }

  function renderQuestion() {
    const question = getQuestion();
    const selected = state.answers[question.id];
    const isLastQuestion = state.questionIndex === questionCount - 1;
    const progress = interpolate(config.meta.progressLabel, {
      current: state.questionIndex + 1,
      total: questionCount
    });

    root.innerHTML =
      '<section class="quiz-card">' +
      '<div class="progress-row">' +
      '<span class="progress-text">' +
      escapeHtml(progress) +
      "</span>" +
      '<span class="progress-track" aria-hidden="true"><span style="width: ' +
      (((state.questionIndex + 1) / questionCount) * 100).toFixed(2) +
      '%"></span></span>' +
      "</div>" +
      '<form class="question-form" novalidate>' +
      '<fieldset aria-describedby="question-help selection-error">' +
      '<legend>' +
      '<span class="eyebrow">' +
      escapeHtml(question.eyebrow) +
      "</span>" +
      '<span class="question-title">' +
      escapeHtml(question.title) +
      "</span>" +
      "</legend>" +
      (question.helpText ? '<p id="question-help" class="help-text">' + escapeHtml(question.helpText) + "</p>" : "") +
      '<div class="answer-list">' +
      question.answers
        .map(function (answer) {
          const inputId = question.id + "-" + answer.id;
          const checked = selected === answer.id ? " checked" : "";
          return (
            '<label class="answer-option" for="' +
            escapeHtml(inputId) +
            '">' +
            '<input id="' +
            escapeHtml(inputId) +
            '" type="radio" name="' +
            escapeHtml(question.id) +
            '" value="' +
            escapeHtml(answer.id) +
            '"' +
            checked +
            ">" +
            "<span>" +
            escapeHtml(answer.label) +
            "</span>" +
            "</label>"
          );
        })
        .join("") +
      "</div>" +
      '<p id="selection-error" class="error-message" role="alert" hidden></p>' +
      "</fieldset>" +
      '<div class="actions">' +
      button(config.meta.backButton, "button button--secondary", 'type="button" data-action="back"') +
      button(
        isLastQuestion ? config.meta.resultButton : config.meta.nextButton,
        "button button--primary",
        'type="submit"'
      ) +
      "</div>" +
      "</form>" +
      "</section>";
  }

  function renderResult() {
    const result = calculateResult();
    const primary = config.outcomes[result.primary];
    const secondary = config.outcomes[result.secondary];
    const resultEmail =
      "mailto:michael@i-spy.uk?subject=" +
      encodeURIComponent("i-Spy Brand Check result: " + primary.title) +
      "&body=" +
      encodeURIComponent(
        "Hi Michael, I completed the i-Spy Brand Check and my result was " +
          primary.title +
          ". I would like to discuss what this means for my business."
      );

    root.innerHTML =
      '<section class="quiz-card quiz-card--result">' +
      '<p class="eyebrow result-label">' +
      escapeHtml(config.meta.resultLabel) +
      "</p>" +
      "<h1>" +
      escapeHtml(primary.title) +
      "</h1>" +
      '<p class="result-summary">' +
      escapeHtml(primary.summary) +
      "</p>" +
      '<section class="result-recommendation"><h2>' +
      escapeHtml(config.meta.recommendationLabel) +
      "</h2><p>" +
      escapeHtml(primary.recommendation) +
      "</p></section>" +
      '<hr class="result-divider">' +
      '<section class="secondary-insight">' +
      '<p class="eyebrow">' +
      escapeHtml(config.meta.secondaryInsightLabel) +
      "</p>" +
      "<h2>" +
      escapeHtml(secondary.title) +
      "</h2>" +
      "<p>" +
      escapeHtml(secondary.summary) +
      "</p>" +
      "</section>" +
      '<p class="diagnosis-distinction">' +
      escapeHtml(config.meta.distinction) +
      "</p>" +
      '<section class="result-contact"><h2>' +
      escapeHtml(config.meta.emailHeading) +
      '</h2><div class="result-contact-actions"><a class="button button--primary" href="' +
      escapeHtml(resultEmail) +
      '">' +
      escapeHtml(config.meta.emailButton) +
      "</a>" +
      button(
        config.meta.reviewAnswers,
        "result-review-link",
        'data-action="back-to-questions"'
      ) +
      "</div></section>" +
      "</section>";
  }

  function render() {
    if (state.screen === "intro") renderIntro();
    if (state.screen === "question") renderQuestion();
    if (state.screen === "result") renderResult();
  }

  function showError(form, question) {
    const error = form.querySelector("#selection-error");
    error.textContent = question.requiredMessage || config.meta.selectionRequired;
    error.hidden = false;
  }

  root.addEventListener("click", function (event) {
    const action = event.target.getAttribute("data-action");
    if (!action) return;

    if (action === "start") {
      state.screen = "question";
      state.questionIndex = 0;
      render();
    }

    if (action === "back") {
      if (state.questionIndex === 0) {
        state.screen = "intro";
      } else {
        state.questionIndex -= 1;
      }
      render();
    }

    if (action === "back-to-questions") {
      state.screen = "question";
      state.questionIndex = questionCount - 1;
      render();
    }
  });

  root.addEventListener("change", function (event) {
    if (event.target.matches('input[type="radio"]')) {
      const question = getQuestion();
      state.answers[question.id] = event.target.value;
      const error = root.querySelector("#selection-error");
      if (error) error.hidden = true;
    }
  });

  root.addEventListener("submit", function (event) {
    event.preventDefault();

    const question = getQuestion();
    const selected = event.target.querySelector('input[type="radio"]:checked');

    if (!selected) {
      showError(event.target, question);
      return;
    }

    state.answers[question.id] = selected.value;

    if (state.questionIndex === questionCount - 1) {
      state.screen = "result";
    } else {
      state.questionIndex += 1;
    }

    render();
  });

  render();
})();
