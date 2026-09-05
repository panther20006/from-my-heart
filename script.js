(() => {

    "use strict";


    /* =====================================================
       BASIC SETTINGS
    ====================================================== */

    const reduceMotion =
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;


    /* =====================================================
       STARFIELD
    ====================================================== */

    const canvas = document.getElementById("starfield");
    const ctx = canvas.getContext("2d");

    let stars = [];
    let animationFrame;

    function resizeCanvas() {

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        createStars();
    }

    function createStars() {

        const count = Math.min(
            140,
            Math.floor(
                (window.innerWidth * window.innerHeight) / 8000
            )
        );

        stars = Array.from(
            { length: count },
            () => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,

                radius:
                    Math.random() * 1.3 + .2,

                alpha:
                    Math.random() * .55 + .1,

                speed:
                    Math.random() * .04 + .01,

                phase:
                    Math.random() * Math.PI * 2
            })
        );
    }

    function drawStars(time) {

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        stars.forEach(star => {

            const twinkle =
                Math.sin(
                    time * star.speed +
                    star.phase
                ) * .3 + .7;

            ctx.beginPath();

            ctx.fillStyle =
                `rgba(255,235,245,${star.alpha * twinkle})`;

            ctx.arc(
                star.x,
                star.y,
                star.radius,
                0,
                Math.PI * 2
            );

            ctx.fill();

            if (!reduceMotion) {

                star.y -= .025;

                if (star.y < -5) {
                    star.y = canvas.height + 5;
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
        resizeCanvas
    );


    /* =====================================================
       FLOATING HEARTS
    ====================================================== */

    const floatingContainer =
        document.getElementById("floatingHearts");

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
            `${size * .9}px`;

        heart.style.left =
            `${Math.random() * 100}vw`;

        heart.style.setProperty(
            "--drift",
            `${drift}px`
        );

        heart.style.animationDuration =
            `${duration}s`;

        heart.style.color =
            Math.random() > .5
                ? "#ff3860"
                : "#ff6fa5";

        heart.appendChild(
            createHeartSVG()
        );

        floatingContainer.appendChild(
            heart
        );

        setTimeout(
            () => heart.remove(),
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
       TYPING
    ====================================================== */

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
        ) return;

        typingStarted = true;

        setTimeout(
            () => {

                typeText(
                    typingTarget,
                    typingMessage
                );

            },
            500
        );
    }

    startTyping();


    /* =====================================================
       PAGE NAVIGATION
    ====================================================== */

    const pages =
        Array.from(
            document.querySelectorAll(".page")
        );

    const dots =
        Array.from(
            document.querySelectorAll(".dot")
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

            }
        );
    }


    function goToPage(target) {

        target =
            Math.max(
                1,
                Math.min(
                    pages.length,
                    target
                )
            );

        if (
            target === currentPage ||
            isAnimating
        ) return;

        isAnimating = true;

        const oldPage =
            document.getElementById(
                `page${currentPage}`
            );

        const newPage =
            document.getElementById(
                `page${target}`
            );

        if (!oldPage || !newPage) {

            isAnimating = false;
            return;

        }

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


    document
        .querySelectorAll("[data-next]")
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


    /* =====================================================
       KEYBOARD NAVIGATION
    ====================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "ArrowRight") {
                goToPage(
                    currentPage + 1
                );
            }

            if (event.key === "ArrowLeft") {
                goToPage(
                    currentPage - 1
                );
            }

        }
    );


    /* =====================================================
       TOUCH SWIPE
    ====================================================== */

    let touchStartX = 0;

    document.addEventListener(
        "touchstart",
        event => {

            touchStartX =
                event.touches[0].clientX;

        },
        { passive: true }
    );


    document.addEventListener(
        "touchend",
        event => {

            const touchEndX =
                event.changedTouches[0].clientX;

            const difference =
                touchStartX - touchEndX;

            if (Math.abs(difference) < 60) {
                return;
            }

            if (difference > 0) {

                goToPage(
                    currentPage + 1
                );

            } else {

                goToPage(
                    currentPage - 1
                );

            }

        },
        { passive: true }
    );


    updateDots();


    /* =====================================================
       MUSIC
    ====================================================== */

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
        ) return;

        music.volume = .30;

        const promise =
            music.play();

        if (
            promise &&
            typeof promise.then === "function"
        ) {

            promise
                .then(() => {

                    musicStarted = true;

                    if (muteButton) {
                        muteButton.hidden = false;
                    }

                })
                .catch(() => {

                    if (muteButton) {
                        muteButton.hidden = true;
                    }

                });

        } else {

            musicStarted = true;

        }
    }


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


    if (muteButton) {

        muteButton.addEventListener(
            "click",
            () => {

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


    /* =====================================================
       CAT EYES
    ====================================================== */

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

        window.addEventListener(
            "mousemove",
            event => {

                const rect =
                    cat.getBoundingClientRect();

                const centerX =
                    rect.left +
                    rect.width / 2;

                const centerY =
                    rect.top +
                    rect.height / 2;

                const dx =
                    event.clientX -
                    centerX;

                const dy =
                    event.clientY -
                    centerY;

                const angle =
                    Math.atan2(
                        dy,
                        dx
                    );

                const distance =
                    Math.min(
                        Math.hypot(dx, dy) / 80,
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
                            `translate(${moveX}px, ${moveY}px)`;

                    }
                );

            },
            { passive: true }
        );

    }


    /* =====================================================
       FINAL SURPRISE
    ====================================================== */

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

                burstHearts(30);

                heartButton.innerHTML =
                    "<span>Okay... I’m Sorry 😭❤️</span><b>♥</b>";

                heartButton.disabled = true;

                setTimeout(
                    () => {

                        surprise?.scrollIntoView({
                            behavior: "smooth",
                            block: "center"
                        });

                    },
                    250
                );

            }
        );

    }


    /* =====================================================
       HEART BURST
    ====================================================== */

    function burstHearts(
        count = 20
    ) {

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
                        Math.random() * 18 + 10;

                    heart.style.width =
                        `${size}px`;

                    heart.style.height =
                        `${size}px`;

                    heart.style.left =
                        `${35 + Math.random() * 30}%`;

                    heart.style.top =
                        `${45 + Math.random() * 15}%`;

                    heart.style.setProperty(
                        "--x",
                        `${Math.random() * 200 - 100}`
                    );

                    heart.style.setProperty(
                        "--y",
                        `${Math.random() * 200 - 100}`
                    );

                    heart.appendChild(
                        createHeartSVG()
                    );

                    document.body.appendChild(
                        heart
                    );

                    setTimeout(
                        () => heart.remove(),
                        1800
                    );

                },
                i * 45
            );

        }

    }


    /* =====================================================
       FINAL LITTLE EFFECT
    ====================================================== */

    window.addEventListener(
        "load",
        () => {

            setTimeout(
                () => {

                    if (currentPage === 1) {
                        spawnHeart();
                    }

                },
                1200
            );

        }
    );

})();