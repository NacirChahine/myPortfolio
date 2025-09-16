(function(){
  'use strict';

  function escHtml(str){
    return String(str)
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }

  function liItem(item){
    const label = escHtml(item.label || '');
    if (item.html != null) {
      return `<li><strong>${label}</strong>: ${item.html}</li>`;
    }
    return `<li><strong>${label}</strong>: ${escHtml(item.value ?? '')}</li>`;
  }

  function renderProjectDetailsHTML(cfg){
    const breadcrumbTitle = escHtml(cfg.breadcrumbTitle || 'Project Details');
    const breadcrumbLabel = escHtml(cfg.breadcrumbLabel || 'Project');
    const images = Array.isArray(cfg.images) ? cfg.images : [];
    const infoItems = Array.isArray(cfg.infoItems) ? cfg.infoItems : [];
    const descriptionHtml = cfg.descriptionHtml || '';

    const slides = images.map(img => {
      if (typeof img === 'string') {
        return `\n      <div class="swiper-slide">\n        <img src="${escHtml(img)}" alt="">\n      </div>`;
      }
      if (img && img.html) {
        return `\n      <div class="swiper-slide">${img.html}</div>`;
      }
      const src = img && img.src ? escHtml(img.src) : '';
      const attrs = img && img.attrs ? ' ' + img.attrs : '';
      return `\n      <div class="swiper-slide">\n        <img src="${src}" alt=""${attrs}>\n      </div>`;
    }).join('\n');

    const info = infoItems.map(liItem).join('\n');

    return `
    <!-- ======= Breadcrumbs ======= -->
    <section id="breadcrumbs" class="breadcrumbs">
      <div class="container">
        <div class="d-flex justify-content-between align-items-center">
          <h2>${breadcrumbTitle}</h2>
          <ol>
            <li><a href="../index.html">Home</a></li>
            <li>${breadcrumbLabel}</li>
          </ol>
        </div>
      </div>
    </section><!-- End Breadcrumbs -->

    <!-- ======= Portfolio Details Section ======= -->
    <section id="portfolio-details" class="portfolio-details">
      <div class="container">
        <div class="row gy-4">
          <div class="col-lg-8">
            <div class="portfolio-details-slider swiper">
              <div class="swiper-wrapper align-items-center" style="cursor: grab;">
                ${slides}
              </div>
              <div class="swiper-pagination"></div>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="portfolio-info">
              <h3>Project information</h3>
              <ul>
                ${info}
              </ul>
            </div>
            <div class="portfolio-description">
              <h2>Description</h2>
              ${descriptionHtml}
            </div>
          </div>
        </div>
      </div>
    </section><!-- End Portfolio Details Section -->`;
  }

  function renderProjectDetailsPage(rootId, cfg){
    try {
      if (cfg && cfg.docTitle) document.title = cfg.docTitle;
      const root = document.getElementById(rootId);
      if (!root) return;
      root.innerHTML = renderProjectDetailsHTML(cfg || {});
    } catch(e){
      console.error('Failed to render project details page', e);
    }
  }

  // Expose globally
  window.renderProjectDetailsPage = renderProjectDetailsPage;
})();

