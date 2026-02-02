document.addEventListener('DOMContentLoaded', function (){
    let advantagesSlider = new Swiper(".top_advantage-slider", {
        pagination: {
            el: ".top_advantage-slider-pagination",
        },
    });
    let advantagesSliderMobile = new Swiper(".top_advantage-slider-mobile", {
        pagination: {
            el: ".top_advantage-slider-mobile-pagination",
        },
    });
    let otherVacanciesSliderMobile = new Swiper(".other-vacancies_slider", {
        slidesPerView: 3.2,
        spaceBetween: 30,
        navigation: {
            nextEl: ".other-vacancies_nav-btn.next",
            prevEl: ".other-vacancies_nav-btn.prev",
        },
        breakpoints: {
            0:{
                slidesPerView: 1
            },
            800:{
                slidesPerView: 2.2
            },
            1024:{
                slidesPerView: 3.2
            }
        }
    });
})