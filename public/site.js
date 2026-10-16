'use strict';
/* Public contact details taken from the mockup. Replace before publishing.
   Empty social links deliberately show a notice, not an unrelated profile. */
const SITE_CONFIG = Object.freeze({
  phone: '+995568380380',
  phoneLabel: '+995 568 380 380',
  email: 'info@honda-parts.ru',
  address: 'Evgenia Maisuradze St, Tbilisi 0100',
  hours: 'ყოველდღე 09:00–20:00',
  socialLinks: { facebook: '', instagram: '' }
});

(() => {
  const $ = (query, root = document) => root.querySelector(query);
  const $$ = (query, root = document) => [...root.querySelectorAll(query)];
  const header = $('.site-header');
  const menuButton = $('.menu-toggle');
  const mobileNav = $('#mobile-nav');
  const dialog = $('#inquiry-dialog');
  const form = $('#inquiry-form');
  const result = $('#inquiry-result');
  const toast = $('#toast');
  let toastTimer;
  let lastTrigger;
  let requestText = '';
  let activeContext = 'ზოგადი კონსულტაცია';

  // Keep repeated contact elements in sync with the configuration above.
  $$('[data-phone-link]').forEach(el => { el.href = 'tel:' + SITE_CONFIG.phone; });
  $$('[data-phone-label]').forEach(el => { el.textContent = SITE_CONFIG.phoneLabel; });
  $$('[data-email-link]').forEach(el => { el.href = 'mailto:' + SITE_CONFIG.email; });
  $$('[data-email-label]').forEach(el => { el.textContent = SITE_CONFIG.email; });
  $$('[data-address]').forEach(el => { el.textContent = SITE_CONFIG.address; });
  $$('[data-hours]').forEach(el => { el.textContent = SITE_CONFIG.hours; });

  function notify(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('visible');
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 4500);
  }
  function closeMenu() {
    mobileNav.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'მენიუს გახსნა');
    $('.menu-open-icon', menuButton).hidden = false;
    $('.menu-close-icon', menuButton).hidden = true;
  }
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    mobileNav.hidden = isOpen;
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'მენიუს გახსნა' : 'მენიუს დახურვა');
    $('.menu-open-icon', menuButton).hidden = !isOpen;
    $('.menu-close-icon', menuButton).hidden = isOpen;
  });
  $$('a', mobileNav).forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('click', event => {
    if (!header.contains(event.target)) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });
  window.matchMedia('(min-width: 901px)').addEventListener('change', event => {
    if (event.matches) closeMenu();
  });

  const contexts = {
    consultation: ['მიიღეთ კონსულტაცია', 'მოგვწერეთ, რა სჭირდება თქვენს Honda-ს. მიუთითეთ მოდელი, გამოშვების წელი და სასურველი ნაწილი — ეს სპეციალისტს დახმარებას გაუადვილებს.'],
    vin: ['ავტონაწილების შერჩევა VIN-ით', 'დაგეხმარებით თავსებადი ნაწილების VIN-კოდით შერჩევაში. VIN მიუთითეთ ფორმაში; იაპონური ბაზრის ავტომობილის შემთხვევაში ძარის ნომერი ჩაწერეთ კომენტარში.'],
    diagnostic: ['Honda-ს დიაგნოსტიკა', 'აღწერეთ პრობლემა ან სიმპტომები. მიუთითეთ მოდელი და გამოშვების წელი — სპეციალისტი გირჩევთ შემდეგ ნაბიჯს.'],
    body: ['Honda-ს ძარის ნაწილები', 'ორიგინალი ნაწილები და ხარისხიანი ანალოგები ძარის შესაკეთებლად. მიუთითეთ სასურველი ნაწილი, მოდელი და გამოშვების წელი.'],
    suspension: ['Honda-ს სავალი ნაწილი', 'დაკიდების, სამუხრუჭე სისტემისა და საჭის მექანიზმის ნაწილების შერჩევა. მიუთითეთ მოდელი, წელი და საჭირო ნაწილი.'],
    delivery: ['მიწოდების დაზუსტება', 'კომენტარში მიუთითეთ საჭირო ნაწილი და ქალაქი. სპეციალისტი დაგიზუსტებთ მარაგს, მიღების გზასა და მიწოდების ფასს.'],
    fit: ['ავტონაწილები Honda FIT-ისთვის', 'Honda FIT · 2011–2025. ორიგინალი ნაწილებისა და ხარისხიანი ანალოგების შერჩევა მოდელის, გამოშვების წლის ან VIN-ის მიხედვით.'],
    hrv: ['ავტონაწილები Honda HR-V-ისთვის', 'Honda HR-V · 2011–2025. ძარისა და სავალი ნაწილის დეტალები, ორიგინალი ნაწილები და ხარისხიანი ანალოგები.'],
    vezel: ['ავტონაწილები Honda VEZEL-ისთვის', 'Honda VEZEL · 2011–2025. დაგეხმარებით საჭირო ნაწილების პოვნასა და თქვენს ავტომობილთან თავსებადობის შემოწმებაში.']
  };
  const modelValues = { fit: 'Honda FIT', hrv: 'Honda HR-V', vezel: 'Honda VEZEL' };
  function openInquiry(key, trigger) {
    const [title, description] = contexts[key] || contexts.consultation;
    lastTrigger = trigger;
    activeContext = title;
    $('#dialog-title').textContent = title;
    $('#dialog-description').textContent = description;
    form.reset();
    form.hidden = false;
    result.hidden = true;
    $('#car-model').value = modelValues[key] || '';
    $('#request-context').value = title;
    $('#vin-field').hidden = !(key === 'vin' || Boolean(modelValues[key]));
    closeMenu();
    dialog.showModal();
    document.body.classList.add('dialog-open');
    // A native <dialog> provides focus trapping, inert background and Escape.
    window.setTimeout(() => $('#customer-name').focus({ preventScroll: true }), 30);
  }
  $$('[data-inquiry]').forEach(button => {
    button.addEventListener('click', () => openInquiry(button.dataset.inquiry, button));
  });
  $('.dialog-close', dialog).addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
    lastTrigger?.focus({ preventScroll: true });
  });
  const nameInput = $('#customer-name');
  nameInput.addEventListener('invalid', () => {
    if (!nameInput.value.trim()) nameInput.setCustomValidity('გთხოვთ, მიუთითოთ თქვენი სახელი.');
  });
  nameInput.addEventListener('input', () => nameInput.setCustomValidity(''));
  const phoneInput = $('#customer-phone');
  phoneInput.addEventListener('invalid', () => {
    if (!phoneInput.value.trim()) phoneInput.setCustomValidity('გთხოვთ, მიუთითოთ ტელეფონის ნომერი.');
  });
  phoneInput.addEventListener('input', () => {
    phoneInput.setCustomValidity('');
  });
  const vinInput = $('#car-vin');
  vinInput.addEventListener('input', () => {
    vinInput.value = vinInput.value.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, '').slice(0, 17);
    vinInput.setCustomValidity('');
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const phone = phoneInput.value.trim();
    if (phone.replace(/\D/g, '').length < 7 || phone.replace(/\D/g, '').length > 15) {
      phoneInput.setCustomValidity('მიუთითეთ ტელეფონის ნომერი: 7-დან 15-მდე ციფრი.');
      phoneInput.reportValidity();
      return;
    }
    if (vinInput.value && !$('#vin-field').hidden && vinInput.value.length !== 17) {
      vinInput.setCustomValidity('VIN უნდა შეიცავდეს 17 სიმბოლოს. ძარის ნომერი შეგიძლიათ კომენტარში მიუთითოთ.');
      vinInput.reportValidity();
      return;
    }
    if (!form.reportValidity()) return;
    const values = new FormData(form);
    const lines = [
      'განაცხადი Honda Parts-ის ვებსაიტიდან',
      '',
      'თემა: ' + activeContext,
      'სახელი: ' + String(values.get('name')).trim(),
      'ტელეფონი: ' + phone,
      'მოდელი: ' + (values.get('model') || 'არ არის მითითებული'),
      'გამოშვების წელი: ' + (values.get('year') || 'არ არის მითითებული')
    ];
    if (values.get('vin') && !$('#vin-field').hidden) lines.push('VIN: ' + values.get('vin'));
    if (String(values.get('message') || '').trim()) lines.push('', 'კომენტარი: ' + String(values.get('message')).trim());
    requestText = lines.join('\n');
    $('#result-preview').textContent = requestText;
    $('#email-request').href = 'mailto:' + SITE_CONFIG.email + '?subject=' + encodeURIComponent(activeContext + ' — Honda Parts') + '&body=' + encodeURIComponent(requestText);
    form.hidden = true;
    result.hidden = false;
    $('#result-title').focus({ preventScroll: true });
    result.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
  });
  $('#edit-request').addEventListener('click', () => {
    result.hidden = true;
    form.hidden = false;
    $('#customer-name').focus();
  });
  $('#copy-request').addEventListener('click', async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(requestText);
      } else {
        const area = document.createElement('textarea');
        area.value = requestText;
        area.style.cssText = 'position:fixed;opacity:0;left:0;top:0';
        dialog.append(area);
        area.select();
        const success = document.execCommand('copy');
        area.remove();
        if (!success) throw new Error('Clipboard unavailable');
      }
      notify('განაცხადის ტექსტი დაკოპირებულია.');
    } catch {
      notify('ავტომატური კოპირება ვერ მოხერხდა. მონიშნეთ და დააკოპირეთ ტექსტი ხელით.');
    }
  });
  $$('[data-social]').forEach(button => button.addEventListener('click', () => {
    const url = SITE_CONFIG.socialLinks[button.dataset.social];
    if (url && /^https:\/\//i.test(url)) window.open(url, '_blank', 'noopener,noreferrer');
    else notify('ბმული ' + button.getAttribute('aria-label') + '-ზე ჯერ მითითებული არ არის. დაგვიკავშირდით ტელეფონით.');
  }));
  const backToTop = $('.back-to-top');
  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
    backToTop.classList.toggle('visible', window.scrollY > 750);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  });
  if ('IntersectionObserver' in window) {
    const navLinks = $$('.desktop-nav a');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            const active = link.getAttribute('href') === '#' + entry.target.id;
            link.classList.toggle('active', active);
            if (active) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
          });
        }
      });
    }, { rootMargin: '-15% 0px -55% 0px', threshold: 0 });
    $$('section[id],footer[id]').forEach(section => observer.observe(section));
  }
})();


// Photos are independent files in the source package and data URIs in the
// single-file edition. Both editions support individual image downloads.
(() => {
  const panel = document.getElementById('assets-dialog');
  const trigger = document.querySelector('[data-open-assets]');
  if (!panel || !trigger) return;
  trigger.addEventListener('click', () => {
    panel.showModal();
    document.body.classList.add('dialog-open');
  });
  panel.querySelector('.asset-close').addEventListener('click', () => panel.close());
  panel.addEventListener('click', event => {
    if (event.target !== panel) return;
    const r = panel.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) panel.close();
  });
  panel.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
    trigger.focus({preventScroll: true});
  });
  panel.querySelectorAll('[data-download-asset]').forEach(link => {
    link.addEventListener('click', event => {
      const href = link.getAttribute('href');
      if (!href.startsWith('data:')) return; // Native download for local assets.
      event.preventDefault();
      const comma = href.indexOf(',');
      const mime = href.slice(5, href.indexOf(';'));
      const bytes = Uint8Array.from(atob(href.slice(comma + 1)), c => c.charCodeAt(0));
      const url = URL.createObjectURL(new Blob([bytes], {type: mime}));
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = link.download;
      panel.append(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 30000);
    });
  });
})();
