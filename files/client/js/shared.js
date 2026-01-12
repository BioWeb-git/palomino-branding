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
function animateHeadline(headlineElement) {
    const $headline = $(headlineElement);
    if ($headline.find('.char').length > 0) return;

    $headline.css('opacity', '0');

    let headlineHTML = $headline.html()
        .replace(/[\n\t]/g, '') 
        .replace(/<br>/gi, ' <span class="br-forcer"></span> '); 
    $headline.html(headlineHTML);

    $headline.lettering('words');
    $headline.find('span').lettering();

    const letters = $headline.find('span').find('span'); 
    const tl = gsap.timeline();

    tl.from(letters, {
        opacity: 0,
        y: (i, target) => gsap.utils.random(-100, -200), 
        x: (i, target) => gsap.utils.random(-50, 50), 
        rotation: (i, target) => gsap.utils.random(-90, 90), 
        scale: 0.8,
        transformOrigin: "50% 50%",
        stagger: {
            each: 0.08,        // ⬅️ AUGMENTER (était à 0.03) : plus de temps entre chaque lettre
            from: "random" 
        },
        duration: 1.5,         // ⬅️ AUGMENTER (était à 0.8) : chaque lettre met plus de temps à tomber
        ease: "power2.out", 
    });

    tl.to($headline, { opacity: 1, duration: 1.2, ease: "power2.out" }, 0); 
}
// 2. Déclencheur au scroll (IntersectionObserver)
var scrollInView = function() {
    const animatedElements = document.querySelectorAll('.headline-box.ce_rsce_client_headline_box_custom');

    // Initialisation de ScrollTrigger si dispo
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }
    
    const observerOptions = {
        root: null,
        threshold: 0.2 
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // On récupère tous les titres et sous-titres dans l'élément observé
                const elementsToAnimate = entry.target.querySelectorAll('.headline, .subheadline');
                
                elementsToAnimate.forEach(el => {
                    animateHeadline(el);
                });

                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    animatedElements.forEach(element => {
        observer.observe(element);
    });
};
var initSnapScroll = function() {
    var $sections = $('.snap-section');
    
    // CONDITION DE SÉCURITÉ : 
    // S'il n'y a pas de sections ou une seule, on n'active pas le script.
    if ($sections.length <= 1) return;

    var speed = 1500;
    var tolerance = 50;
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
                    targetScroll = $(this).is($sections.first()) ? 0 : sectionTop;
                    return false; 
                }
            });
            if (targetScroll === -1 && scrollTop > 0) targetScroll = 0;
        }

        // 4. EXÉCUTION
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
    scrollInView();
});

$(window).on('load', function () {
    hideDataFrontEndHelper();
});

$(window).scroll(function () {
    scrollClass();
});