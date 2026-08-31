/**
 * Hapitec Investment Limited - Application Main JavaScript
 */

import { jsPDF } from 'jspdf';

document.addEventListener('DOMContentLoaded', () => {
  initSiteIntro();
  initMobileMenu();
  initHeaderScroll();
  initGalleryLightbox();
  initGalleryFilter();
  initSmoothScroll();
  initInquiryForm();
  initInvoiceForm();
  initScrollReveal();
  initActiveNav();
  initBackToTop();
});

/**
 * Animated site opening intro
 */
function initSiteIntro() {
  const intro = document.querySelector('.site-intro');
  if (!intro) return;

  const hideIntro = () => {
    intro.classList.add('hidden');
    setTimeout(() => {
      intro.remove();
    }, 700);
  };

  if (document.readyState === 'complete') {
    setTimeout(hideIntro, 800);
  } else {
    window.addEventListener('load', () => {
      setTimeout(hideIntro, 800);
    });
  }
}

/**
 * Mobile navigation toggle setup
 */
function initMobileMenu() {
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const siteHeader = document.querySelector('.site-header');
  const mainNav = document.querySelector('.main-nav');

  if (!menuToggle || !siteHeader || !mainNav) return;

  menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isExpanded));
    siteHeader.classList.toggle('nav-open', !isExpanded);
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      siteHeader.classList.remove('nav-open');
    });
  });
}

/**
 * Header scroll shadow effect
 */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 20) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  });
}

/**
 * Gallery and Awards Lightbox Modal
 */
