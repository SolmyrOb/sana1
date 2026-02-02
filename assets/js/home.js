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
    for(let prepareGalleryWrapper of document.querySelectorAll('.prepare-step-gallery-wrapper')){
        let sliderBlock = prepareGalleryWrapper.querySelector('.prepare-step-gallery')
        let prevNavBtn = prepareGalleryWrapper.querySelector('.prepare-step-gallery_nav-btn.prev')
        let nextNavBtn = prepareGalleryWrapper.querySelector('.prepare-step-gallery_nav-btn.next')
        new Swiper(sliderBlock, {
            navigation: {
                nextEl: nextNavBtn,
                prevEl: prevNavBtn,
            },
        })
    }
})