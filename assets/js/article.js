document.addEventListener("DOMContentLoaded", ready)

function ready(){
    let shareBtn = document.querySelector('.share-btn')
    if (shareBtn){
        shareBtn.addEventListener('click', function (event){
            let elem = event.target
            if (!elem.closest('.share-list')) {
                shareBtn.classList.toggle('active')
            }
            if (elem.classList.contains('share-list_close')){
                shareBtn.classList.remove('active')
            } else if (elem.classList.contains('copy-link')){
                navigator.clipboard.writeText(window.location.href).then(() => {
                    // Получилось!
                })
                .catch(err => {
                    console.log('не удалось скопировать текст', err);
                });
            }
        })
    }

    let otherArticlesSlider = new Swiper(".other-articles_slider", {
        slidesPerView: 3,
        spaceBetween: 30,
        navigation: {
            nextEl: ".other-articles_slider-nav-btn.next",
            prevEl: ".other-articles_slider-nav-btn.prev",
        },
        breakpoints: {
            300:{
                slidesPerView: 1,
            },
            800:{
                slidesPerView: 2,
            },
            1024:{
                slidesPerView: 3,
            }
        }
    });
}
(function(){
  function buildTOC(){
    var tocRoot = document.querySelector('.top_heading-list');
    var content = document.querySelector('.content'); // .txt-block.content тоже матчится
    if (!tocRoot || !content) return;

    // Собираем H2. Если есть data-heading-tag="H2" — берём его; иначе берём все H2.
    var nodeList = content.getElementsByTagName('h2');
    var headings = [];
    for (var i=0; i<nodeList.length; i++){
      var h = nodeList[i];
      var attr = h.getAttribute('data-heading-tag');
      if (!attr || attr.toUpperCase() === 'H2') headings.push(h);
    }
    if (!headings.length) return;

    var ol = document.createElement('ol');
    ol.className = 'toc-list';

    for (var j=0; j<headings.length; j++){
      var hh = headings[j];
      if (!hh.id) hh.id = 'sec-' + (j+1);

      var li = document.createElement('li');
      var a = document.createElement('a');
      a.setAttribute('href', '#' + hh.id);
      a.appendChild(document.createTextNode((hh.textContent || hh.innerText || '').replace(/\s+/g,' ').trim()));

      a.addEventListener('click', function(e){
        e.preventDefault();
        var id = this.getAttribute('href').slice(1);
        var t = document.getElementById(id);
        if (!t) return;

        // смещение под фикс-хедер (если нет — 80)
        var offset = 80;
        // пробуем прочитать custom CSS var, если есть
        try{
          var v = window.getComputedStyle(document.documentElement).getPropertyValue('--header-height');
          if (v){ var p = parseInt(v,10); if (!isNaN(p)) offset = p; }
        }catch(_){}

        var y = t.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop || 0) - offset;

        // плавный скролл, если доступен
        if ('scrollBehavior' in document.documentElement.style){
          window.scrollTo({top:y, left:0, behavior:'smooth'});
        }else{
          window.scrollTo(0, y);
        }
      });

      li.appendChild(a);
      ol.appendChild(li);
    }

    // Рендер
    while (tocRoot.firstChild) tocRoot.removeChild(tocRoot.firstChild);
    tocRoot.appendChild(ol);
  }

  // запуск: DOM готов, полный load, и бэкап через таймер
  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', buildTOC);
  } else {
    buildTOC();
  }
  window.addEventListener('load', buildTOC);

  // на случай, если контент догружается шаблоном/скриптом
  setTimeout(buildTOC, 400);
})();

document.addEventListener('DOMContentLoaded', function () {
  var root = document.getElementById('shareCopy') || document.querySelector('.share-list');
  if (!root) return;

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.top = '-1000px';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
    return Promise.resolve();
  }

  root.querySelectorAll('.share-item').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var text = btn.getAttribute('data-copy') || root.getAttribute('data-copy-text') || location.href;
      copyText(text).then(function () {
        btn.classList.add('copied');
        setTimeout(function () { btn.classList.remove('copied'); }, 1200);
      });
    });
  });
});
document.addEventListener('DOMContentLoaded',function(){
  var float = document.getElementById('float-whatsapp');
  var cta   = document.querySelector('.corner-btn.top-cta_btn');
  if(!float || !cta) return;

  var GAP = 50;        // отступ СПРАВА от CTA
  var DEF_RIGHT = 90;  // базовая фикс-позиция
  var DEF_BOTTOM = 20;

  function vw(){ return Math.max(document.documentElement.clientWidth, window.innerWidth||0); }
  function vh(){ return Math.max(document.documentElement.clientHeight, window.innerHeight||0); }
  function isVisible(el){ var r=el.getBoundingClientRect(); return r.bottom>0 && r.top<vh(); }

  function setDefaultPos(){
    var fw=float.offsetWidth, fh=float.offsetHeight;
    float.style.left = (vw()-DEF_RIGHT-fw)+'px';
    float.style.top  = (vh()-DEF_BOTTOM-fh)+'px';
  }

  function update(){
    var fw=float.offsetWidth, fh=float.offsetHeight;

    if(isVisible(cta)){
      var r = cta.getBoundingClientRect();
      // СПРАВА от CTA + GAP, по вертикали по центру CTA
      var targetLeft = Math.min(vw() - fw - 8, r.right + GAP);
      var targetTop  = Math.min(vh() - fh - 8, Math.max(8, r.top + r.height/2 - fh/2));
      float.style.left = targetLeft + 'px';
      float.style.top  = targetTop  + 'px';
    }else{
      setDefaultPos();
    }
  }

  var ticking=false;
  function onScrollResize(){ if(ticking) return; ticking=true; requestAnimationFrame(function(){ ticking=false; update(); }); }

  // плавность
  float.style.transition = 'left .25s ease, top .25s ease';

  setDefaultPos(); update();
  window.addEventListener('scroll', onScrollResize, {passive:true});
  window.addEventListener('resize', function(){ setDefaultPos(); update(); }, {passive:true});
  window.addEventListener('load', function(){ setDefaultPos(); update(); });
});
