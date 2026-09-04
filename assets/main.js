// MegaSure Insurance — shared site behavior
document.addEventListener('DOMContentLoaded', function () {
  // Mobile menu toggle
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('nav.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('mobile-open');
    });
  }

  // Insurance Products dropdown
  document.querySelectorAll('.dropdown > button').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      btn.closest('.dropdown').classList.toggle('open');
    });
  });
  document.addEventListener('click', function () {
    document.querySelectorAll('.dropdown.open').forEach(function (d) {
      d.classList.remove('open');
    });
  });

  // Lead / contact form submission -> FormSubmit.co, with an inline
  // professional confirmation message instead of a page redirect.
  document.querySelectorAll('form[action*="formsubmit.co"]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (typeof form.reportValidity === 'function' && !form.reportValidity()) {
        return;
      }

      var submitBtn = form.querySelector('button[type="submit"]');
      var originalLabel = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      var existingError = form.querySelector('.form-error');
      if (existingError) existingError.remove();

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Submission failed');
          var success = document.createElement('div');
          success.className = 'form-success';
          success.setAttribute('role', 'status');
          success.innerHTML =
            '<div class="form-success-icon">' +
            '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' +
            '</div>' +
            '<h3>Thank You</h3>' +
            '<p>Your request has been received. A licensed MegaSure Insurance agent will be in touch with you shortly to discuss your options.</p>';
          form.replaceWith(success);
        })
        .catch(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalLabel;
          }
          var err = document.createElement('p');
          err.className = 'form-error';
          err.textContent =
            "Something went wrong sending your request. Please call or text us directly at (615) 606-2737.";
          form.appendChild(err);
        });
    });
  });
});
