var hideDataFrontEndHelper = function(){
    $('html *').removeAttr("data-frontend-helper");
    $('body').click(function() {
        $('.rsfh-lightbox-close').text("Fermer");
        $('.rsfh-lightbox-cancel').text("Annuler");
    });
};

var scrollClass = function(){
    var y = $(window).scrollTop(); // Correction ici : $(window) est plus fiable
    if (y > 200) {
        $("body").addClass("scroll");
    } else {
        $("body").removeClass("scroll");
    }
}
var initSnapScroll = function() {
    // --- RÉGLAGES ---
    var speed = 1500;      // Vitesse de l'animation en ms
    var tolerance = 50;   // Marge d'erreur pour la détection des sections
    var $sections = $('.snap-section');
    var isScrolling = false;

    window.addEventListener('wheel', function(e) {
        if (!$('body').hasClass('snap-scroll')) return;
        
        var delta = e.deltaY;
        var direction = delta > 0 ? 1 : -1;
        var scrollTop = Math.round($(window).scrollTop());
        var lastSectionTop = Math.round($sections.last().offset().top);

        // 1. SORTIE BAS DE PAGE : On laisse le scroll naturel après le dernier snap
        if (direction === 1 && scrollTop >= lastSectionTop - tolerance) return;

        e.preventDefault();
        if (isScrolling) return;

        var targetScroll = -1;

        // 2. NAVIGATION VERS LE BAS
        if (direction === 1) {
            // Si on est au sommet (Header), on saute direct à la 2ème section (index 1)
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
        // 3. NAVIGATION VERS LE HAUT
        else {
            $($sections.get().reverse()).each(function() {
                var sectionTop = Math.round($(this).offset().top);
                if (sectionTop < scrollTop - tolerance) {
                    // Si on remonte vers la 1ère section, on vise le 0 absolu (Header)
                    targetScroll = $(this).is($sections.first()) ? 0 : sectionTop;
                    return false; 
                }
            });
            // Sécurité : si on est entre le 0 et la 1ère section
            if (targetScroll === -1 && scrollTop > 0) targetScroll = 0;
        }

        // 4. EXÉCUTION DE L'ANIMATION
        if (targetScroll !== -1) {
            isScrolling = true;
            $('html, body').stop().animate({ scrollTop: targetScroll }, speed, 'swing', function() {
                setTimeout(function() { isScrolling = false; }, 150);
            });
        }
    }, { passive: false });
};

var scrollAnchor = function(){
    var $viewport = $('html, body');

    $(".link-animate a, .link-animate").click(function (event) {
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

$(document).ready(function () {
    scrollAnchor();
    scrollClass();
    initSnapScroll(); // Activation du snap
});

$(window).on('load', function () {
    hideDataFrontEndHelper();
});

$(window).scroll(function () {
    scrollClass();
});