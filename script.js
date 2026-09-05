(() => {

    "use strict";


    /* =====================================================
       BASIC SETTINGS
    ===================================================== */

    const reduceMotion =
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;


    /* =====================================================
       STARFIELD
    ===================================================== */

    const canvas = document.getElementById("starfield");

    let ctx = null;

    if (canvas) {
        ctx = canvas.getContext("2d");
    }

    let stars = [];
    let animationFrame = null;


    function createStars() {

        if (!canvas) return;

        const count = Math.min(
            140,
            Math.max(
                45,
                Math.floor(
                    (window.innerWidth * window.innerHeight) / 8000
                )
            )
        );

        stars = Array.from(
            { length: count },
            () => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,

                radius:
                    Math.random() * 1.3 + 0.2,

                alpha:
                    Math.random() * 0.55 + 0.1,

                speed:
                    Math.random() * 0.04 + 0.01,

                phase:
                    Math.random() * Math.PI * 2
            })
        );
    }


    function resizeCanvas() {

        if (!canvas || !ctx) return;

        const dpr =
            Math.min(window.devicePixelRatio || 1, 2);

        canvas.width =
            window.innerWidth * dpr;

        canvas.height =
            window.innerHeight * dpr;

        canvas.style.width =
            window.innerWidth + "px";

        canvas.style.height =
            window.innerHeight + "px";

        ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );

        createStars();
    }


    function drawStars(time) {

        if (!canvas || !ctx) return;

        ctx.clearRect(
            0,
            0,
            window.innerWidth,
            window.innerHeight
        );

        stars.forEach(star => {

            const twinkle =
                Math.sin(
                    time * star.speed +
                    star.phase
                ) * 0.3 + 0.7;

            ctx.beginPath();

            ctx.fillStyle =
                `rgba(
                    255,
                    235,
                    245,
                    ${star.alpha * twinkle}
                )`;

            ctx.arc(
                star.x,
                star.y,
                star.radius,
                0,
                Math.PI * 2
            );

            ctx.fill();


            if (!reduceMotion) {

                star.y -= 0.025;

                if (star.y < -5) {
                    star.y =
                        window.innerHeight + 5;
                }

            }

        });


        if (!reduceMotion) {

            animationFrame =
                requestAnimationFrame(drawStars);

        }
    }


    resizeCanvas();

    if (!reduceMotion) {

        animationFrame =
            requestAnimationFrame(drawStars);

    } else {

        drawStars(0);

    }


    window.addEventListener(
        "resize",
        resizeCanvas,
        { passive: true }
    );


    /* =====================================================
       FLOATING HEARTS
    ===================================================== */

    const floatingContainer =
        document.getElementById(
            "floatingHearts"
        );


    const HEART_PATH =
        "M16 28.5C16 28.5 1 19.5 1 9.5C1 4.25 5.03 1 9.25 1C12.02 1 14.5 2.5 16 5C17.5 2.5 19.98 1 22.75 1C26.97 1 31 4.25 31 9.5C31 19.5 16 28.5 16 28.5Z";


    function createHeartSVG() {

        const svg =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "svg"
            );

        svg.setAttribute(
            "viewBox",
            "0 0 32 29"
        );

        svg.setAttribute(
            "aria-hidden",
            "true"
        );


        const path =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "path"
            );


        path.setAttribute(
            "d",
            HEART_PATH
        );

        path.setAttribute(
            "fill",
            "currentColor"
        );


        svg.appendChild(path);

        return svg;
    }


    function spawnHeart() {

        if (!floatingContainer) return;


        const heart =
            document.createElement("div");

        heart.className =
            "floating-heart";


        const size =
            Math.random() * 17 + 10;


        const duration =
            Math.random() * 7 + 8;


        const drift =
            Math.random() * 60 - 30;


        heart.style.width =
            `${size}px`;

        heart.style.height =
            `${size * 0.9}px`;


        heart.style.left =
            `${Math.random() * 100}vw`;


        heart.style.setProperty(
            "--drift",
            `${drift}px`
        );


        heart.style.animationDuration =
            `${duration}s`;


        heart.style.color =
            Math.random() > 0.5
                ? "#ff3860"
                : "#ff6fa5";


        heart.appendChild(
            createHeartSVG()
        );


        floatingContainer.appendChild(
            heart
        );


        setTimeout(
            () => {
                heart.remove();
            },
            duration * 1000 + 500
        );
    }


    if (!reduceMotion) {

        setInterval(
            spawnHeart,
            1700
        );


        spawnHeart();


        setTimeout(
            spawnHeart,
            500
        );


        setTimeout(
            spawnHeart,
            1000
        );

    }


    /* =====================================================
       TYPING EFFECT
    ===================================================== */

    const typingTarget =
        document.getElementById(
            "typingText"
        );


    const typingMessage =
        "Some words are difficult to say... so I wrote them here. ❤️";


    let typingStarted = false;


    function typeText(
        element,
        text,
        speed = 45
    ) {

        if (!element) return;


        let index = 0;


        function type() {

            element.textContent =
                text.substring(
                    0,
                    index
                );


            index++;


            if (index <= text.length) {

                setTimeout(
                    type,
                    speed
                );

            }

        }


        type();
    }


    function startTyping() {

        if (
            typingStarted ||
            !typingTarget
        ) {
            return;
        }


        typingStarted = true;


        setTimeout(
            () => {

                typeText(
                    typingTarget,
                    typingMessage,
                    42
                );

            },
            500
        );
    }


    startTyping();


    /* =====================================================
       PAGE NAVIGATION
    ===================================================== */

    const pages =
        Array.from(
            document.querySelectorAll(
                ".page"
            )
        );


    const dots =
        Array.from(
            document.querySelectorAll(
                ".dot"
            )
        );


    let currentPage = 1;

    let isAnimating = false;


    function updateDots() {

        dots.forEach(
            dot => {

                const page =
                    Number(
                        dot.dataset.goto
                    );


                dot.classList.toggle(
                    "active",
                    page === currentPage
                );


                if (
                    page === currentPage
                ) {

                    dot.setAttribute(
                        "aria-current",
                        "true"
                    );

                } else {

                    dot.removeAttribute(
                        "aria-current"
                    );

                }

            }
        );
    }


    function goToPage(target) {

        if (!pages.length) return;


        target =
            Math.max(
                1,
                Math.min(
                    pages.length,
                    Number(target)
                )
            );


        if (
            target === currentPage ||
            isAnimating
        ) {
            return;
        }


        const oldPage =
            document.getElementById(
                `page${currentPage}`
            );


        const newPage =
            document.getElementById(
                `page${target}`
            );


        if (
            !oldPage ||
            !newPage
        ) {
            return;
        }


        isAnimating = true;


        oldPage.classList.remove(
            "active"
        );


        newPage.classList.add(
            "active"
        );


        currentPage = target;


        updateDots();


        playMusic();


        setTimeout(
            () => {

                isAnimating = false;

            },
            750
        );
    }


    /* =====================================================
       NEXT BUTTONS
    ===================================================== */

    document
        .querySelectorAll(
            "[data-next]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        goToPage(
                            currentPage + 1
                        );

                    }
                );

            }
        );


    /* =====================================================
       DOT NAVIGATION
    ===================================================== */

    dots.forEach(
        dot => {

            dot.addEventListener(
                "click",
                () => {

                    goToPage(
                        Number(
                            dot.dataset.goto
                        )
                    );

                }
            );

        }
    );


    updateDots();


    /* =====================================================
       KEYBOARD NAVIGATION
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "ArrowRight"
            ) {

                goToPage(
                    currentPage + 1
                );

            }


            if (
                event.key ===
                "ArrowLeft"
            ) {

                goToPage(
                    currentPage - 1
                );

            }

        }
    );


    /* =====================================================
       TOUCH SWIPE - MOBILE
    ===================================================== */

    let touchStartX = 0;
    let touchStartY = 0;


    document.addEventListener(
        "touchstart",
        event => {

            if (
                !event.touches ||
                !event.touches[0]
            ) {
                return;
            }


            touchStartX =
                event.touches[0].clientX;


            touchStartY =
                event.touches[0].clientY;

        },
        {
            passive: true
        }
    );


    document.addEventListener(
        "touchend",
        event => {

            if (
                !event.changedTouches ||
                !event.changedTouches[0]
            ) {
                return;
            }


            const touchEndX =
                event.changedTouches[0].clientX;


            const touchEndY =
                event.changedTouches[0].clientY;


            const differenceX =
                touchStartX -
                touchEndX;


            const differenceY =
                touchStartY -
                touchEndY;


            /*
                Ignore vertical scrolling.
                Only horizontal swipe changes pages.
            */

            if (
                Math.abs(differenceX) < 60 ||
                Math.abs(differenceX) <
                Math.abs(differenceY)
            ) {
                return;
            }


            if (differenceX > 0) {

                goToPage(
                    currentPage + 1
                );

            } else {

                goToPage(
                    currentPage - 1
                );

            }

        },
        {
            passive: true
        }
    );


    /* =====================================================
       MOUSE WHEEL PAGE NAVIGATION
    ===================================================== */

    let wheelLocked = false;


    document.addEventListener(
        "wheel",
        event => {

            if (wheelLocked) return;


            /*
                Only use wheel when user is
                near the edge of page content.
            */

            const activePage =
                document.getElementById(
                    `page${currentPage}`
                );


            const inner =
                activePage?.querySelector(
                    ".page-inner"
                );


            if (!inner) return;


            const canScroll =
                inner.scrollHeight >
                inner.clientHeight;


            if (canScroll) {

                const atTop =
                    inner.scrollTop <= 2;


                const atBottom =
                    inner.scrollTop +
                    inner.clientHeight >=
                    inner.scrollHeight - 2;


                if (
                    event.deltaY > 0 &&
                    !atBottom
                ) {
                    return;
                }


                if (
                    event.deltaY < 0 &&
                    !atTop
                ) {
                    return;
                }

            }


            if (
                Math.abs(event.deltaY) < 20
            ) {
                return;
            }


            wheelLocked = true;


            if (event.deltaY > 0) {

                goToPage(
                    currentPage + 1
                );

            } else {

                goToPage(
                    currentPage - 1
                );

            }


            setTimeout(
                () => {
                    wheelLocked = false;
                },
                900
            );

        },
        {
            passive: true
        }
    );


    /* =====================================================
       MUSIC
    ===================================================== */

    const music =
        document.getElementById(
            "bgMusic"
        );


    const muteButton =
        document.getElementById(
            "muteToggle"
        );


    let musicStarted = false;


    function playMusic() {

        if (
            !music ||
            musicStarted
        ) {
            return;
        }


        music.volume = 0.30;


        const promise =
            music.play();


        if (
            promise &&
            typeof promise.then ===
            "function"
        ) {

            promise
                .then(
                    () => {

                        musicStarted = true;


                        if (muteButton) {

                            muteButton.hidden =
                                false;

                        }

                    }
                )
                .catch(
                    () => {

                        /*
                           Browser blocked autoplay.
                           Music will start on interaction.
                        */

                        if (muteButton) {

                            muteButton.hidden =
                                true;

                        }

                    }
                );

        } else {

            musicStarted = true;

        }
    }


    /*
       Try music after first user interaction.
    */

    [
        "click",
        "touchstart",
        "keydown"
    ].forEach(
        eventName => {

            document.addEventListener(
                eventName,
                playMusic,
                {
                    once: true,
                    passive: true
                }
            );

        }
    );


    /*
       Mute / unmute
    */

    if (muteButton) {

        muteButton.addEventListener(
            "click",
            event => {

                event.stopPropagation();


                if (!music) return;


                music.muted =
                    !music.muted;


                muteButton.textContent =
                    music.muted
                        ? "🔇"
                        : "🎵";

            }
        );

    }


    if (music) {

        music.addEventListener(
            "error",
            () => {

                if (muteButton) {

                    muteButton.hidden =
                        true;

                }

            }
        );

    }


    /* =====================================================
       CAT EYES
    ===================================================== */

    const cat =
        document.querySelector(
            ".cat"
        );


    const pupils =
        document.querySelectorAll(
            ".pupil"
        );


    if (
        cat &&
        pupils.length &&
        !reduceMotion
    ) {

        function moveCatEyes(
            clientX,
            clientY
        ) {

            const rect =
                cat.getBoundingClientRect();


            const centerX =
                rect.left +
                rect.width / 2;


            const centerY =
                rect.top +
                rect.height / 2;


            const dx =
                clientX - centerX;


            const dy =
                clientY - centerY;


            const angle =
                Math.atan2(
                    dy,
                    dx
                );


            const distance =
                Math.min(
                    Math.hypot(
                        dx,
                        dy
                    ) / 100,
                    1
                );


            const moveX =
                Math.cos(angle) *
                5 *
                distance;


            const moveY =
                Math.sin(angle) *
                4 *
                distance;


            pupils.forEach(
                pupil => {

                    pupil.style.transform =
                        `translate(
                            ${moveX}px,
                            ${moveY}px
                        )`;

                }
            );
        }


        window.addEventListener(
            "mousemove",
            event => {

                moveCatEyes(
                    event.clientX,
                    event.clientY
                );

            },
            {
                passive: true
            }
        );


        window.addEventListener(
            "touchmove",
            event => {

                if (
                    event.touches &&
                    event.touches[0]
                ) {

                    moveCatEyes(
                        event.touches[0].clientX,
                        event.touches[0].clientY
                    );

                }

            },
            {
                passive: true
            }
        );

    }


    /* =====================================================
       FINAL SURPRISE
    ===================================================== */

    const heartButton =
        document.getElementById(
            "heartBtn"
        );


    const surprise =
        document.getElementById(
            "surprise"
        );


    if (heartButton) {

        heartButton.addEventListener(
            "click",
            () => {

                if (surprise) {

                    surprise.classList.add(
                        "show"
                    );

                }


                burstHearts(32);


                heartButton.innerHTML =
                    `
                    <span>
                        Okay... I’m Sorry 😭❤️
                    </span>
                    <b>♥</b>
                    `;


                heartButton.disabled =
                    true;


                setTimeout(
                    () => {

                        if (surprise) {

                            surprise.scrollIntoView(
                                {
                                    behavior:
                                        "smooth",

                                    block:
                                        "center"
                                }
                            );

                        }

                    },
                    300
                );

            }
        );

    }


    /* =====================================================
       HEART BURST
    ===================================================== */

    function burstHearts(
        count = 25
    ) {

        const centerX =
            window.innerWidth / 2;


        const centerY =
            window.innerHeight / 2;


        for (
            let i = 0;
            i < count;
            i++
        ) {

            setTimeout(
                () => {

                    const heart =
                        document.createElement(
                            "div"
                        );


                    heart.className =
                        "burst-heart";


                    const size =
                        Math.random() * 18 + 9;


                    heart.style.width =
                        `${size}px`;


                    heart.style.height =
                        `${size}px`;


                    /*
                       Start exactly around
                       the center button.
                    */

                    heart.style.left =
                        `${centerX}px`;


                    heart.style.top =
                        `${centerY}px`;


                    /*
                       Random explosion direction.
                    */

                    const angle =
                        Math.random() *
                        Math.PI *
                        2;


                    const distance =
                        Math.random() *
                        180 +
                        80;


                    const x =
                        Math.cos(angle) *
                        distance;


                    const y =
                        Math.sin(angle) *
                        distance;


                    heart.style.setProperty(
                        "--x",
                        x
                    );


                    heart.style.setProperty(
                        "--y",
                        y
                    );


                    heart.style.color =
                        Math.random() > 0.5
                            ? "#ff3860"
                            : "#ff6fa5";


                    heart.appendChild(
                        createHeartSVG()
                    );


                    document.body.appendChild(
                        heart
                    );


                    setTimeout(
                        () => {

                            heart.remove();

                        },
                        1800
                    );


                },
                i * 35
            );

        }

    }


    /* =====================================================
       FUNNY IMAGE FALLBACK
    ===================================================== */

    const funnyImage =
        document.querySelector(
            ".funny-box img"
        );


    const fallbackFunny =
        document.getElementById(
            "fallbackFunny"
        );


    if (
        funnyImage &&
        fallbackFunny
    ) {

        funnyImage.addEventListener(
            "error",
            () => {

                funnyImage.style.display =
                    "none";


                fallbackFunny.style.display =
                    "flex";

            }
        );

    }


    /* =====================================================
       IMAGE LOAD EFFECT
    ===================================================== */

    if (funnyImage) {

        funnyImage.addEventListener(
            "load",
            () => {

                funnyImage.style.opacity =
                    "1";

            }
        );

    }


    /* =====================================================
       PREVENT ACCIDENTAL DOUBLE TAP
    ===================================================== */

    document
        .querySelectorAll(
            "button"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "touchend",
                    event => {

                        event.stopPropagation();

                    },
                    {
                        passive: true
                    }
                );

            }
        );


    /* =====================================================
       INITIAL STATE
    ===================================================== */

    updateDots();


    /*
       Make sure page 1 is active
       when website opens.
    */

    pages.forEach(
        (page, index) => {

            if (index === 0) {

                page.classList.add(
                    "active"
                );

            } else {

                page.classList.remove(
                    "active"
                );

            }

        }
    );


    /* =====================================================
       PAGE VISIBILITY
    ===================================================== */

    document.addEventListener(
        "visibilitychange",
        () => {

            if (!music) return;


            if (
                document.hidden
            ) {

                music.pause();

            } else if (
                musicStarted &&
                !music.muted
            ) {

                music.play()
                    .catch(() => {});

            }

        }
    );


    /* =====================================================
       CLEANUP
    ===================================================== */

    window.addEventListener(
        "beforeunload",
        () => {

            if (animationFrame) {

                cancelAnimationFrame(
                    animationFrame
                );

            }

        }
    );


})();