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

  function ensurePdStyles(){
    if (document.getElementById('pd-template-styles')) return;
    const css = `
#project-details-root .pd-breadcrumbs {
  position: sticky;
  top: 0;
  z-index: 1000;
  padding: 8px 0;
  background: linear-gradient(135deg, #0b1324 0%, #0f2240 55%, #149ddd 120%);
  color: #e9f6ff;
  overflow: visible;
  box-shadow: 0 2px 8px rgba(4,13,24,.15);
}
#project-details-root .pd-breadcrumbs .pd-breadcrumbs-bar { position: static; }
#project-details-root .pd-breadcrumbs h2 { color: #fff; font-weight: 600; font-size: 24px; margin: 6px 0; }
#project-details-root .pd-breadcrumbs ol { color: #d0e8f9; margin: 0; }
#project-details-root .pd-breadcrumbs ol a { color: #cfe9f9; }
#project-details-root .pd-breadcrumbs ol a:hover { color: #fff; text-decoration: underline; }

#project-details-root { min-height: 100vh; background: #f5f8fd; }
#project-details-root .pd-portfolio.section-bg { background: #f5f8fd; }
#project-details-root .pd-portfolio { padding: 20px 0; }

#project-details-root .portfolio-details .portfolio-details-slider {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(5,13,24,.08);
  padding: 10px;
}
#project-details-root .portfolio-details .portfolio-details-slider .swiper-wrapper { padding: 4px; }
#project-details-root .portfolio-details .portfolio-details-slider .swiper-slide { padding: 8px; box-sizing: border-box; }

#project-details-root .portfolio-details .portfolio-details-slider img,
#project-details-root .portfolio-details .portfolio-details-slider video {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: none;
}

#project-details-root .portfolio-details .portfolio-details-slider video {
  background: #000;
}

#project-details-root .portfolio-details .col-lg-4 > .portfolio-info,
#project-details-root .portfolio-details .col-lg-4 > .portfolio-description {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(5,13,24,.08);
  padding: 20px;
}
#project-details-root .portfolio-details .col-lg-4 > .portfolio-info { margin-bottom: 16px; }

#project-details-root .portfolio-details .col-lg-4 > .portfolio-info h3,
#project-details-root .portfolio-details .col-lg-4 > .portfolio-description h2 {
  font-size: 20px;
  color: #173b6c;
  margin: 0 0 12px;
  padding: 0 0 12px;
  border-bottom: 1px solid #eef2f7;
}

#project-details-root .portfolio-details .portfolio-info ul { margin: 0; padding-left: 0; list-style: none; }
#project-details-root .portfolio-details .portfolio-info ul li { margin: 0; }
#project-details-root .portfolio-details .portfolio-info ul li + li { margin-top: 8px; }

@media (max-width: 991.98px) {
  #project-details-root .pd-breadcrumbs h2 { font-size: 20px; }
  #project-details-root .pd-portfolio { padding: 16px 0; }
  #project-details-root .portfolio-details .portfolio-details-slider .swiper-slide { padding: 8px; }
}}`
    const style = document.createElement('style');
    style.id = 'pd-template-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function ensureAOS(callback){
    try {
      if (window.AOS) { callback && callback(); return; }
      const existing = Array.from(document.getElementsByTagName('script'))
        .some(s => (s.src||'').indexOf('/assets/vendor/aos/aos.js') !== -1);
      if (existing) {
        window.addEventListener('load', function(){
          if (window.AOS) { callback && callback(); }
        });
        return;
      }
      var base = '..';
      try { base = (window.location.pathname.indexOf('/project-details/') !== -1) ? '..' : '.'; } catch(_){ base = '..'; }
      var script = document.createElement('script');
      script.src = base + '/assets/vendor/aos/aos.js';
      script.async = false;
      script.defer = false;
      script.onload = function(){
        try {
          if (window.AOS && typeof window.AOS.init === 'function') {
            window.AOS.init({ duration: 1000, easing: 'ease-in-out', once: true, mirror: false });
          }
        } catch(_e) {}
        callback && callback();
      };
      document.head.appendChild(script);
    } catch(e){
      console.warn('ensureAOS failed', e);
      callback && callback();
    }
  }

  // Proactively ensure AOS is present before window load where main.js may init it
  ensureAOS();


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

    const slides = images.map(item => {
      if (typeof item === 'string') {
        const isVideo = item.match(/\.(mp4|webm|ogg)$/i);
        if (isVideo) {
          return `\n      <div class="swiper-slide">\n        <video controls>\n          <source src="${escHtml(item)}" type="video/${item.split('.').pop().toLowerCase()}">\n          Your browser does not support the video tag.\n        </video>\n      </div>`;
        }
        return `\n      <div class="swiper-slide">\n        <img src="${escHtml(item)}" alt="">\n      </div>`;
      }
      if (item && item.html) {
        return `\n      <div class="swiper-slide">${item.html}</div>`;
      }
      
      const src = item && item.src ? escHtml(item.src) : '';
      const attrs = item && item.attrs ? ' ' + item.attrs : '';
      const isVideo = item && item.type === 'video';
      
      if (isVideo) {
        const videoType = item.videoType || `video/${src.split('.').pop().toLowerCase()}`;
        return `\n      <div class="swiper-slide">\n        <video controls${attrs}>\n          <source src="${src}" type="${videoType}">\n          Your browser does not support the video tag.\n        </video>\n      </div>`;
      }
      
      return `\n      <div class="swiper-slide">\n        <img src="${src}" alt=""${attrs}>\n      </div>`;
    }).join('\n');

    const info = infoItems.map(liItem).join('\n');

    return `
    <!-- ======= Breadcrumbs (Sticky) ======= -->
    <section id="breadcrumbs" class="breadcrumbs pd-breadcrumbs">
      <div class="pd-breadcrumbs-bar">
        <div class="container">
          <div class="d-flex justify-content-between align-items-center">
            <h2>${breadcrumbTitle}</h2>
            <ol>
              <li><a href="../index.html">Home</a></li>
              <li>${breadcrumbLabel}</li>
            </ol>
          </div>
        </div>
      </div>
    </section><!-- End Breadcrumbs -->

    <!-- ======= Portfolio Details Section ======= -->
    <section id="portfolio-details" class="portfolio-details pd-portfolio section-bg">
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
      ensurePdStyles();
      const root = document.getElementById(rootId);
      if (!root) return;
      root.innerHTML = renderProjectDetailsHTML(cfg || {});
      // After dynamic render, (re)initialize or refresh AOS if available
      ensureAOS(function(){
        try {
          if (window.AOS && typeof window.AOS.refresh === 'function') {
            window.AOS.refresh();
          }
        } catch(_e) {}
      });
    } catch(e){
      console.error('Failed to render project details page', e);
    }
  }

  // Expose globally
  window.renderProjectDetailsPage = renderProjectDetailsPage;
})();

