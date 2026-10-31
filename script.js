/**
 * prashaant.biz — Direct Lead Generation Script
 * Handles lead form validation, single-fire conversion tracking,
 * redirect to /thank-you upon valid submission, and mobile sticky bar visibility.
 */

document.addEventListener('DOMContentLoaded', () => {
  const leadForm = document.getElementById('lead-form');
  const formError = document.getElementById('lead-form-error');

  // 1. Lead Form Submission -> Validate -> Track Once -> Redirect to /thank-you
  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const firstName = document.getElementById('firstName').value.trim();
      const clinicName = document.getElementById('clinicName').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const email = document.getElementById('email').value.trim();
      const improvementAreaEl = document.getElementById('improvementArea');
      const improvementArea = improvementAreaEl ? improvementAreaEl.value : '';

      // Do NOT redirect if validation fails
      if (!firstName || !clinicName || !phone || !email) {
        formError.hidden = false;
        return;
      }

      formError.hidden = true;

      // Save lead summary in sessionStorage for the Thank You page
      try {
        sessionStorage.setItem(
          'prashaant_lead_data',
          JSON.stringify({
            firstName,
            clinicName,
            phone,
            email,
            improvementArea,
            submittedAt: new Date().toISOString(),
          })
        );
      } catch (err) {
        // Ignore storage restrictions
      }

      // Fire primary Lead conversion event ONCE upon successful submission (if Meta Pixel / gtag is present)
      try {
        const alreadyFired = sessionStorage.getItem('prashaant_lead_tracked');
        if (!alreadyFired) {
          if (typeof window.fbq === 'function') {
            window.fbq('track', 'Lead', {
              content_name: 'Clinic Patient Enquiry Lead',
              content_category: improvementArea || 'Clinic Growth',
            });
          }
          if (typeof window.gtag === 'function') {
            window.gtag('event', 'generate_lead', {
              event_category: 'Lead Form',
              event_label: clinicName,
            });
          }
          sessionStorage.setItem('prashaant_lead_tracked', '1');
        }
      } catch (err) {
        // Ensure tracking blockers never block redirect
      }

      // Redirect to dedicated /thank-you page
      window.location.href = '/thank-you';
    });
  }

  // 2. Smooth scroll + focus First Name input when clicking any Lead CTA
  const leadLinks = document.querySelectorAll('a[href="#lead-form-section"]');
  const firstNameInput = document.getElementById('firstName');
  const leadSection = document.getElementById('lead-form-section');

  leadLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      if (leadSection) {
        e.preventDefault();
        leadSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (firstNameInput) {
          setTimeout(() => {
            firstNameInput.focus({ preventScroll: true });
          }, 450);
        }
      }
    });
  });

  // 3. Hide Mobile Sticky CTA when the Lead Form Section is on screen
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
