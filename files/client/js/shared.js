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
    var isScrolling = false;
    var $sections = $('.snap-section');

    // On utilise addEventListener natif pour pouvoir passer { passive: false }
    window.addEventListener('wheel', function(e) {
        if (!$('body').hasClass('snap-scroll')) return;
        
        // Maintenant le preventDefault fonctionnera
        e.preventDefault();

        if (isScrolling) return;

        var delta = e.deltaY; // Natif utilise deltaY
        var direction = delta > 0 ? 1 : -1;
        var scrollTop = Math.round($(window).scrollTop());
        
        var currentIndex = -1;
        var minDistance = Infinity;

        $sections.each(function(index) {
            var distance = Math.abs($(this).offset().top - scrollTop);
            if (distance < minDistance) {
                minDistance = distance;
                currentIndex = index;
            }
        });

        console.log("--- Debug Scroll ---");
        console.log("Pos:", scrollTop, "| Dir:", direction > 0 ? "Bas" : "Haut", "| Current:", currentIndex);

        var targetScroll = -1;

        if (direction === -1) {
            // Si on monte et qu'on est sur la première section (0) OU la deuxième (1)
            // on force le retour au TOUT DEBUT (0px) pour voir le header
            if (currentIndex <= 1) {
                targetScroll = 0;
            } else {
                targetScroll = $sections.eq(currentIndex - 1).offset().top;
            }
        } else if (direction === 1) {
            // On descend
            if (currentIndex < $sections.length - 1) {
                targetScroll = $sections.eq(currentIndex + 1).offset().top;
            }
        }

        if (targetScroll !== -1) {
            isScrolling = true;
            console.log("Action : Animation vers", targetScroll);
            
            $('html, body').stop().animate({
                scrollTop: targetScroll
            }, 800, 'swing', function() {
                setTimeout(function() { isScrolling = false; }, 200);
            });
        }
    }, { passive: false }); // CRUCIAL pour corriger l'erreur console
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