function initGalleryLightbox() {
  const selectors = [
    '.gallery-grid a',
    '.awards-grid a',
    '.service-card-img',
    '.about-image img',
    '.contact-image img',
    '.hero-image--featured img',
  ].join(', ');

  const links = document.querySelectorAll(selectors);
  if (!links.length) return;

  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox-modal';
  lightbox.setAttribute('aria-hidden', 'true');
  lightbox.innerHTML = `
    <div class="lightbox-overlay"></div>
    <div class="lightbox-content">
      <button class="lightbox-close" aria-label="Close modal">&times;</button>
      <img class="lightbox-image" src="" alt="" />
      <p class="lightbox-caption"></p>
    </div>
  `;
  document.body.appendChild(lightbox);

  const imgElement = lightbox.querySelector('.lightbox-image');
  const captionElement = lightbox.querySelector('.lightbox-caption');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const overlay = lightbox.querySelector('.lightbox-overlay');

  const openLightbox = (src, alt) => {
    imgElement.src = src;
    imgElement.alt = alt;
    captionElement.textContent = alt;
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  links.forEach((el) => {
    el.style.cursor = 'zoom-in';
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'button');
    el.setAttribute('aria-label', 'View larger image');

    const getSrc = () => {
      if (el.tagName === 'A') return el.href;
      return el.querySelector('img')?.src || el.src;
    };

    const getAlt = () => {
      if (el.tagName === 'A') return el.querySelector('img')?.alt || 'Hapitec Project Showcase';
      return el.alt || 'Hapitec Project Showcase';
    };

    el.addEventListener('click', (e) => {
      e.preventDefault();
      openLightbox(getSrc(), getAlt());
    });

    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(getSrc(), getAlt());
      }
    });
  });

  closeBtn?.addEventListener('click', closeLightbox);
  overlay?.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/**
 * Gallery category filter
 */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.gallery-grid a[data-category]');
  if (!filterBtns.length || !items.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      items.forEach((item) => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
}

/**
 * Smooth scrolling for internal anchor links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });
}

/**
 * Inquiry / Order form submission
 */
function initInquiryForm() {
  const form = document.getElementById('inquiry-form');
  const success = document.getElementById('inquiry-success');
  if (!form || !success) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');

    const mailtoLink = `mailto:hapiteclimited@gmail.com?subject=${encodeURIComponent(`[${subject}] Inquiry from ${name}`)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\nPhone: ${formData.get('phone')}\n\nMessage:\n${message}`)}`;

    window.location.href = mailtoLink;

    form.reset();
    success.setAttribute('aria-hidden', 'false');
    setTimeout(() => {
      success.setAttribute('aria-hidden', 'true');
    }, 6000);
  });
}

/**
 * Invoice generation and preview
 */
function initInvoiceForm() {
  const form = document.getElementById('invoice-form');
  const itemsContainer = document.getElementById('invoice-items');
  const addItemBtn = document.getElementById('add-item-btn');
  const generateBtn = document.getElementById('generate-invoice-btn');
  const productSelect = document.getElementById('product-select');
  const addProductBtn = document.getElementById('add-product-btn');

  const previewCustomer = document.getElementById('preview-customer');
  const previewAddress = document.getElementById('preview-address');
  const previewEmail = document.getElementById('preview-email');
  const previewPhone = document.getElementById('preview-phone');
  const previewDate = document.getElementById('preview-date');
  const previewItems = document.getElementById('preview-items');
  const previewSubtotal = document.getElementById('preview-subtotal');
  const previewTax = document.getElementById('preview-tax');
  const previewDiscount = document.getElementById('preview-discount');
  const previewTotal = document.getElementById('preview-total');
  const previewInvNumber = document.getElementById('preview-inv-number');
  const invDateInput = document.getElementById('inv-date');

  if (!form || !itemsContainer) return;

  const today = new Date().toISOString().split('T')[0];
  if (invDateInput) invDateInput.value = today;

  const getCurrencySymbol = (currency) => {
    const symbols = { ZMW: 'ZMW ', USD: '$', EUR: '€', GBP: '£' };
    return symbols[currency] || currency + ' ';
  };

  const updatePreview = () => {
    const customer = form.querySelector('#inv-customer')?.value || '-';
    const address = form.querySelector('#inv-address')?.value || '-';
    const email = form.querySelector('#inv-email')?.value || '-';
    const phone = form.querySelector('#inv-phone')?.value || '-';
    const date = form.querySelector('#inv-date')?.value || '-';
    const taxRate = parseFloat(form.querySelector('#inv-tax')?.value) || 0;
    const discountRate = parseFloat(form.querySelector('#inv-discount')?.value) || 0;
    const currency = form.querySelector('#inv-currency')?.value || 'ZMW';
    const symbol = getCurrencySymbol(currency);

    if (previewCustomer) previewCustomer.textContent = customer;
    if (previewAddress) previewAddress.textContent = address;
    if (previewEmail) previewEmail.textContent = email;
    if (previewPhone) previewPhone.textContent = phone;
    if (previewDate) previewDate.textContent = date;

    const itemEls = itemsContainer.querySelectorAll('.invoice-item');
    let subtotal = 0;
    let rows = '';

    itemEls.forEach((el) => {
      const desc = el.querySelector('.item-desc')?.value || '';
      const qty = parseFloat(el.querySelector('.item-qty')?.value) || 0;
      const price = parseFloat(el.querySelector('.item-price')?.value) || 0;
      const total = qty * price;
      subtotal += total;

      if (desc || qty || price) {
        rows += `<tr><td>${desc}</td><td>${qty}</td><td>${symbol}${price.toFixed(2)}</td><td>${symbol}${total.toFixed(2)}</td></tr>`;
      }
    });

    if (!rows) rows = '<tr><td colspan="4">Add items to see preview</td></tr>';
    if (previewItems) previewItems.innerHTML = rows;

    const tax = subtotal * (taxRate / 100);
    const discount = subtotal * (discountRate / 100);
    const total = Math.max(0, subtotal + tax - discount);

    if (previewSubtotal) previewSubtotal.textContent = `${symbol}${subtotal.toFixed(2)}`;
    if (previewTax) previewTax.textContent = `${symbol}${tax.toFixed(2)}`;
    if (previewDiscount) previewDiscount.textContent = `${symbol}${discount.toFixed(2)}`;
    if (previewTotal) previewTotal.textContent = `${symbol}${total.toFixed(2)}`;
  };

  const addItemRow = (description = '', price = '') => {
    const div = document.createElement('div');
    div.className = 'invoice-item';
    div.innerHTML = `
      <input type="text" placeholder="Item description" class="item-desc" value="${description}" required />
      <input type="number" placeholder="Qty" class="item-qty" min="1" value="1" required />
      <input type="number" placeholder="Price" class="item-price" min="0" step="0.01" value="${price}" required />
      <button type="button" class="item-remove" aria-label="Remove item">&times;</button>
    `;
    itemsContainer.appendChild(div);

    const removeBtn = div.querySelector('.item-remove');
    removeBtn.addEventListener('click', () => {
      div.remove();
      updatePreview();
    });

    div.querySelectorAll('input').forEach((input) => {
      input.addEventListener('input', updatePreview);
    });
  };

  if (addItemBtn) {
    addItemBtn.addEventListener('click', () => addItemRow());
  }

  if (addProductBtn && productSelect) {
    addProductBtn.addEventListener('click', () => {
      const value = productSelect.value;
      if (!value) return;

      const [description, pricePart] = value.split(' | ');
      const price = pricePart ? pricePart.replace(/[^0-9.]/g, '') : '';
      addItemRow(description, price);
      productSelect.value = '';
    });
  }

  itemsContainer.querySelectorAll('.item-remove').forEach((btn) => {
    btn.addEventListener('click', () => {
      btn.closest('.invoice-item')?.remove();
      updatePreview();
    });
  });

  form.querySelectorAll('input, select').forEach((input) => {
    input.addEventListener('input', updatePreview);
    input.addEventListener('change', updatePreview);
  });

  if (generateBtn) {
    generateBtn.addEventListener('click', () => {
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const customer = form.querySelector('#inv-customer')?.value || 'Customer';
      const date = form.querySelector('#inv-date')?.value || today;
      const taxRate = parseFloat(form.querySelector('#inv-tax')?.value) || 0;
      const discountRate = parseFloat(form.querySelector('#inv-discount')?.value) || 0;
      const currency = form.querySelector('#inv-currency')?.value || 'ZMW';
      const symbol = getCurrencySymbol(currency);

      const itemEls = itemsContainer.querySelectorAll('.invoice-item');
      let subtotal = 0;
      const lines = [];

      itemEls.forEach((el) => {
        const desc = el.querySelector('.item-desc')?.value || '';
        const qty = parseFloat(el.querySelector('.item-qty')?.value) || 0;
        const price = parseFloat(el.querySelector('.item-price')?.value) || 0;
        const total = qty * price;
        subtotal += total;
        if (desc) lines.push({ desc, qty, price, total });
      });

      if (!lines.length) {
        alert('Please add at least one item.');
        return;
      }

      const tax = subtotal * (taxRate / 100);
      const discount = subtotal * (discountRate / 100);
      const total = Math.max(0, subtotal + tax - discount);

      const invNumber = `INV-${Date.now().toString().slice(-6)}`;
      if (previewInvNumber) previewInvNumber.textContent = invNumber;

      const doc = new jsPDF({ unit: 'mm', format: 'a4' });

      doc.addImage('hapitec-company-logo/Hapitec Fully Transparent.png', 'PNG', 14, 10, 20, 20);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(0, 117, 128);
      doc.text('Hapitec Investment Limited', 42, 18);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(90, 107, 122);
      doc.text('Solwezi Road, Copperbelt Province, Zambia', 42, 24);
      doc.text('hapiteclimited@gmail.com | +260 967089743/0971213302', 42, 29);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(32, 53, 66);
      doc.text(`Invoice #: ${invNumber}`, 140, 20);
      doc.text(`Date: ${date}`, 140, 26);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(32, 53, 66);
      doc.text('Bill To:', 14, 42);
      doc.text(customer, 14, 48);
      const address = form.querySelector('#inv-address')?.value || '';
      const phone = form.querySelector('#inv-phone')?.value || '';
      const email = form.querySelector('#inv-email')?.value || '';
      if (address) doc.text(address, 14, 54);
      if (email) doc.text(email, 14, 60);
      if (phone) doc.text(phone, 14, 66);

      let y = 80;
      doc.setFillColor(241, 165, 48);
      doc.rect(14, y, 182, 8, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text('Description', 16, y + 5.5);
      doc.text('Qty', 110, y + 5.5);
      doc.text('Price', 130, y + 5.5);
      doc.text('Total', 160, y + 5.5);
      y += 8;

      doc.setTextColor(32, 53, 66);
      lines.forEach((line) => {
        doc.setFont('helvetica', 'normal');
        doc.text(line.desc, 16, y);
        doc.text(String(line.qty), 110, y);
        doc.text(`${symbol}${line.price.toFixed(2)}`, 130, y);
        doc.text(`${symbol}${line.total.toFixed(2)}`, 160, y);
        y += 7;
      });

      y += 4;
      doc.setDrawColor(0, 117, 128);
      doc.setLineWidth(0.3);
      doc.line(14, y, 196, y);
      y += 6;

      doc.setFont('helvetica', 'normal');
      doc.text(`Subtotal: ${symbol}${subtotal.toFixed(2)}`, 130, y);
      y += 6;
      doc.text(`Tax: ${symbol}${tax.toFixed(2)}`, 130, y);
      y += 6;
      doc.text(`Discount: ${symbol}${discount.toFixed(2)}`, 130, y);
      y += 6;
      doc.setFont('helvetica', 'bold');
      doc.text(`Total: ${symbol}${total.toFixed(2)}`, 130, y);

      y += 14;
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9);
      doc.setTextColor(90, 107, 122);
      doc.text('Thank you for your business! Terms: Payment due within 30 days.', 14, y);

      doc.save(`${invNumber}.pdf`);
    });
  }
}

/**
 * Scroll reveal animations
 */
function initScrollReveal() {
  const reveals = document.querySelectorAll(
    '.section-header, .about-text, .about-image, .doc-image-card, .service-card, .why-grid article, .gallery-grid a, .awards-grid a, .testimonial-grid article, .contact-card, .inquiry-form-wrapper, .invoice-layout'
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  reveals.forEach((el) => {
    el.classList.add('reveal');
    observer.observe(el);
  });
}

/**
 * Active nav highlighting based on scroll position
 */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: '-80px 0px -60% 0px',
    }
  );

  sections.forEach((section) => observer.observe(section));
}

/**
 * Back to top button
 */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        btn.classList.toggle('visible', window.scrollY > 600);
        ticking = false;
      });
      ticking = true;
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
