(function () {
  "use strict";

  var CALENDLY_URL =
    (document.documentElement && document.documentElement.dataset.calendlyUrl) ||
    "https://calendly.com/james-peacemakersai/30min";

  var INTRO_CALENDLY_URL =
    (document.documentElement && document.documentElement.dataset.introCalendlyUrl) || "";

  function wireCalendlyLinks() {
    var calendlyLinks = document.querySelectorAll("[data-calendly-link]");
    calendlyLinks.forEach(function (link) {
      link.setAttribute("href", CALENDLY_URL);
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
      link.addEventListener("click", function (event) {
        if (window.Calendly && typeof window.Calendly.initPopupWidget === "function") {
          event.preventDefault();
          window.Calendly.initPopupWidget({ url: CALENDLY_URL });
        }
      });
    });
  }

  function wireIntroCalendlyLinks() {
    var introLinks = document.querySelectorAll("[data-intro-calendly-link]");
    if (!introLinks.length) return;
    if (!INTRO_CALENDLY_URL || INTRO_CALENDLY_URL.indexOf("REPLACE_WITH_INTRO_CALL_URL") !== -1) {
      return;
    }
    introLinks.forEach(function (link) {
      link.setAttribute("href", INTRO_CALENDLY_URL);
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    });
  }

  wireCalendlyLinks();
  wireIntroCalendlyLinks();

  var doc = document.documentElement;
  doc.classList.remove("no-js");
  doc.classList.add("js");

  var header = document.querySelector(".site-header");
  var navToggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("site-nav");
  var themeToggle = document.getElementById("theme-toggle");

  if (navToggle && header) {
    navToggle.addEventListener("click", function () {
      var open = header.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    if (nav) {
      nav.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
          if (window.matchMedia("(max-width: 920px)").matches) {
            header.classList.remove("nav-open");
            navToggle.setAttribute("aria-expanded", "false");
          }
        });
      });
    }
  }

  if (themeToggle) {
    var modes = ["system", "light", "dark"];
    themeToggle.addEventListener("click", function () {
      var current = doc.getAttribute("data-theme") || "system";
      var index = modes.indexOf(current);
      var next = modes[(index + 1) % modes.length];
      if (next === "system") {
        doc.removeAttribute("data-theme");
      } else {
        doc.setAttribute("data-theme", next);
      }
    });
  }

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealElements = document.querySelectorAll(".reveal");

  if (!reducedMotion && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealElements.forEach(function (el) {
      el.classList.add("visible");
    });
  }

  function clearFieldError(form, fieldName) {
    var errorEl = form.querySelector('[data-error-for="' + fieldName + '"]');
    var field = form.querySelector('[name="' + fieldName + '"]');
    if (errorEl) errorEl.textContent = "";
    if (field && field.parentElement) field.parentElement.classList.remove("has-error");
  }

  function setFieldError(form, fieldName, message) {
    var errorEl = form.querySelector('[data-error-for="' + fieldName + '"]');
    var field = form.querySelector('[name="' + fieldName + '"]');
    if (errorEl) errorEl.textContent = message;
    if (field && field.parentElement) field.parentElement.classList.add("has-error");
  }

  function validateLeadForm(form) {
    var isValid = true;
    var nameField = form.querySelector('[name="full_name"]');
    var emailField = form.querySelector('[name="email"]');
    var industryField = form.querySelector('[name="industry"]');
    var needsField = form.querySelector('[name="needs"]');

    ["full_name", "email", "phone", "industry", "needs"].forEach(function (key) {
      clearFieldError(form, key);
    });

    if (!nameField || !nameField.value.trim()) {
      setFieldError(form, "full_name", "Please enter your full name.");
      isValid = false;
    }

    var emailValue = emailField ? emailField.value.trim() : "";
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValue) {
      setFieldError(form, "email", "Please enter your email.");
      isValid = false;
    } else if (!emailRegex.test(emailValue)) {
      setFieldError(form, "email", "Please enter a valid email address.");
      isValid = false;
    }

    if (!industryField || !industryField.value.trim()) {
      setFieldError(form, "industry", "Please select your industry.");
      isValid = false;
    }

    var needsValue = needsField ? needsField.value.trim() : "";
    if (!needsValue) {
      setFieldError(form, "needs", "Please share what you need help with.");
      isValid = false;
    } else if (needsValue.length < 20) {
      setFieldError(form, "needs", "Please add at least 20 characters so we have enough context.");
      isValid = false;
    }

    return isValid;
  }

  function getLeadPayload(form) {
    var formData = new FormData(form);
    formData.set("submitted_at", new Date().toISOString());
    return {
      full_name: String(formData.get("full_name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      industry: String(formData.get("industry") || "").trim(),
      needs: String(formData.get("needs") || "").trim(),
      page_source: String(formData.get("page_source") || window.location.pathname),
      submitted_at: String(formData.get("submitted_at") || "")
    };
  }

  function setFormStatus(form, message, type) {
    var statusEl = form.querySelector("[data-form-status]");
    if (!statusEl) return;
    statusEl.textContent = message || "";
    statusEl.classList.remove("success", "error");
    if (type) statusEl.classList.add(type);
  }

  function setSubmitting(form, submitting) {
    var submitButton = form.querySelector('button[type="submit"]');
    if (!submitButton) return;
    var defaultLabel = submitButton.getAttribute("data-submit-label") || "Continue to Book a Call";
    submitButton.disabled = submitting;
    submitButton.textContent = submitting ? "Saving your details..." : defaultLabel;
  }

  function getFormSuccessMessage(form) {
    return (
      form.getAttribute("data-success-message") ||
      "Thanks — your info has been saved. Redirecting you to book your call now..."
    );
  }

  function getFormSuccessRedirect(form) {
    var redirectValue = form.getAttribute("data-success-redirect");
    if (redirectValue === "none") return "";
    return redirectValue || CALENDLY_URL;
  }

  function revealSuccessNextStep(form) {
    var selector = form.getAttribute("data-success-reveal");
    if (!selector) return;
    try {
      var el = document.querySelector(selector);
      if (el) el.classList.remove("is-hidden");
    } catch (_err) {
      // ignore invalid selectors to avoid breaking form flow
    }
  }

  function applyUtmParams(form) {
    var params = new URLSearchParams(window.location.search);
    ["utm_source", "utm_medium", "utm_campaign"].forEach(function (key) {
      var field = form.querySelector('[name="' + key + '"]');
      if (field && !field.value) {
        field.value = params.get(key) || "";
      }
    });
  }

  async function submitToFormspree(form, payload) {
    var actionUrl = form.getAttribute("action") || "";
    if (!actionUrl || actionUrl.indexOf("REPLACE_WITH_REAL_FORM_ID") !== -1) {
      throw new Error("FORM_ENDPOINT_NOT_CONFIGURED");
    }

    var formData = new FormData(form);
    formData.set("submitted_at", payload.submitted_at);
    formData.set("page_source", payload.page_source);

    // FORM_ENDPOINT must be a valid Formspree endpoint: https://formspree.io/f/<id>
    // Endpoint comes from each form's action attribute (not hardcoded in JS).
    var response = await fetch(actionUrl, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error("FORM_SUBMIT_FAILED");
    }
  }

  function scoreCategory(score) {
    if (score <= 40) {
      return {
        name: "Foundation Needed",
        message:
          "You likely have opportunities for AI, but the first step is clarifying your workflows and systems before adding more tools."
      };
    }
    if (score <= 65) {
      return {
        name: "Quick Wins Available",
        message:
          "You have clear areas where AI may save time and improve consistency quickly. A focused Blueprint can help identify the best first moves."
      };
    }
    if (score <= 85) {
      return {
        name: "Strong AI Opportunity",
        message:
          "Your business likely has multiple workflows ready for AI support. The right roadmap could help you prioritize and implement faster."
      };
    }
    return {
      name: "AI Growth System Ready",
      message:
        "Your business appears ready for a more structured AI implementation plan across multiple workflows, tools, and teams."
    };
  }

  function wireScorecardForm() {
    var form = document.querySelector("[data-scorecard-form]");
    if (!form) return;

    var resultsSection = document.querySelector("[data-scorecard-results]");
    var statusEl = form.querySelector("[data-scorecard-status]");
    var scoreOutput = form.querySelector("[data-score-output]");
    var rawOutput = form.querySelector("[data-score-raw-output]");
    var categoryOutput = form.querySelector("[data-score-category-output]");
    var resultScore = document.querySelector("[data-score-result]");
    var resultCategory = document.querySelector("[data-score-category]");
    var resultMessage = document.querySelector("[data-score-message]");
    var resultPriority = document.querySelector("[data-score-priority]");

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (statusEl) statusEl.textContent = "";

      var requiredFields = form.querySelectorAll("[required]");
      for (var i = 0; i < requiredFields.length; i += 1) {
        if (!String(requiredFields[i].value || "").trim()) {
          if (statusEl) statusEl.textContent = "Please complete all required scorecard fields.";
          return;
        }
      }

      var rawScore = 0;
      for (var q = 1; q <= 10; q += 1) {
        rawScore += Number(form.querySelector('[name="score_q' + q + '"]').value || 0);
      }
      var percentage = Math.round((rawScore / 50) * 100);
      var category = scoreCategory(percentage);
      var priority = form.querySelector('[name="priority_area"]').value || "Not sure";

      if (scoreOutput) scoreOutput.value = String(percentage);
      if (rawOutput) rawOutput.value = String(rawScore);
      if (categoryOutput) categoryOutput.value = category.name;
      if (resultScore) resultScore.textContent = String(percentage);
      if (resultCategory) resultCategory.textContent = category.name;
      if (resultMessage) resultMessage.textContent = category.message;
      if (resultPriority) resultPriority.textContent = priority;
      if (resultsSection) resultsSection.classList.remove("is-hidden");

      var actionUrl = form.getAttribute("action") || "";
      if (!actionUrl || actionUrl.indexOf("REPLACE_WITH_REAL_FORM_ID") !== -1) {
        if (statusEl) statusEl.textContent = "Score calculated. Form endpoint is not configured yet.";
        return;
      }

      var payload = new FormData(form);
      payload.set("submitted_at", new Date().toISOString());
      payload.set("score_percentage", String(percentage));
      payload.set("score_raw", String(rawScore));
      payload.set("score_category", category.name);
      payload.set("score_priority_area", priority);

      fetch(actionUrl, {
        method: "POST",
        body: payload,
        headers: { Accept: "application/json" }
      })
        .then(function (response) {
          if (!response.ok) throw new Error("FORM_SUBMIT_FAILED");
          if (statusEl) statusEl.textContent = "Score saved. Review your next-step recommendations below.";
        })
        .catch(function () {
          if (statusEl) statusEl.textContent = "Score calculated, but we could not save your submission right now.";
        });
    });
  }

  function wireLeadForms() {
    var leadForms = document.querySelectorAll("[data-lead-form]");
    if (!leadForms.length) return;

    leadForms.forEach(function (form) {
      applyUtmParams(form);

      form.addEventListener("submit", function (event) {
        event.preventDefault();
        if (form.dataset.submitting === "true") return;

        setFormStatus(form, "");

        if (!validateLeadForm(form)) return;

        var payload = getLeadPayload(form);
        form.dataset.submitting = "true";
        setSubmitting(form, true);

        submitToFormspree(form, payload)
          .then(function () {
            var successMessage = getFormSuccessMessage(form);
            var successRedirect = getFormSuccessRedirect(form);
            setFormStatus(form, successMessage, "success");
            revealSuccessNextStep(form);
            if (successRedirect) {
              window.setTimeout(function () {
                window.location.href = successRedirect;
              }, 1500);
            }
          })
          .catch(function (error) {
            if (error && error.message === "FORM_ENDPOINT_NOT_CONFIGURED") {
              setFormStatus(
                form,
                "Form connection is not configured yet. Replace the Formspree form ID in the form action attribute.",
                "error"
              );
              return;
            }

            setFormStatus(
              form,
              "We couldn't save your details right now. Please try again in a moment, then continue to booking.",
              "error"
            );
          })
          .finally(function () {
            form.dataset.submitting = "false";
            setSubmitting(form, false);
          });
      });
    });
  }

  wireLeadForms();
  wireScorecardForm();

  // FORMSPREE SETUP (manual step required)
  // 1) Go to https://formspree.io and sign up or log in.
  // 2) Create a new form and note the endpoint, which will look like:
  //    https://formspree.io/f/xxxxxxx
  // 3) In this project, replace REPLACE_WITH_REAL_FORM_ID in the homepage
  //    form and the Blueprint details page form action attributes
  //    so the action attribute points to the real endpoint.
  // 4) Redeploy the site. Submissions will be stored and/or emailed by Formspree,
  //    and on success the user will be redirected to Calendly as before.
})();
