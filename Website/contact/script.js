/**
 * DevSpireHub — Contact Page Script
 * Real Web3Forms Submission, Live Client Validation, and One-Click Email Copy
 */
document.addEventListener("DOMContentLoaded", () => {
  // ── 1. One-Click Email Copy Handler ──
  const copyBtn = document.getElementById("copyEmailBtn");
  const emailTextEl = document.getElementById("emailToCopy");

  if (copyBtn && emailTextEl) {
    copyBtn.addEventListener("click", async () => {
      const email = emailTextEl.textContent.trim();
      try {
        await navigator.clipboard.writeText(email);
        const originalHtml = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fa-solid fa-check" aria-hidden="true"></i> Copied!';
        copyBtn.classList.add("copied");
        setTimeout(() => {
          copyBtn.innerHTML = originalHtml;
          copyBtn.classList.remove("copied");
        }, 2500);
      } catch (err) {
        // Fallback: select text
        const range = document.createRange();
        range.selectNodeContents(emailTextEl);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }
    });
  }

  // ── 2. Contact Form Validation & Asynchronous Web3Forms Submission ──
  const form = document.getElementById("contactForm");
  const submitBtn = document.getElementById("contactSubmitBtn");
  const statusAlert = document.getElementById("contactFormStatus");

  if (!form || !submitBtn || !statusAlert) return;

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");

  const nameError = document.getElementById("nameError");
  const emailError = document.getElementById("emailError");
  const messageError = document.getElementById("messageError");

  function validateEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  }

  function validateField(input, errorEl, isValid, message) {
    if (!isValid) {
      input.classList.add("is-invalid");
      input.setAttribute("aria-invalid", "true");
      errorEl.textContent = message;
      errorEl.classList.add("visible");
      return false;
    } else {
      input.classList.remove("is-invalid");
      input.removeAttribute("aria-invalid");
      errorEl.textContent = "";
      errorEl.classList.remove("visible");
      return true;
    }
  }

  // Live blur validation
  if (nameInput) {
    nameInput.addEventListener("blur", () => {
      validateField(nameInput, nameError, nameInput.value.trim().length >= 2, "Please enter your name (at least 2 characters).");
    });
    nameInput.addEventListener("input", () => {
      if (nameInput.classList.contains("is-invalid")) {
        validateField(nameInput, nameError, nameInput.value.trim().length >= 2, "Please enter your name (at least 2 characters).");
      }
    });
  }

  if (emailInput) {
    emailInput.addEventListener("blur", () => {
      validateField(emailInput, emailError, validateEmail(emailInput.value), "Please enter a valid email address.");
    });
    emailInput.addEventListener("input", () => {
      if (emailInput.classList.contains("is-invalid")) {
        validateField(emailInput, emailError, validateEmail(emailInput.value), "Please enter a valid email address.");
      }
    });
  }

  if (messageInput) {
    messageInput.addEventListener("blur", () => {
      validateField(messageInput, messageError, messageInput.value.trim().length >= 10, "Please enter a message with at least 10 characters.");
    });
    messageInput.addEventListener("input", () => {
      if (messageInput.classList.contains("is-invalid")) {
        validateField(messageInput, messageError, messageInput.value.trim().length >= 10, "Please enter a message with at least 10 characters.");
      }
    });
  }

  // Form submit handler
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Check honeypot
    const botcheck = form.querySelector('input[name="botcheck"]');
    if (botcheck && botcheck.checked) return;

    // Validate all fields
    const isNameOk = validateField(nameInput, nameError, nameInput.value.trim().length >= 2, "Please enter your name (at least 2 characters).");
    const isEmailOk = validateField(emailInput, emailError, validateEmail(emailInput.value), "Please enter a valid email address.");
    const isMsgOk = validateField(messageInput, messageError, messageInput.value.trim().length >= 10, "Please enter a message with at least 10 characters.");

    if (!isNameOk || !isEmailOk || !isMsgOk) {
      if (!isNameOk) nameInput.focus();
      else if (!isEmailOk) emailInput.focus();
      else messageInput.focus();
      return;
    }

    // Set button loading state
    submitBtn.disabled = true;
    submitBtn.classList.add("loading");
    const btnLabel = submitBtn.querySelector(".btn-text");
    const originalText = btnLabel ? btnLabel.textContent : "Send Message";
    if (btnLabel) btnLabel.textContent = "Sending...";

    // Reset status alert
    statusAlert.className = "form-status-alert";
    statusAlert.textContent = "";

    try {
      const formData = new FormData(form);

      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
        headers: {
          "Accept": "application/json"
        }
      });

      const data = await res.json();

      if (data.success) {
        statusAlert.className = "form-status-alert success visible";
        statusAlert.innerHTML = '<i class="fa-solid fa-circle-check" aria-hidden="true"></i> Message sent successfully! Thank you for reaching out — Kumaradoss will get back to you shortly.';
        form.reset();
      } else {
        throw new Error(data.message || "Submission failed");
      }
    } catch (err) {
      statusAlert.className = "form-status-alert error visible";
      statusAlert.innerHTML = '<i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i> Unable to send via the web form. Please email us directly at <a href="mailto:devspirehub.website@gmail.com" style="color:#FFFFFF;text-decoration:underline;">devspirehub.website@gmail.com</a>.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.classList.remove("loading");
      if (btnLabel) btnLabel.textContent = originalText;
    }
  });
});
