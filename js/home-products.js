(function () {
  const root = document.querySelector('[data-home-featured]');
  if (!root || !window.PRODUCTS) return;

  const featured = window.PRODUCTS.filter(function (product) { return product.featured; }).slice(0, 8);

  root.innerHTML = '';
  featured.forEach(function (product) {
    const card = document.createElement('article');
    card.className = 'card reveal';
    const bestSellerBadge = product.bestSeller ? '<span class="best-seller-badge">Best Seller</span>' : '';
    card.innerHTML = [
      '<div class="card-media card-media-product">' + bestSellerBadge + '<img loading="lazy" src="' + product.image + '" alt="' + product.name + '"></div>',
      '<div class="card-body">',
      '<div class="card-tag">' + product.category + '</div>',
      '<h3>' + product.name + '</h3>',
      '<p>' + (product.purpose || product.shortDescription) + '</p>',
      '<div class="product-price">' + (product.priceDisplay || 'Price on request') + '</div>',
      '<a href="products.html" class="btn btn-outline">View Details</a>',
      '</div>'
    ].join('');
    root.appendChild(card);
  });

  document.querySelectorAll('.reveal').forEach(function (el) {
    el.classList.add('visible');
  });
})();
