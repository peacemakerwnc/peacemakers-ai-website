(function () {
  "use strict";

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
            setFormStatus(form, "Thanks — your info has been saved. Redirecting you to book your call now...", "success");
            window.setTimeout(function () {
              window.location.href = "https://calendly.com/peacemakersai";
            }, 1500);
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
})();
