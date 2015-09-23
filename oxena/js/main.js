(function($) { "use strict";

    //VARIABLES
    var swipers = [],winW, xsPoint = 767, smPoint = 991, mdPoint = 1199, sliderAnimateFinish = 0;
        winW = $(window).width();


    //Header animations
    $(window).on('scroll', function () {
        if ($(this).scrollTop() > 10) {
            $('.header-fixed').removeClass("header-mod");
        } else {
            $('.header-fixed').addClass("header-mod");
        }
    });

    //Swiper slider
    function initSwiper(){
         var initIterator = 0;
         $('.swiper-container').each(function(){
             var $t = $(this),
             index = 'unique-id-'+initIterator,
             loopVar = parseInt($t.attr('data-loop'),10),
             slidesPerViewVar = $t.attr('data-slides-per-view'),
             xsValue, smValue, mdValue, lgValue;
             $t.attr('data-init', index).addClass('initialized');
             $t.find('.pagination').addClass('pagination-'+index);

             if(slidesPerViewVar == 'responsive'){
                 slidesPerViewVar = 1;
                 xsValue = $t.attr('data-xs-slides');
                 smValue = $t.attr('data-sm-slides');
                 mdValue = $t.attr('data-md-slides');
                 lgValue = $t.attr('data-lg-slides');
             }

             swipers[index] = new Swiper(this,{
                 pagination: '.pagination-'+index,
                 loop: loopVar,
                 paginationClickable: true,
                 calculateHeight: true,
                 slidesPerView: slidesPerViewVar,
                 onInit: function(swiper){
                     if($t.attr('data-slides-per-view')=='responsive') updateSlidesPerView(xsValue, smValue, mdValue, lgValue, swiper);
                 },
                 onSlideChangeEnd: function (swiper) {
                     var activeIndex = (loopVar===true)?swiper.activeIndex:swiper.activeLoopIndex;
                     if($t.find('.slider-index').length) {
                         $t.find(".start_index").html(activeIndex+1);
                     }
                 }
             });

             swipers[index].reInit();
             initIterator++;
         });
    };

    //Swiper slider arrow
   $('.swiper-arrow-left').on('click', function(){
         swipers[$(this).parents('.swiper-container').attr('data-init')].swipePrev();
     });

     $('.swiper-arrow-right').on('click', function(){
         swipers[$(this).parents('.swiper-container').attr('data-init')].swipeNext();
     });

    $('.swiper-arrow-b-left').on('click', function(){
        swipers[$(this).prev().find('.swiper-container').attr('data-init')].swipePrev();
    });

    $('.swiper-arrow-b-right').on('click', function(){
        swipers[$(this).prev().prev().find('.swiper-container').attr('data-init')].swipeNext();
    });

    function updateSlidesPerView(xsValue, smValue, mdValue, lgValue, swiper){
         if(winW>mdPoint) swiper.params.slidesPerView = lgValue;
         else if(winW>smPoint) swiper.params.slidesPerView = mdValue;
         else if(winW>xsPoint) swiper.params.slidesPerView = smValue;
         else {swiper.params.slidesPerView = xsValue;}
    }

    initSwiper();


   //Loader
    $(window).load(function(){
         $('#loader-wrapper').fadeOut(500);
    });

    //Functions on page resize
    function resizeCall(){
         winW = $(window).width();
         $('.swiper-container[data-slides-per-view="responsive"]').each(function(){
             swipers[$(this).attr('data-init')].reInit();
         });
    }

    $(window).resize(function(){
         resizeCall();
    });

    window.addEventListener("orientationchange", function() {
         resizeCall();
    }, false);


    //Menu responsive click
    $('.menu-button').on('click', function () {
        var panel =  $('.nav-panel');
        $('.header').toggleClass('border');
        $('.header, .filter-panel, .container-title').removeClass('show-panel');
        $('.layer').toggleClass('layer-active');
        $('body').removeClass('body-layer');
        $('.col-sidebar').removeClass('col-sidebar-visible');
        panel.toggleClass('nav-panel-active').addClass('position');
        if(panel.hasClass('nav-panel-active') == false) {
            setTimeout(function(){
                panel.removeClass('position');
            },1000)
        }
        $(this).toggleClass('menu-button-active');
        $(window).resize(function(){
            var w = $(window).width();
            if(w > 320 && menu.is(':hidden')) {
                menu.removeAttr('style');
            }
        });
    });

    //Menu responsive
    $('.m_icon').on('click', function () {
        if(winW<=992){
            $(this).siblings('ul').slideToggle('slow');            
        }

    });

    //Layer for responsive menu
    $('.layer').on('click', function () {
        if(!$('.layer-panel').hasClass('layer-panel-active')){
            $(this).removeClass('layer-active');
            $('.menu-button').removeClass('menu-button-active');
            $('.nav-panel').removeClass('nav-panel-active');
        }else {
            $('.layer-panel').removeClass('layer-panel-active');
            $('.menu-button').css('display' , 'block');
            $('.main-product').removeClass('main-product-active');
        }
    });

    //Show basket info
    $('.basket-head').on('click', function () {
        $('.layer2').toggleClass('layer2-active');
        $('.main-product').toggleClass('main-product-active');
        $('.layer-panel').removeClass('layer-panel-active');
        $('.header, .filter-panel, .container-title').removeClass('show-panel');
        $('body').removeClass('body-layer');
        $('.col-sidebar').removeClass('col-sidebar-visible');
        if($('.nav-panel').hasClass('nav-panel-active')) {
            $('.layer-panel').addClass('layer-panel-active');
            $('.menu-button').css('display' , 'none');
            $('.layer2').removeClass('layer2-active');
        }
    });

    //Layer for basket
    $('.layer2').on('click', function () {
        $('.main-product').removeClass('main-product-active');
        $(this).removeClass('layer2-active');
    });

    //Show search block on category page
    $('#config').on('click', function () {
        $('body').toggleClass('body-layer');
        $('.header, .filter-panel, .container-title').toggleClass('show-panel');
    });

    //Show search block on item page
    $('#config-item').on('click', function () {
        $('body').toggleClass('body-layer');
        $('.header, .filter-panel, .content-title').toggleClass('show-panel');
        $('.col-sidebar').toggleClass('col-sidebar-visible');
    });

    //Background image
    function center_bg(){
         $('.center-image').each(function(){
             var bgSrc = $(this).attr('src');
             $(this).parent().css({'background-image':'url('+bgSrc+')'});
             $(this).remove();
         });
    }
    center_bg();

    //Filter slider
    $('.filter-item').on('click', function () {
        if($(this).hasClass('active') || sliderAnimateFinish) return false;
        sliderAnimateFinish = 1;
        var index = $(this).parent().find('.filter-item').index(this),
            $wrapper = $(this).closest('.slider-panel'),
            newSlider = $wrapper.find('.swiper-container').eq(index);
            $wrapper.find('.swiper-container:visible').animate({'opacity' : 0}, 500,
            function(){
                $(this).hide();
                newSlider.show();
                swipers[newSlider.attr('data-init')].reInit();
                newSlider.animate({'opacity' : 1}, 500, function(){sliderAnimateFinish = 0;});
            }
        );
        $(this).parent().find('.active').removeClass('active');
        $(this).addClass('active');
    });

    //Slide to
    $('#slideSubs, .btn-subscribe').on('click', function (e) {
        $('html,body').stop().animate({ scrollTop: $('.subscribe-block').offset().top }, 500);
        e.preventDefault();
    });

    $('#slideTo').on('click', function (e) {
        $('html,body').stop().animate({ scrollTop: $('.brand-block').offset().top }, 500);
        e.preventDefault();
    });

    //Cat menu responsive
    $('.cat-menu-title').on('click', function () {
        $(this).next('.row').slideToggle(500);
    });

    //Clear input
    $('.clear').on('click', function () {
        $(this).prev('.cart-input').val(' ');
    });

    //Close item block
    $('.close-item').on('click', function () {
        $(this).parents('.items-card').fadeOut(300);
        $(this).fadeOut(300);
    });

    //Active color product
    $('.color').on('click', function () {
        $(this).parent().find('.color').removeClass('color-active');
        $(this).addClass('color-active');
    });

    //Custom line
    $('.line').each(function(){
        $(this).css({'left':$(this).prev().width()+5, 'right':$(this).next().width()+5});
    });

    //Imitation AJAX
    $('.cart-content .load-more').on('click', function () {
        var itemBox =  $('.item-box').slice(0,3),
            cloneHtml = itemBox.clone();
        $('.cart-container').append(cloneHtml);
    });

    //Imitation AJAX
    $('.blog-container .load-more').on('click', function () {
        var itemBlog =  $('.items-blog').slice(0,3),
            cloneHtml = itemBlog.clone();
        $('.blog-container .blog-grid').append(cloneHtml);
    });

    //Imitation AJAX
    $('.gallery-container .load-more').on('click', function () {
        var itemBlog =  $('.items-gal').slice(0,4),
            cloneHtml = itemBlog.clone();
        $('.gallery-container .gallery-grid').append(cloneHtml);
    });          

    //Bootstrap tab init
    $('#myTab a').on('click', function (e) {
        e.preventDefault();
        $(this).tab('show')
    });

    //Custom scroll init
    if($('.boxscroll').length){
        $(".boxscroll").niceScroll({
            cursorborder:"",
            cursorcolor:"#007eb9",
            boxzoom:true,
            cursoropacitymin: 1,
            cursorminheight: 90,
            cursorwidth: 4,
            cursoropacitymax: 1
        });
    }

    /*=====================*/
    /* light-box */
    /*=====================*/
    
    /*activity indicator functions*/
    var activityIndicatorOn = function(){
        $( '<div id="imagelightbox-loading"><div></div></div>' ).appendTo( 'body' );
    }
    var activityIndicatorOff = function(){
        $( '#imagelightbox-loading' ).remove();
    }
    
    /*close button functions*/
    var closeButtonOn = function(instance){
        $( '<button type="button" id="imagelightbox-close" title="Close"></button>' ).appendTo( 'body' ).on( 'click touchend', function(){ $( this ).remove(); instance.quitImageLightbox(); return false; });
    }
    var closeButtonOff = function(){
        $( '#imagelightbox-close' ).remove();
    }
    
    /*overlay*/
    var overlayOn = function(){$( '<div id="imagelightbox-overlay"></div>' ).appendTo( 'body' );}
    var overlayOff = function(){$( '#imagelightbox-overlay' ).remove();}    
    
    /*caption*/
    var captionOff = function(){$( '#imagelightbox-caption' ).remove();}
    var captionOn = function(){
        var description = $( 'a[href="' + $( '#imagelightbox' ).attr( 'src' ) + '"] img' ).attr( 'alt' );
        var author = $( 'a[href="' + $( '#imagelightbox' ).attr( 'src' ) + '"] img' ).attr( 'data-author' );
        if( description.length > 0 && author.length > 0)
            $( '<div id="imagelightbox-caption">' + description + '<span>/</span>' + author +'</div>' ).appendTo( 'body' );
    }

    /*arrows*/
    var arrowsOn = function( instance, selector ){
        var $arrows = $( '<button type="button" class="imagelightbox-arrow imagelightbox-arrow-left"><i class="fa fa-chevron-left"></i></button><button type="button" class="imagelightbox-arrow imagelightbox-arrow-right"><i class="fa fa-chevron-right"></i></button>' );
        $arrows.appendTo( 'body' );
        $arrows.on( 'click touchend', function( e )
        {
            e.preventDefault();
            var $this   = $( this ),
                $target = $( selector + '[href="' + $( '#imagelightbox' ).attr( 'src' ) + '"]' ),
                index   = $target.index( selector );
            if( $this.hasClass( 'imagelightbox-arrow-left' ) )
            {
                index = index - 1;
                if( !$( selector ).eq( index ).length )
                    index = $( selector ).length;
            }
            else
            {
                index = index + 1;
                if( !$( selector ).eq( index ).length )
                    index = 0;
            }
            instance.switchImageLightbox( index );
            return false;
        });
    }
    var arrowsOff = function(){$( '.imagelightbox-arrow' ).remove();};  
            
    var selectorG = '.lightbox';        
    var instanceG =$(selectorG).imageLightbox({
        quitOnDocClick: false,
        onStart:        function() {arrowsOn( instanceG, selectorG );overlayOn(); closeButtonOn(instanceG); },
        onEnd:          function() {arrowsOff();captionOff(); overlayOff(); closeButtonOff(); activityIndicatorOff(); },
        onLoadStart:    function() {captionOff(); activityIndicatorOn(); },
        onLoadEnd:      function() {$( '.imagelightbox-arrow' ).css( 'display', 'block' );captionOn(); activityIndicatorOff(); }
    });     

})(jQuery);