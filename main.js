document.addEventListener('DOMContentLoaded', function() {
  const nav = document.getElementById('nav');
  const expandCollapseNavButton = document.getElementById('toggleNav');
  const printPostcard = document.getElementById('printPostcard');
  const accordion = document.getElementById('accordion');
  const gridContainer = document.getElementById('gridContainer');
  const body = document.body;

  // Helper: Debounce function.
  function debounce(func, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  // Always use the closed nav header height for grid height.
  function setGridHeight() {
    // Use the closed nav header height (even if nav is expanded)
    const closedNavHeight = parseFloat(getComputedStyle(nav.querySelector('.nav__header')).height);
    const gridHeight = window.innerHeight - closedNavHeight;
    gridContainer.style.height = gridHeight + "px";
    console.log("Grid height set to:", gridHeight);
  }
  setGridHeight();
  window.addEventListener('resize', debounce(setGridHeight, 300));

  // GLOBAL LOADER OVERLAY
  let globalLoader = document.getElementById('global-loader');
  if (!globalLoader) {
    globalLoader = document.createElement('div');
    globalLoader.id = 'global-loader';
    globalLoader.innerHTML = `<div class="global-loader-spinner"></div>`;
    document.body.appendChild(globalLoader);
  }
  
  function showGlobalLoader() {
    // Ensure the overlay leaves the nav visible by setting top padding to nav's height
    const navHeight = nav.offsetHeight;
    globalLoader.style.paddingTop = navHeight + "px";
    // Set display to flex then add the "visible" class to trigger opacity transition.
    globalLoader.style.display = 'flex';
    // Use a slight delay to allow display change (optional)
    requestAnimationFrame(() => {
      globalLoader.classList.add('visible');
    });
  }
  
  function hideGlobalLoader() {
    globalLoader.classList.remove('visible');
    // After the transition, hide the element completely.
    setTimeout(() => {
      if (!globalLoader.classList.contains('visible')) {
        globalLoader.style.display = 'none';
      }
    }, 500);
  }
  
  // Show global loader on each resize event.
  window.addEventListener('resize', function() {
    showGlobalLoader();
  });
  
  // Hide global loader after resizing stops (debounced).
  window.addEventListener('resize', debounce(function() {
    hideGlobalLoader();
  }, 500));

  // Define icon constants with alt text.
  const expandIconHTML = `<img src="assets/icon-collapsed.svg" alt="Expand" />`;
  const collapseIconHTML = `<img src="assets/icon-expanded.svg" alt="Collapse" />`;

  // Array of 12 Street View iframe embed strings with disableDefaultUI parameter added.
  const iframeEmbeds = [
    `<iframe src="https://www.google.com/maps/embed?pb=!4v1741613229649!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJQ2ttSzdJTUE.!2m2!1d41.17775018253266!2d48.12835697231439!3f328.68334749947!4f2.46564093038063!5f0.7820865974627469&disableDefaultUI=true" allowfullscreen referrerpolicy="no-referrer-when-downgrade"></iframe>`,
    `<iframe src="https://www.google.com/maps/embed?pb=!4v1741613535856!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJQ3g1SnJvWWc.!2m2!1d41.18187259482944!2d48.133061975754536!3f1.9193252467856894!4f6.948798834565494!5f0.4000000000000002&disableDefaultUI=true" allowfullscreen referrerpolicy="no-referrer-when-downgrade"></iframe>`,
    `<iframe src="https://www.google.com/maps/embed?pb=!4v1741613568887!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJQzZxdjJsTUE.!2m2!1d41.18142871737108!2d48.12862196688824!3f286.58686253356956!4f6.922352980481705!5f0.7820865974627469&disableDefaultUI=true" allowfullscreen referrerpolicy="no-referrer-when-downgrade"></iframe>`,
    `<iframe src="https://www.google.com/maps/embed?pb=!4v1741613614967!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJQzRsN1hteUFF.!2m2!1d41.17982046671535!2d48.12898178758145!3f316.6319838443092!4f-1.214353752507776!5f0.7820865974627469&disableDefaultUI=true" allowfullscreen referrerpolicy="no-referrer-when-downgrade"></iframe>`,
    `<iframe src="https://www.google.com/maps/embed?pb=!4v1741613642830!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJQ0VwcFRJdXdF.!2m2!1d41.17822652001509!2d48.12843319846598!3f116.08329054491179!4f2.4636382827254124!5f0.7820865974627469&disableDefaultUI=true" allowfullscreen referrerpolicy="no-referrer-when-downgrade"></iframe>`,
    `<iframe src="https://www.google.com/maps/embed?pb=!4v1741613669292!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJQ2ttSzdGeXdF.!2m2!1d41.178055009247!2d48.12833325069956!3f320.295625359141!4f-0.12100960255688165!5f0.7820865974627469&disableDefaultUI=true" allowfullscreen referrerpolicy="no-referrer-when-downgrade"></iframe>`,
    `<iframe src="https://www.google.com/maps/embed?pb=!4v1741613698220!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJRHF6WS1lNUFF.!2m2!1d41.17746901734427!2d48.12827241819006!3f254.83201520612147!4f-14.596622414825177!5f0.7820865974627469&disableDefaultUI=true" allowfullscreen referrerpolicy="no-referrer-when-downgrade"></iframe>`,
    `<iframe src="https://www.google.com/maps/embed?pb=!4v1741613743400!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJRHFoZXJaRGc.!2m2!1d41.17921828813375!2d48.12802885140682!3f89.69076706293845!4f-14.634908569061935!5f0.7820865974627469&disableDefaultUI=true" allowfullscreen referrerpolicy="no-referrer-when-downgrade"></iframe>`,
    `<iframe src="https://www.google.com/maps/embed?pb=!4v1741613764730!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJQzRnNExoR3c.!2m2!1d41.18068818845204!2d48.12490761022436!3f97.1404743192802!4f-5.193103123742915!5f0.7820865974627469&disableDefaultUI=true" allowfullscreen referrerpolicy="no-referrer-when-downgrade"></iframe>`,
    `<iframe src="https://www.google.com/maps/embed?pb=!4v1741613791086!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJQzZtdS1XMXdF.!2m2!1d41.17893507656516!2d48.12667693135963!3f142.25006090649586!4f-11.1671154898834!5f0.7820865974627469&disableDefaultUI=true" allowfullscreen referrerpolicy="no-referrer-when-downgrade"></iframe>`,
    `<iframe src="https://www.google.com/maps/embed?pb=!4v1741613813151!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJQzYydm5IQVE.!2m2!1d41.18001128216869!2d48.12846808936467!3f142.1436543483972!4f-5f468777861393363!5f0.7820865974627469&disableDefaultUI=true" allowfullscreen referrerpolicy="no-referrer-when-downgrade"></iframe>`,
    `<iframe src="https://www.google.com/maps/embed?pb=!4v1741613831038!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJRGE4ZHlTZHc.!2m2!1d41.17723119618087!2d48.12283063892755!3f165.06246501641576!4f-4.016377242956949!5f0.7820865974627469&disableDefaultUI=true" allowfullscreen referrerpolicy="no-referrer-when-downgrade"></iframe>`
  ];

  // Optional: Shuffle the array.
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  shuffleArray(iframeEmbeds);

  // Populate grid items with each iframe and a persistent icon.
  const gridItems = Array.from(gridContainer.children);
  console.log("Found grid items:", gridItems.length);
  gridItems.forEach((item, index) => {
    item.innerHTML = iframeEmbeds[index] + '<div class="container__item-icon">' + expandIconHTML + '</div>';
  });

  // Track the currently expanded item.
  let currentlyExpanded = null;

  // Event delegation for expand/collapse.
  gridContainer.addEventListener('click', function(e) {
    const icon = e.target.closest('.container__item-icon');
    if (!icon) return;
    const item = icon.parentElement;
    // On mobile, do nothing if width <=768px.
    if (window.innerWidth <= 768) return;
    if (currentlyExpanded && currentlyExpanded !== item) {
      collapseItem(currentlyExpanded).then(() => {
        currentlyExpanded = null;
        expandItem(item);
        currentlyExpanded = item;
      });
    } else if (item.classList.contains('expanded')) {
      collapseItem(item).then(() => {
        currentlyExpanded = null;
      });
    } else {
      expandItem(item);
      currentlyExpanded = item;
    }
  });

  function expandItem(item) {
    showLoader(item);
    const itemRect = item.getBoundingClientRect();
    // Save original dimensions.
    item.dataset.originalRect = JSON.stringify({
      top: itemRect.top,
      left: itemRect.left,
      width: itemRect.width,
      height: itemRect.height
    });
    item.style.position = "fixed";
    item.style.top = itemRect.top + "px";
    item.style.left = itemRect.left + "px";
    item.style.width = itemRect.width + "px";
    item.style.height = itemRect.height + "px";
    requestAnimationFrame(() => {
      item.style.transition = "top 0.6s cubic-bezier(0.4,0,0.2,1), left 0.6s cubic-bezier(0.4,0,0.2,1), width 0.6s cubic-bezier(0.4,0,0.2,1), height 0.6s cubic-bezier(0.4,0,0.2,1), opacity 0.6s ease";
      const closedNavHeight = parseFloat(getComputedStyle(nav.querySelector('.nav__header')).height);
      item.style.top = closedNavHeight + "px";
      item.style.left = "0px";
      item.style.width = window.innerWidth + "px";
      item.style.height = (window.innerHeight - closedNavHeight) + "px";
      item.style.opacity = "1";
    });
    item.classList.add("expanded");
    item.style.zIndex = "500";
    // Update icon to indicate collapse.
    const innerIcon = item.querySelector('.container__item-icon');
    if (innerIcon) innerIcon.innerHTML = collapseIconHTML;
    item.addEventListener('transitionend', function handler() {
      hideLoader(item);
      item.removeEventListener('transitionend', handler);
    });
  }

  function collapseItem(item) {
    return new Promise(resolve => {
      showLoader(item);
      const orig = JSON.parse(item.dataset.originalRect);
      item.style.transition = "top 0.6s cubic-bezier(0.4,0,0.2,1), left 0.6s cubic-bezier(0,0,0.2,1), width 0.6s cubic-bezier(0.4,0,0.2,1), height 0.6s cubic-bezier(0.4,0,0.2,1), opacity 0.6s ease";
      item.style.top = orig.top + "px";
      item.style.left = orig.left + "px";
      item.style.width = orig.width + "px";
      item.style.height = orig.height + "px";
      item.style.opacity = "1";
      item.addEventListener('transitionend', function handler() {
        item.style.transition = "";
        item.classList.remove('expanded');
        item.style.position = "";
        item.style.top = "";
        item.style.left = "";
        item.style.width = "";
        item.style.height = "";
        item.style.zIndex = "";
        item.style.opacity = "";
        // Reset icon to indicate expansion.
        const innerIcon = item.querySelector('.container__item-icon');
        if (innerIcon) innerIcon.innerHTML = expandIconHTML;
        hideLoader(item);
        item.removeEventListener('transitionend', handler);
        resolve();
      });
    });
  }

  // Helper: Show loader overlay on a grid item.
  function showLoader(item) {
    let loader = document.createElement('div');
    loader.className = 'loader-overlay';
    loader.innerHTML = `<div class="loader-spinner"></div>`;
    if (!item.querySelector('.loader-overlay')) {
      item.appendChild(loader);
    }
  }

  // Helper: Hide loader overlay.
  function hideLoader(item) {
    const loader = item.querySelector('.loader-overlay');
    if (loader) {
      loader.classList.add('hide');
      loader.addEventListener('transitionend', () => {
        if (loader.parentNode === item) {
          loader.remove();
        }
      });
    }
  }

  // Expand/Collapse nav.
  expandCollapseNavButton.addEventListener('click', function() {
    // On mobile, do nothing (nav is always fully expanded).
    if (window.innerWidth <= 768) return;
    if (nav.classList.contains('expanded')) {
      accordion.style.display = "none";
      nav.style.height = "";
      nav.classList.remove("expanded");
      body.classList.remove("body--expanded");
    } else {
      nav.classList.add("expanded");
      accordion.style.display = "block";
      body.classList.add("body--expanded");
    }
  });

  // Simplified Print Handler: mimic Ctrl+P.
  printPostcard.addEventListener('click', function() {
    console.log("Print button pressed");
    // Delay 1 second before printing to let iframes load.
    setTimeout(() => {
      window.print();
    }, 1000);
  });

  // Freeze grid container layout before printing.
  window.onbeforeprint = function() {
    gridContainer.dataset.prePrintStyle = gridContainer.getAttribute('style') || "";
    const rect = gridContainer.getBoundingClientRect();
    gridContainer.style.width = rect.width + "px";
    gridContainer.style.height = rect.height + "px";
    gridContainer.style.gridTemplateRows = "30% 50% 20%";
    console.log("Before print: grid frozen.");
  };

  // Restore grid container layout after printing.
  window.onafterprint = function() {
    gridContainer.removeAttribute('style');
    setGridHeight();
    console.log("After print: grid restored.");
  };
});
