(() => {

    const doc = document.documentElement;

    const button = document.getElementById('language-toggle');

    const storageKey = 'ecodubai-language';


    // Page titles

    const pageTitles = {

        index: {

            en: 'Home | EcoDubai',

            ar: 'الرئيسية | EcoDubai'

        },

        environment: {

            en: 'Environmental Sustainability | EcoDubai',

            ar: 'الاستدامة البيئية | EcoDubai'

        },

        communities: {

            en: 'Sustainable Communities | EcoDubai',

            ar: 'المجتمعات المستدامة | EcoDubai'

        },

        calculator: {

            en: 'Eco Impact Calculator | EcoDubai',

            ar: 'حاسبة أثر الاستدامة | EcoDubai'

        },

        references: {

            en: 'References | EcoDubai',

            ar: 'المراجع | EcoDubai'

        }

    };


    // Accessibility translations

    const accessibilityLabels = {

        'Main navigation': {

            en: 'Main navigation',

            ar: 'القائمة الرئيسية'

        },

        'Choose a scene': {

            en: 'Choose a scene',

            ar: 'اختر المشهد'

        },

        'Reveal a greener environment': {

            en: 'Reveal a greener environment',

            ar: 'استكشف بيئة أكثر استدامة'

        },

        'Reveal sustainable neighbourhood': {

            en: 'Reveal sustainable neighbourhood',

            ar: 'استكشف المجتمع المستدام'

        }

    };


    // Read previously selected language

    function getSavedLanguage() {

        try {

            return localStorage.getItem(storageKey) === 'ar'
                ? 'ar'
                : 'en';

        } catch (error) {

            return 'en';

        }

    }


    // Save selected language

    function saveLanguage(language) {

        try {

            localStorage.setItem(storageKey, language);

        } catch (error) {

            // Language switching still works without storage

        }

    }


    // Apply selected language

    function applyLanguage(language) {

        language = language === 'ar' ? 'ar' : 'en';

        const isArabic = language === 'ar';


        // Change language and page direction

        doc.setAttribute('lang', language);

        doc.setAttribute(
            'dir',
            isArabic ? 'rtl' : 'ltr'
        );


        // Translate website content

        document.querySelectorAll(
            '[data-en][data-ar]'
        ).forEach(element => {

            element.textContent =
                element.getAttribute('data-' + language);

        });


        // Translate browser tab title

        const page = document.body.dataset.page;

        if (pageTitles[page]) {

            document.title = pageTitles[page][language];

        }


        // Translate accessibility labels

        document.querySelectorAll(
            '[aria-label]'
        ).forEach(element => {

            const originalLabel =
                element.dataset.originalAriaLabel ||
                element.getAttribute('aria-label');

            element.dataset.originalAriaLabel =
                originalLabel;

            if (accessibilityLabels[originalLabel]) {

                element.setAttribute(

                    'aria-label',

                    accessibilityLabels[originalLabel][language]

                );

            }

        });


        // Update language switch button

        if (button) {

            button.textContent = isArabic
                ? '🌐 English'
                : '🌐 العربية';

            button.setAttribute(

                'aria-label',

                isArabic
                    ? 'Switch to English'
                    : 'التبديل إلى اللغة العربية'

            );

            button.setAttribute(

                'lang',

                isArabic ? 'en' : 'ar'

            );

            button.setAttribute('dir', 'ltr');

        }


        // Keep comparison sliders consistent

        document.querySelectorAll(
            '.split-view'
        ).forEach(element => {

            element.setAttribute('dir', 'ltr');

        });


        // Keep EcoDubai logo in English

        document.querySelectorAll(
            '.brand'
        ).forEach(element => {

            element.setAttribute('dir', 'ltr');

        });


        // Save language preference

        saveLanguage(language);


        // Notify other interactive components

        document.dispatchEvent(

            new CustomEvent('languagechange', {

                detail: {

                    language: language

                }

            })

        );

    }


    // Language toggle button

    if (button) {

        button.addEventListener('click', () => {

            const currentLanguage = doc.lang;

            const nextLanguage =
                currentLanguage === 'ar' ? 'en' : 'ar';

            applyLanguage(nextLanguage);

        });

    }


    // Synchronize language across open website tabs

    window.addEventListener('storage', event => {

        if (event.key === storageKey) {

            applyLanguage(

                event.newValue === 'ar' ? 'ar' : 'en'

            );

        }

    });


    // Initialize website language

    applyLanguage(getSavedLanguage());

})();
