var hideDataFrontEndHelper = function(){
    $('html *').removeAttr("data-frontend-helper");
    $('body').click(function() {
        $('.rsfh-lightbox-close').text("Fermer");
        $('.rsfh-lightbox-cancel').text("Annuler");
    });
};

var initHomeScroll = function() {
    if ($('body').hasClass('home')) {
        $('.page-header .main-navigation .level_1 > li.home > .home').off('click').on('click', function(e) {
            e.preventDefault();
            $('html, body').stop().animate({ scrollTop: 0 }, 1000, 'swing');
        });
    }
};

var scrollClass = function(){
    var y = $(window).scrollTop(); 
    if (y > 200) {
        $("body").addClass("scroll");
    } else {
        $("body").removeClass("scroll");
    }
};

// On sort la fonction de gestion du wheel pour pouvoir la supprimer proprement
var handleSnapWheel;

var initSnapScroll = function() {
    var $sections = $('.snap-section');
    var $window = $(window);
    
    // Suppression de l'ancien écouteur s'il existe (pour le resize)
    if (handleSnapWheel) {
        window.removeEventListener('wheel', handleSnapWheel);
    }

    // CONDITIONS DE SÉCURITÉ :
    // 1. Assez de sections
    // 2. Largeur >= 700px
    // 3. Hauteur >= 800px
    if ($sections.length <= 1 || $window.width() < 700 || $window.height() < 700) {
        return;
    }

    var speed = 1500;
    var tolerance = 50;
    var isScrolling = false;

    handleSnapWheel = function(e) {
        // Vérification dynamique (au cas où le snap-scroll est retiré du body)
        if (!$('body').hasClass('snap-scroll') || $window.width() < 700 || $window.height() < 800) return;
        
        var delta = e.deltaY;
        var direction = delta > 0 ? 1 : -1;
        var scrollTop = Math.round($window.scrollTop());
        var lastSectionTop = Math.round($sections.last().offset().top);

        if (direction === 1 && scrollTop >= lastSectionTop - tolerance) return;

        e.preventDefault();
        if (isScrolling) return;

        var targetScroll = -1;

        if (direction === 1) {
            if (scrollTop <= tolerance) {
                targetScroll = Math.round($sections.eq(1).offset().top);
            } else {
                $sections.each(function() {
                    var sectionTop = Math.round($(this).offset().top);
                    if (sectionTop > scrollTop + tolerance) {
                        targetScroll = sectionTop;
                        return false; 
                    }
                });
            }
        } 
        else {
            var found = false;
            $($sections.get().reverse()).each(function() {
                var sectionTop = Math.round($(this).offset().top);
                // On cherche la première section dont le top est significativement 
                // au-dessus de la position actuelle du scroll
                if (sectionTop < scrollTop - tolerance) {
                    targetScroll = sectionTop;
                    found = true;
                    return false; 
                }
            });
            
            // Si on est entre le haut de page et la première section
            if (!found && scrollTop > tolerance) {
                targetScroll = 0;
            }
        }

        if (targetScroll !== -1) {
            isScrolling = true;
            $('html, body').stop().animate({ scrollTop: targetScroll }, speed, 'swing', function() {
                setTimeout(function() { isScrolling = false; }, 150);
            });
        }
    };

    window.addEventListener('wheel', handleSnapWheel, { passive: false });
};

var scrollAnchor = function(){
    var $viewport = $('html, body');
    $(".link-animate a, .link-animate").off('click').on('click', function (event) {
        event.preventDefault();
        var full_url = this.href;
        var parts = full_url.split("#");
        var trgt = parts[1];
        var offset_value = $(".header-navigation").outerHeight() - 1;
        var target_offset = $("#" + trgt).offset();
        var target_top = target_offset.top - offset_value;

        $viewport.animate({scrollTop: target_top}, 500, 'swing');
        $viewport.bind("scroll mousedown DOMMouseScroll mousewheel keyup", function () {
            $viewport.stop();
        });
    });
};

var resizeTimer;
$(window).on('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        initSnapScroll(); 
    }, 250);
});

$(document).ready(function () {
    scrollAnchor();
    scrollClass();
    initSnapScroll();
    initHomeScroll();
    if (typeof scrollInView === "function") scrollInView(); 
});

$(window).on('load', function () {
    hideDataFrontEndHelper();
});

$(window).scroll(function () {
    scrollClass();
});