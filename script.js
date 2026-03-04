/*
  Ethical Hacker One-Pager interactions
  - Smooth-scrolling anchors
  - Sticky header background on scroll
  - Reveal-on-scroll animations
  - Lightweight form helpers (mailto + subscribe)
*/
(function () {
  'use strict';

  // Prefer reduced motion: disable reveal/smooth scroll when requested
  var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Header scroll state
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (!header) return;
    var y = window.scrollY || window.pageYOffset;
    header.classList.toggle('scrolled', y > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile nav toggle
  var nav = document.querySelector('.nav');
  var toggle = document.querySelector('.nav-toggle');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.getAttribute('data-open') === 'true';
      nav.setAttribute('data-open', String(!open));
      toggle.setAttribute('aria-expanded', String(!open));
    });
  }

  // Smooth in-page navigation
  function isHashLink(el) { return el && el.tagName === 'A' && el.getAttribute('href') && el.getAttribute('href').startsWith('#'); }
  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!(t instanceof Element)) return;
    var a = t.closest('a');
    if (!a || !isHashLink(a)) return;
    var id = a.getAttribute('href');
    if (!id) return;
    var target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    if (nav && nav.getAttribute('data-open') === 'true') {
      nav.setAttribute('data-open', 'false');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    }
    if (prefersReduced) {
      target.scrollIntoView();
    } else {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // move focus for accessibility
    if (target.setAttribute) {
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  });

  // Reveal on scroll
  if (!prefersReduced && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    // If no IO or reduced motion, reveal immediately
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  // Contact form: open mailto with prefilled subject/body
  var form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = /** @type {HTMLInputElement|null} */(document.getElementById('name'));
      var email = /** @type {HTMLInputElement|null} */(document.getElementById('email'));
      var subject = /** @type {HTMLInputElement|null} */(document.getElementById('subject'));
      var sub = encodeURIComponent('Audit Request: ' + (subject && subject.value ? subject.value : 'New Project'));
      var body = [
        'Hi,',
        '',
        'I\'d like to request an ethical hacking engagement.',
        'Name: ' + (name && name.value ? name.value : ''),
        'Email: ' + (email && email.value ? email.value : ''),
        'Project: ' + (subject && subject.value ? subject.value : ''),
        '',
        'Thanks!'
      ].join('%0D%0A');
      window.location.href = 'mailto:hello@example.com?subject=' + sub + '&body=' + body;
    });
  }

  // Subscribe: playful confirmation (non-functional)
  var subscribe = document.querySelector('.subscribe');
  if (subscribe) {
    subscribe.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = /** @type {HTMLInputElement|null} */(document.getElementById('subscribe-email'));
      var msg = 'Subscribed' + (email && email.value ? ': ' + email.value : '!');
      // Use aria-live polite announcement instead of alert for accessibility
      var live = document.getElementById('live');
      if (!live) {
        live = document.createElement('div');
        live.id = 'live';
        live.setAttribute('aria-live', 'polite');
        live.className = 'visually-hidden';
        document.body.appendChild(live);
      }
      live.textContent = msg;
      if (email) email.value = '';
    });
  }

  // Footer year
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();

