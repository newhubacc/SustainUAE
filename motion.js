(() => {

    const reduced = matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;

    const doc = document.documentElement;

    doc.classList.add('page-enter');


    // Scroll progress bar

    const progress = document.createElement('div');

    progress.className = 'progress-line';

    progress.setAttribute('aria-hidden', 'true');

    document.body.append(progress);

    const scroll = () => {

        const max = doc.scrollHeight - innerHeight;

        const percentage = max > 0
            ? Math.min(100, Math.max(0, scrollY / max * 100))
            : 0;

        progress.style.width = percentage + '%';

    };

    addEventListener('scroll', scroll, {
        passive: true
    });

    addEventListener('resize', scroll);

    scroll();


    // Reveal animations

    if (!reduced && 'IntersectionObserver' in window) {

        doc.classList.add('motion-ready');

        const observer = new IntersectionObserver(es => {

            es.forEach(e => {

                if (e.isIntersecting) {

                    e.target.classList.add('visible');

                    observer.unobserve(e.target);

                }

            });

        }, {
            threshold: .08
        });

        document.querySelectorAll(
            'main section:not(.calc section), main .grid > .tile, main .ref, .metric-strip'
        ).forEach(e => {

            e.classList.add('reveal');

            observer.observe(e);

        });

    }


    // Before and after comparison sliders

    document.querySelectorAll('.split-view').forEach(el => {

        const input = el.querySelector('input[type="range"]');

        if (!input) return;

        // Keep slider movement consistent in both languages

        el.setAttribute('dir', 'ltr');

        input.setAttribute('dir', 'ltr');

        const updateSplit = () => {

            el.style.setProperty(
                '--split',
                input.value + '%'
            );

        };

        input.addEventListener('input', updateSplit);

        updateSplit();

    });


    // Homepage scene switching

    const img = document.querySelector('.hero-image');

    const buttons = document.querySelectorAll('[data-scene]');

    let timer;

    if (img && buttons.length) {

        buttons.forEach(btn => {

            btn.addEventListener('click', () => {

                if (btn.classList.contains('active')) return;

                buttons.forEach(b => {

                    b.classList.toggle(
                        'active',
                        b === btn
                    );

                    b.setAttribute(
                        'aria-pressed',
                        String(b === btn)
                    );

                });

                clearTimeout(timer);

                img.classList.add('switching');

                timer = setTimeout(() => {

                    img.src = './' + btn.dataset.scene + '.jpg';

                    img.classList.remove('switching');

                }, reduced ? 0 : 350);

            });

        });

    }


    // Page navigation transitions

    if (!reduced) {

        document.querySelectorAll('a[href]').forEach(a => {

            const href = a.getAttribute('href');

            if (!/^[a-z]+\.html$/.test(href) || a.target) {

                return;

            }

            a.addEventListener('click', e => {

                if (
                    e.ctrlKey ||
                    e.metaKey ||
                    e.shiftKey ||
                    e.altKey ||
                    e.button !== 0 ||
                    e.defaultPrevented
                ) {

                    return;

                }

                e.preventDefault();

                doc.classList.add('page-exit');

                setTimeout(() => {

                    location.href = href;

                }, 220);

            });

        });

    }


    // Restore page when using browser navigation

    addEventListener('pageshow', () => {

        doc.classList.remove('page-exit');

        scroll();

    });


    // Recalculate scroll progress after switching language

    const languageObserver = new MutationObserver(() => {

        requestAnimationFrame(scroll);

    });

    languageObserver.observe(doc, {

        attributes: true,

        attributeFilter: ['lang', 'dir']

    });


    // Update after all page resources have loaded

    addEventListener('load', scroll);

})();
