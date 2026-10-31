/**
 * prashaant.biz — Direct Lead Generation Script
 * Handles lead form validation, inline thank-you state, FAQ accordion,
 * and mobile sticky bar visibility.
 */

document.addEventListener('DOMContentLoaded', () => {
  const leadForm = document.getElementById('lead-form');
  const formError = document.getElementById('lead-form-error');
  const thankYouState = document.getElementById('thank-you-state');
  const submittedClinic = document.getElementById('submitted-clinic');
  const submittedPhone = document.getElementById('submitted-phone');
  const submitAnotherBtn = document.getElementById('submit-another-btn');

  // 1. Lead Form Submission -> Clean Thank-You State (No calendar or booking redirect)
  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const firstName = document.getElementById('firstName').value.trim();
      const clinicName = document.getElementById('clinicName').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const email = document.getElementById('email').value.trim();

      if (!firstName || !clinicName || !phone || !email) {
        formError.hidden = false;
        return;
      }

      formError.hidden = true;

      if (submittedClinic) submittedClinic.textContent = clinicName;
      if (submittedPhone) submittedPhone.textContent = phone;

      leadForm.hidden = true;
      thankYouState.hidden = false;
    });
  }

  // Allow editing details if needed
  if (submitAnotherBtn) {
    submitAnotherBtn.addEventListener('click', () => {
      thankYouState.hidden = true;
      leadForm.hidden = false;
    });
  }

  // 2. Smooth scroll + focus First Name input when clicking "Get Started" / Lead CTAs
  const leadLinks = document.querySelectorAll('a[href="#lead-form-section"]');
  const firstNameInput = document.getElementById('firstName');
  const leadSection = document.getElementById('lead-form-section');

  leadLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      if (leadSection) {
        e.preventDefault();
        leadSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (firstNameInput && !leadForm.hidden) {
          setTimeout(() => {
            firstNameInput.focus({ preventScroll: true });
          }, 450);
        }
      }
    });
  });

  // 3. Single-open FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        faqItems.forEach((other) => {
          if (other !== item && other.open) {
            other.open = false;
          }
        });
      }
    });
  });

  // 4. Hide Mobile Sticky CTA when the Lead Form Section is on screen
  const mobileStickyBar = document.getElementById('mobile-sticky-bar');
  if (mobileStickyBar && leadSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            mobileStickyBar.classList.add('is-hidden');
          } else {
            mobileStickyBar.classList.remove('is-hidden');
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(leadSection);
  }
});
