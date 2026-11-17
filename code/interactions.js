
(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const prices = { Basic: 9.99, Standard: 12.99, Premium: 14.99 };
  const yearlyPrices = { Basic: 99.99, Standard: 129.99, Premium: 149.99 };
  let billing = 'monthly';

  function notify(message) {
    if (window.StreamVibeToast) return window.StreamVibeToast(message);
    let toast = $('.sv-toast');
    if (!toast) { toast = document.createElement('div'); toast.className = 'sv-toast'; document.body.appendChild(toast); }
    toast.textContent = message; toast.classList.add('show');
    clearTimeout(notify.timer); notify.timer = setTimeout(() => toast.classList.remove('show'), 2600);
  }

  function modal(title, body, actions = '') {
    $('.sv-action-modal')?.remove();
    const overlay = document.createElement('div');
    overlay.className = 'sv-action-modal';
    overlay.innerHTML = `<section class="sv-action-dialog" role="dialog" aria-modal="true" aria-label="${title}">
      <button type="button" class="sv-action-close" aria-label="Close">&times;</button>
      <h2>${title}</h2><div class="sv-action-body">${body}</div><div class="sv-action-buttons">${actions || '<button type="button" class="sv-action-secondary" data-dismiss>Close</button>'}</div>
    </section>`;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('visible'));
    const close = () => { overlay.classList.remove('visible'); setTimeout(() => overlay.remove(), 180); };
    $('.sv-action-close', overlay).addEventListener('click', close);
    overlay.addEventListener('click', e => { if (e.target === overlay || e.target.closest('[data-dismiss]')) close(); });
    document.addEventListener('keydown', function esc(e) { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); } });
    return overlay;
  }

  function updatePrices() {
    const toggle = $('.toggle');
    if (!toggle) return;
    const options = $$('span', toggle);
    options.forEach((option, index) => {
      const active = (billing === 'monthly' && index === 0) || (billing === 'yearly' && index === 1);
      option.classList.toggle('active', active);
      option.setAttribute('role', 'button'); option.setAttribute('tabindex', '0');
      option.setAttribute('aria-pressed', String(active));
    });
    $$('.plan-card').forEach(card => {
      const name = ($('h4', card)?.textContent || '').replace(/\s+Plan/i, '').trim();
      const price = billing === 'monthly' ? prices[name] : yearlyPrices[name];
      const heading = $('h2', card);
      if (heading && price) heading.innerHTML = `$${price.toFixed(2)} <span>/${billing === 'monthly' ? 'month' : 'year'}</span>`;
    });
  }

  function currentPlan(button) {
    const card = button.closest('.plan-card');
    const name = ($('h4', card)?.textContent || 'Basic Plan').trim();
    const amount = billing === 'monthly' ? prices[name.replace(/\s+Plan/i, '')] : yearlyPrices[name.replace(/\s+Plan/i, '')];
    return { name, amount, period: billing };
  }

  function choosePlan(button) {
    const plan = currentPlan(button);
    localStorage.setItem('streamvibe_selected_plan', JSON.stringify(plan));
    modal('Plan selected', `<p>You selected <strong>${plan.name}</strong>.</p><p class="sv-action-price">$${plan.amount.toFixed(2)} / ${plan.period === 'monthly' ? 'month' : 'year'}</p><p>This is a front-end demo. No payment will be taken.</p>`, '<button type="button" class="sv-action-primary" data-dismiss>Continue</button>');
  }

  function startTrial(planName = 'Free Trial') {
    const trial = { name: planName, startedAt: new Date().toISOString(), status: 'demo' };
    localStorage.setItem('streamvibe_trial', JSON.stringify(trial));
    modal('Your free trial is ready', `<p>Your <strong>${planName}</strong> trial has been activated in this browser demo.</p><p>No account or payment details are collected, and no real subscription is created.</p>`, '<button type="button" class="sv-action-primary" data-dismiss>Got it</button>');
  }

  function titleFromHero() {
    return $(' .hero-content h1')?.textContent?.trim() || $('h1')?.textContent?.trim() || 'Featured title';
  }

  function handleHeroAction(button) {
    const title = titleFromHero();
    const icon = $('i', button);
    if (button.classList.contains('play-btn')) {
      const description = $('.hero-content p')?.textContent?.trim() || 'Explore this featured title on StreamVibe.';
      modal(`Preview: ${title}`, `<p>${description}</p><p>This project preview does not include a connected video stream yet.</p>`);
      return;
    }
    if (icon?.classList.contains('bi-plus')) {
      const item = window.StreamVibe?.catalog?.find(x => x.name.toLowerCase() === title.toLowerCase());
      if (item) {
        const saved = JSON.parse(localStorage.getItem('streamvibe_watchlist') || '[]');
        if (!saved.includes(item.name)) saved.push(item.name); else saved.splice(saved.indexOf(item.name), 1);
        localStorage.setItem('streamvibe_watchlist', JSON.stringify(saved));
        const count = document.querySelector('[data-count="watchlist"]');
        if (count) count.textContent = String(saved.length);
        notify(saved.includes(item.name) ? `${item.name} added to Watchlist` : `${item.name} removed from Watchlist`);
      } else notify('This title is not in the demo catalog yet.');
      return;
    }
    if (icon?.classList.contains('bi-hand-thumbs-up')) {
      const likes = JSON.parse(localStorage.getItem('streamvibe_liked_titles') || '[]');
      const exists = likes.includes(title);
      localStorage.setItem('streamvibe_liked_titles', JSON.stringify(exists ? likes.filter(x => x !== title) : [...likes, title]));
      button.classList.toggle('active', !exists);
      notify(exists ? 'Like removed' : `You liked ${title}`);
      return;
    }
    if (icon?.classList.contains('bi-volume-up')) {
      button.classList.toggle('active');
      notify(button.classList.contains('active') ? 'Sound preference enabled' : 'Sound preference disabled');
    }
  }

  function setup() {
    if ($('.toggle')) {
      updatePrices();
      $$('.toggle span').forEach((option, index) => {
        const activate = () => { billing = index === 0 ? 'monthly' : 'yearly'; updatePrices(); };
        option.addEventListener('click', activate);
        option.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); } });
      });
    }

    document.addEventListener('click', event => {
      const trialButton = event.target.closest('.trial, .cta-btn');
      if (trialButton) {
        const card = trialButton.closest('.plan-card');
        const planName = card ? $('h4', card)?.textContent?.trim() || 'Free Trial' : 'Free Trial';
        startTrial(planName); return;
      }
      const chooseButton = event.target.closest('.choose');
      if (chooseButton) { choosePlan(chooseButton); return; }

      const heroButton = event.target.closest('.play-btn, .icon-btn');
      if (heroButton) { handleHeroAction(heroButton); return; }

      const ask = event.target.closest('.ask-btn');
      if (ask) {
        const contact = $('form') || $('[class*="contact"]');
        if (contact) contact.scrollIntoView({ behavior: 'smooth', block: 'center' });
        else notify('You can contact the StreamVibe team through the Support page.');
        return;
      }

      const review = event.target.closest('.btn-outline-light');
      if (review && /review/i.test(review.textContent)) {
        modal('Write a review', `<label class="sv-action-label">Your review</label><textarea class="sv-review-input" rows="4" maxlength="500" placeholder="Share your thoughts..."></textarea>`, '<button type="button" class="sv-action-primary" data-save-review>Save review</button><button type="button" class="sv-action-secondary" data-dismiss>Cancel</button>');
        return;
      }

      if (event.target.closest('[data-save-review]')) {
        const text = $('.sv-review-input')?.value.trim();
        if (!text) { notify('Write a review before saving.'); return; }
        const reviews = JSON.parse(localStorage.getItem('streamvibe_reviews') || '[]');
        reviews.push({ text, createdAt: new Date().toISOString() });
        localStorage.setItem('streamvibe_reviews', JSON.stringify(reviews));
        $('.sv-action-modal')?.remove(); notify('Review saved in this browser.');
      }
    });

    $$('a[href="#"]').forEach(link => link.addEventListener('click', e => {
      const label = link.textContent.trim() || link.getAttribute('aria-label') || 'Link';
      if (link.closest('.social')) { e.preventDefault(); notify(`${label} link is a design placeholder in this demo.`); }
      else if (link.closest('.footer-bottom')) { e.preventDefault(); modal(label, '<p>This information page has not been added to the project yet.</p>'); }
    }));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup);
  else setup();
})();
