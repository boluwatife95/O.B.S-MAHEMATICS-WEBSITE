/* ==================================================
   MAIN JAVASCRIPT
   1. Tab navigation
   2. Mobile navigation toggle
   3. Contact form
   4. Registration form
   5. Mailchimp form feedback
   6. Active nav link highlight
   7. Navbar shadow on scroll
   8. Thank-you popup
   ================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ============ 1. TAB NAVIGATION ============ */
  const tabLinks = document.querySelectorAll('.tab-link');
  const sections = {
    home: document.getElementById('home'),
    about: document.getElementById('about'),
    books: document.getElementById('books'),
    teaching: document.getElementById('teaching'),
    resources: document.getElementById('resources'),
    registration: document.getElementById('registration'),
    contact: document.getElementById('contact')
  };

  function activateTab(targetId) {
    Object.values(sections).forEach(section => {
      if (section) section.classList.remove('active');
    });

    if (sections[targetId]) {
      sections[targetId].classList.add('active');
    }

    document.querySelectorAll('.tab-link').forEach(link => {
      link.classList.remove('active-link');
    });
    document.querySelectorAll(`.tab-link[href="#${targetId}"]`).forEach(link => {
      link.classList.add('active-link');
    });

    const navUl = document.getElementById('navLinks');
    const burger = document.getElementById('hamburger');
    if (navUl) navUl.classList.remove('open');
    if (burger) burger.textContent = '☰';

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  tabLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.substring(1);
        if (sections[targetId]) {
          activateTab(targetId);
          history.replaceState(null, '', href);
        }
      }
    });
  });

  if (window.location.hash) {
    const initialId = window.location.hash.substring(1);
    if (sections[initialId]) {
      activateTab(initialId);
    }
  }

  /* ============ 2. MOBILE NAV TOGGLE ============ */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      hamburger.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.textContent = '☰';
      });
    });

    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
        navLinks.classList.remove('open');
        hamburger.textContent = '☰';
      }
    });
  }

  /* ============ 3. CONTACT FORM ============ */
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;

      const name = contactForm.querySelector('[name="name"]').value.trim();
      const email = contactForm.querySelector('[name="email"]').value.trim();
      const message = contactForm.querySelector('[name="message"]').value.trim();

      if (!name || !email || !message) {
        alert('Please fill in your name, email, and message.');
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        alert('Please enter a valid email address.');
        return;
      }

      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      try {
        const formData = new FormData(contactForm);
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          submitBtn.textContent = '✓ Message Sent!';
          submitBtn.style.background = '#10b981';
          contactForm.reset();
          setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
          }, 3500);
        } else {
          throw new Error('Form submission failed');
        }
      } catch (err) {
        const purpose = contactForm.querySelector('[name="purpose"]')?.value || '';
        const whatsappNumber = '2349037961122';
        const text = encodeURIComponent(
          `Hello, my name is ${name}.\nPurpose: ${purpose}\nMessage: ${message}`
        );
        window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  /* ============ 4. REGISTRATION FORM ============ */
  const registrationForm = document.getElementById('registrationForm');

  if (registrationForm) {
    registrationForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = registrationForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;

      const name = registrationForm.querySelector('[name="name"]').value.trim();
      const email = registrationForm.querySelector('[name="email"]').value.trim();
      const dialCode = registrationForm.querySelector('[name="dial_code"]')?.value || '';
      const phoneLocal = registrationForm.querySelector('[name="phone_local"]')?.value.trim() || '';
      const phone = `${dialCode}${phoneLocal.replace(/^0+/, '')}`;
      const level = registrationForm.querySelector('[name="level"]').value.trim();
      const plan = registrationForm.querySelector('[name="plan"]')?.value || '';
      const country = registrationForm.querySelector('[name="country"]')?.value || '';
      const message = registrationForm.querySelector('[name="message"]')?.value || '';
      const consent = registrationForm.querySelector('[name="consent"]')?.checked;

      if (!name || !email || !phoneLocal || !level) {
        alert('Please fill in all required fields (Name, Email, Phone, Level).');
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        alert('Please enter a valid email address.');
        return;
      }

      if (!consent) {
        alert('Please tick the consent checkbox to continue.');
        return;
      }

      // Write the combined phone number into the hidden field
      const hiddenPhone = registrationForm.querySelector('#regPhoneFull');
      if (hiddenPhone) hiddenPhone.value = phone;

      submitBtn.textContent = 'Submitting...';
      submitBtn.disabled = true;

      try {
        const formData = new FormData(registrationForm);
        const response = await fetch(registrationForm.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          submitBtn.textContent = '✓ Registered!';
          submitBtn.style.background = '#10b981';
          registrationForm.reset();
          setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
          }, 3500);
        } else {
          throw new Error('Registration failed');
        }
      } catch (err) {
        const whatsappNumber = '2349037961122';
        const text = encodeURIComponent(
          `Hello, I want to register for lessons.\n\n` +
          `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n` +
          `Country: ${country}\nLevel: ${level}\nPlan: ${plan}\nNotes: ${message}`
        );
        window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  /* ============ 5. MAILCHIMP FORM FEEDBACK ============ */
  const mailchimpForms = document.querySelectorAll('form[action*="list-manage.com"]');
  mailchimpForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      const emailInput = form.querySelector('input[type="email"]');
      const email = emailInput.value.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        e.preventDefault();
        alert('Please enter a valid email address.');
        emailInput.focus();
        return;
      }
    });
  });

  /* ============ 6. ACTIVE NAV LINK HIGHLIGHT ============ */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar a:not(.tab-link)').forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage) {
      link.style.color = 'var(--primary)';
      link.style.fontWeight = '700';
    }
  });

  /* ============ 7. NAVBAR SHADOW ON SCROLL ============ */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.style.boxShadow = window.scrollY > 20
        ? '0 4px 20px rgba(0,0,0,0.1)'
        : '0 2px 10px rgba(0,0,0,0.05)';
    });
  }

  /* ============ 8. THANK-YOU POPUP ============ */
  (function showThankYouPopup() {
    if (sessionStorage.getItem('thankYouPopupSeen') === 'true') return;

    const style = document.createElement('style');
    style.textContent = `
      .ty-popup-overlay {
        position: fixed; inset: 0; background: rgba(17, 24, 39, 0.6);
        display: flex; align-items: center; justify-content: center;
        z-index: 2000; padding: 1rem; opacity: 0;
        animation: tyFadeIn 0.35s ease forwards; backdrop-filter: blur(3px);
      }
      @keyframes tyFadeIn { to { opacity: 1; } }
      .ty-popup-card {
        background: #fff; border-radius: 20px; max-width: 480px; width: 100%;
        padding: 2.2rem 1.8rem 1.8rem; text-align: center;
        box-shadow: 0 25px 60px rgba(0,0,0,0.3); position: relative;
        transform: translateY(15px) scale(0.97);
        animation: tyPopIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) 0.1s forwards;
        border-top: 6px solid var(--accent, #fbbf24);
      }
      @keyframes tyPopIn { to { transform: translateY(0) scale(1); } }
      .ty-popup-emoji { font-size: 2.8rem; line-height: 1; margin-bottom: 0.4rem; }
      .ty-popup-title { font-size: 1.4rem; font-weight: 800; color: var(--primary, #1e40af); margin-bottom: 1rem; }
      .ty-popup-message {
        font-size: 1rem; line-height: 1.65; color: var(--gray, #6b7280);
        margin-bottom: 1.5rem; font-style: italic; background: #f9fafb;
        padding: 1.1rem 1.2rem; border-radius: 12px;
        border-left: 4px solid var(--accent, #fbbf24); text-align: left;
      }
      .ty-popup-message strong { color: var(--primary, #1e40af); font-style: normal; font-weight: 700; }
      .ty-popup-close {
        background: var(--primary, #1e40af); color: #fff; border: none;
        padding: 0.85rem 2rem; border-radius: 50px; font-size: 1rem;
        font-weight: 700; cursor: pointer; width: 100%;
        transition: transform 0.2s, background 0.2s, box-shadow 0.2s;
      }
      .ty-popup-close:hover {
        background: var(--primary-dark, #1e3a8a);
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(30, 64, 175, 0.3);
      }
      .ty-popup-x {
        position: absolute; top: 12px; right: 14px; background: transparent;
        border: none; font-size: 1.4rem; cursor: pointer; color: #9ca3af;
        line-height: 1; padding: 4px 8px; border-radius: 6px;
        transition: background 0.2s, color 0.2s;
      }
      .ty-popup-x:hover { background: #f3f4f6; color: #111827; }
      @media (max-width: 480px) {
        .ty-popup-card { padding: 1.8rem 1.2rem 1.4rem; }
        .ty-popup-title { font-size: 1.2rem; }
        .ty-popup-message { font-size: 0.93rem; padding: 0.9rem 1rem; }
        .ty-popup-emoji { font-size: 2.3rem; }
      }
    `;
    document.head.appendChild(style);

    const overlay = document.createElement('div');
    overlay.className = 'ty-popup-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'tyPopupTitle');
    overlay.innerHTML = `
      <div class="ty-popup-card">
        <button class="ty-popup-x" aria-label="Close popup" title="Close">✕</button>
        <div class="ty-popup-emoji">🎉🎂🎓</div>
        <h2 class="ty-popup-title" id="tyPopupTitle">Happy Birthday, Brother Busyi!,Long life and prosperity in good and sound healt in jesus name.</h2>
        <p class="ty-popup-message">
          Thank you so much <strong>brother Busyi</strong> for sponsoring my learning in
          <strong>Kinplus</strong>. I will forever be grateful.so i thought of what to give you as your birthday gift..but i dont have anything...So i decided to make this for you....Though yet to finish it all..Because i will need some of your details..to include there..Thats why
             And also if theres anything you want me to take away...or add..you can tell me..i will work on it.
          <br><br>
          <strong>Happy birthday to you once again! 🎈</strong>
        </p>
        <button class="ty-popup-close">Thank You &amp; Continue</button>
      </div>
    `;
    document.body.appendChild(overlay);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const closePopup = () => {
      overlay.style.animation = 'tyFadeIn 0.25s ease reverse forwards';
      overlay.style.opacity = '0';
      setTimeout(() => {
        overlay.remove();
        document.body.style.overflow = previousOverflow || '';
        sessionStorage.setItem('thankYouPopupSeen', 'true');
      }, 240);
      document.removeEventListener('keydown', escHandler);
    };

    overlay.querySelector('.ty-popup-close').addEventListener('click', closePopup);
    overlay.querySelector('.ty-popup-x').addEventListener('click', closePopup);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closePopup();
    });
    const escHandler = (e) => { if (e.key === 'Escape') closePopup(); };
    document.addEventListener('keydown', escHandler);

    setTimeout(() => {
      overlay.querySelector('.ty-popup-close')?.focus();
    }, 350);
  })();

});