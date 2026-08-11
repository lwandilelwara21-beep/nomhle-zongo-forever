(function () {
  const catalogueRoot = document.querySelector('[data-catalogue]');
  const filterRoot = document.querySelector('[data-filters]');
  const searchInput = document.querySelector('[data-search]');
  const modal = document.querySelector('[data-product-modal]');
  const modalBody = document.querySelector('[data-modal-body]');
  const closeModal = document.querySelector('[data-modal-close]');

  if (!catalogueRoot || !window.PRODUCTS || !window.PRODUCT_FILTERS) return;

  let activeFilter = 'All';
  let query = '';

  function priceText(product) {
    if (product.priceDisplay) return product.priceDisplay;
    if (typeof product.price === 'number') return 'R' + product.price.toFixed(2);
    return 'Price on request';
  }

  function productWhatsappMessage(product) {
    return "Hi Nomhle, I came across your website and I'm interested in " + product.name + " (" + priceText(product) + "). Please can you assist me with ordering?";
  }

  function createCard(product) {
    const card = document.createElement('article');
    card.className = 'product-card reveal';
    card.innerHTML = [
      '<div class="card-media"><img loading="lazy" src="' + product.image + '" alt="' + product.name + ' product image"></div>',
      '<div class="meta">',
      '<div class="card-tag">' + product.category + '</div>',
      '<h3>' + product.name + '</h3>',
      '<p>' + (product.purpose || product.shortDescription) + '</p>',
      '<div class="product-price">' + priceText(product) + '</div>',
      '<div class="product-actions">',
      '<button type="button" class="btn btn-outline" data-view-id="' + product.id + '">View Details</button>',
      '<a class="btn btn-soft" href="' + window.getWhatsAppLink(productWhatsappMessage(product)) + '">Order With Nomhle</a>',
      '</div>',
      '</div>'
    ].join('');
    return card;
  }

  function filteredProducts() {
    return window.PRODUCTS.filter(function (product) {
      const matchCategory = activeFilter === 'All' || product.category === activeFilter;
      const hay = [product.name, product.category, product.shortDescription].join(' ').toLowerCase();
      const matchSearch = hay.indexOf(query.toLowerCase()) !== -1;
      return matchCategory && matchSearch;
    });
  }

  function renderProducts() {
    const items = filteredProducts();
    catalogueRoot.innerHTML = '';

    if (!items.length) {
      catalogueRoot.innerHTML = '<div class="placeholder-box"><strong>No products found.</strong><p>Try another search or category.</p></div>';
      return;
    }

    items.forEach(function (product) {
      catalogueRoot.appendChild(createCard(product));
    });

    document.querySelectorAll('[data-view-id]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const product = window.PRODUCTS.find(function (p) { return p.id === btn.getAttribute('data-view-id'); });
        if (!product) return;
        openModal(product);
      });
    });

    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('visible');
    });
  }

  function renderFilters() {
    filterRoot.innerHTML = '';
    window.PRODUCT_FILTERS.forEach(function (name) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pill' + (name === activeFilter ? ' active' : '');
      btn.textContent = name;
      btn.addEventListener('click', function () {
        activeFilter = name;
        renderFilters();
        renderProducts();
      });
      filterRoot.appendChild(btn);
    });
  }

  function openModal(product) {
    if (!modal || !modalBody) return;
    modalBody.innerHTML = [
      '<div class="modal-grid">',
      '<div class="card-media"><img src="' + product.image + '" alt="' + product.name + ' large product image"></div>',
      '<div>',
      '<div class="card-tag">' + product.category + '</div>',
      '<h2>' + product.name + '</h2>',
      '<p class="product-price" style="margin-top:0.4rem;">' + priceText(product) + '</p>',
      '<h3 style="margin-top:1rem;">Purpose</h3>',
      '<p>' + (product.purpose || product.shortDescription) + '</p>',
      '<p style="margin-top:0.8rem;">' + product.overview + '</p>',
      '<h3 style="margin-top:1rem;">Key Product Characteristics</h3>',
      '<ul>',
      (product.keyFeatures || []).map(function (item) { return '<li>' + item + '</li>'; }).join(''),
      '</ul>',
      '<h3 style="margin-top:1rem;">How to Use</h3>',
      '<p>' + (product.usage || 'Refer to product label instructions.') + '</p>',
      '<p style="margin-top:0.6rem;"><strong>Pack Size:</strong> ' + (product.packSize || 'Available on request') + '</p>',
      '<div class="product-actions" style="margin-top:0.9rem;">',
      '<a class="btn btn-primary" href="' + window.getWhatsAppLink(productWhatsappMessage(product)) + '">Order With Nomhle</a>',
      '<a class="btn btn-outline" data-store-link href="#">Shop Through Nomhle</a>',
      '</div>',
      '<p class="notice" style="margin-top:0.8rem;">Product information is provided for general information and should not be considered medical advice.</p>',
      '</div>',
      '</div>'
    ].join('');

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');

    const inlineStore = modalBody.querySelector('[data-store-link]');
    if (inlineStore) {
      if (window.SITE_CONFIG.foreverStoreUrl) {
        inlineStore.href = window.SITE_CONFIG.foreverStoreUrl;
        inlineStore.target = '_blank';
        inlineStore.rel = 'noopener noreferrer';
        inlineStore.textContent = 'Shop Through Nomhle';
      } else {
        inlineStore.href = window.getWhatsAppLink(productWhatsappMessage(product));
        inlineStore.textContent = 'Order With Nomhle';
      }
    }
  }

  function closeProductModal() {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      query = searchInput.value.trim();
      renderProducts();
    });
  }

  if (closeModal) {
    closeModal.addEventListener('click', closeProductModal);
  }

  if (modal) {
    modal.addEventListener('click', function (event) {
      if (event.target === modal) closeProductModal();
    });
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeProductModal();
  });

  renderFilters();
  renderProducts();
})();
