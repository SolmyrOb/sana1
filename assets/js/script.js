document.addEventListener("DOMContentLoaded", ready)
function ready(){
    let popup = document.querySelector('#popup')
    let popupContent
    if (popup) {
        popupContent = popup.querySelector('.popup_content')
    }
    let headerMenuBlock = document.querySelector('.navbar-nav')
    //let burgerMenu = document.querySelector('.navbar-collapse')
    //let burgerBtn = document.querySelector('.menu-opener')
    let burgerBtn = document.querySelector('.mobile-header_burger-btn')
    let burgerMenu = document.querySelector('.burger-menu')
    let header = document.querySelector('header')

    function initPhoneMask() {
        var $phone = $('input[name=phone]');
        if (!$phone.length) return;
    
        $phone.on('keydown', function (e) {
            var k = e.key;
            if (k !== '7' && k !== '8') return;
    
            var digits = this.value.replace(/\D/g, '');
            if (digits.length <= 1) {
                e.preventDefault();
                e.stopImmediatePropagation();
            }
        });
    
        $phone.on('focus click', function () {
            var el = this;
            setTimeout(function () {
                var v = el.value || '';
                var pos = v.indexOf('_');
                if (pos === -1) {
                    pos = v.length;
                }
                if (el.setSelectionRange) {
                    el.setSelectionRange(pos, pos);
                }
            }, 0);
        });
    
        $phone.on('paste', function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
    
            var clipboardData = e.originalEvent && e.originalEvent.clipboardData ? e.originalEvent.clipboardData : window.clipboardData;
            var s = clipboardData ? clipboardData.getData('text') : '';
            var digits = (s || '').replace(/\D/g, '');
            if (!digits) return;
    
            if (digits.length >= 11 && (digits.charAt(0) === '7' || digits.charAt(0) === '8')) {
                digits = digits.slice(1);
            }
            if (digits.length > 10) {
                digits = digits.slice(-10);
            }
    
            $(this).val(digits).trigger('input');
    
            var el = this;
            setTimeout(function () {
                var v = el.value || '';
                var pos = v.indexOf('_');
                if (pos === -1) {
                    pos = v.length;
                }
                if (el.setSelectionRange) {
                    el.setSelectionRange(pos, pos);
                }
            }, 0);
        });
    
        $phone.mask('+7 (999) 999-99-99');
    }
    
    initPhoneMask();


    var swiper3 = new Swiper(".heroes-slide", {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: false,
        speed: 1000,
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
    });

    let preparationStages = new Swiper(".body-slide .swiper", {
        spaceBetween: 10,
        loop: true,
        slidesPerView: 1,
        navigation: {
            nextEl: ".body-slide .owl-next",
            prevEl: ".body-slide .owl-prev",
        },
        breakpoints: {
            0: {
                items: 1,
            },
            600: {
                items: 1,
                margin: 0,
            },
            1000: {
                items: 1,
                margin: 0,
            }
        },
    })

    // mob slider award
    var $homeSlider = $(".award-block");

    $(window).resize(function () {
        showHomeSlider();
    });

    if (burgerBtn && burgerMenu){
        burgerBtn.addEventListener('click', function (){
            burgerMenu.style.setProperty('--height', (window.innerHeight - header.offsetHeight)+'px')
            if (burgerBtn.classList.contains('active')){
                burgerBtn.classList.remove('active')
                burgerMenu.classList.remove('active')
            } else {
                burgerBtn.classList.add('active')
                burgerMenu.classList.add('active')
            }
        })
    }

    function showHomeSlider() {
        if ($homeSlider.data("owlCarousel") !== "undefined") {
            if (window.matchMedia('(max-width: 600px)').matches) {
                initialHomeSlider();
            } else {
                destroyHomeSlider();
            }
        }
    }
    showHomeSlider();

    function initialHomeSlider() {
        if ($homeSlider && $homeSlider.owlCarousel) {
            $homeSlider.addClass("owl-carousel")
            $homeSlider.owlCarousel({
                items: 1,
                loop: false,
                nav: true,
                navText: ["<img src='images/owl-left-arrow.svg'>", "<img src='images/owl-right-arrow.svg'>"],
                autoplay: false,
                autoplayTimeout: 2000,
                smartSpeed: 1000
            });
        }
    }

    function destroyHomeSlider() {
        $homeSlider.trigger("destroy.owl.carousel").removeClass("owl-carousel");
    }

    document.addEventListener('submit', function(event){
        let form = event.target
        console.log(form.classList.contains('default-form'))

        if (form.classList.contains('default-form')){
            event.preventDefault()
            let successBlock = form.querySelector('.form-success')
            let contentBlock = form.querySelector('.form-content')
            let formData = new FormData(form)
            fetch('/assets/functions/sendMail.php', {
                method: 'POST',
                body: formData
            }).then(res=>{
                return res.text()
            }).then(data=>{
                if (data=='norm' ){
                    /*successBlock.classList.remove('none')
                    contentBlock.remove()*/
                    //закрытие попапа если форма в нем
                    let popupBlock = form.closest('.modal[id]')
                    if (popupBlock){
                        let popupId = popupBlock.getAttribute('id')
                        $(`#${popupId}`).modal('toggle');
                    }
                    //попап об успешной отправке
                    popupContent.innerHTML = ''
                    let popupTemplate = document.querySelector(`template#success`)
                    if (popupTemplate){
                        popupTemplate = popupTemplate.content.cloneNode(true);
                        popupContent.appendChild(popupTemplate)
                        popupContent.classList.add('success')
                        popup.classList.add('active')
                    }
                } else {
                    console.log(data)
                }
            })
        }
    })
    
    document.addEventListener('click', function(event){
        let elem = event.target
        let videoId = elem.getAttribute('data-video')
        let popupId = elem.getAttribute('data-popup')

        //открытие попапа
        if (popupId){
            popupContent.innerHTML = ''
            let popupTemplate = document.querySelector(`template#${popupId}`)
            if (popupTemplate){
                popupTemplate = popupTemplate.content.cloneNode(true);
                if (videoId){
                    popupTemplate.querySelector('iframe').setAttribute('src', 'https://www.youtube.com/embed/'+videoId)
                }
                popupContent.appendChild(popupTemplate)
                popupContent.classList.add(popupId)
                popup.classList.add('active')
            }
        }

        //закрытие попапа
        if (elem.getAttribute('id')=='popup'){
            elem.classList.remove('active')
            popupContent.classList = ['popup_content']
            popupContent.innerHTML = ''
        }

        if (elem.hasAttribute('data-close-changecity')){
            let changeCityBlock = elem.closest('[data-changecity]')
            if (changeCityBlock){
                changeCityBlock.removeAttribute('open')
            }
        }

        //бургер меню
        // if (elem.classList.contains('menu-opener')){
        //     burgerBtn.classList.toggle('active')
        //     burgerMenu.classList.toggle('active')
        //     /*if (header){
        //         burgerMenu.style.top = burgerMenu.setAttribute('style', `top: ${header.offsetHeight}px`)
        //     }*/
        // } else if (!elem.closest('.navbar-collapse')) {
        //     burgerBtn.classList.remove('active')
        //     burgerMenu.classList.remove('active')
        // }
    })

    document.addEventListener('input', function (event){
        let elem = event.target

        if (elem.hasAttribute('data-city-search')){
            let changeCityBlock = elem.closest('[data-changecity]')
            if (!changeCityBlock){
                return;
            }
            let value = elem.value
            if (value.length>0){
                for (let cityBlock of changeCityBlock.querySelectorAll('[data-city]')){
                    let cityName = cityBlock.textContent.toLowerCase()
                    if (cityName.includes(value)){
                        cityBlock.classList.remove('none')
                    } else {
                        cityBlock.classList.add('none')
                    }
                }
            } else {
                for (let cityBlock of changeCityBlock.querySelectorAll('[data-city]')){
                    cityBlock.classList.remove('none')
                }
            }
        }

        if(elem.closest('.default-form')){
            let name = elem.getAttribute('name')
            if (['name', 'sitizenship'].includes(name)){
                elem.value = elem.value.replace(/[^a-zA-Zа-яА-Я-\s]/g, '')
            }
        }
    })
}

