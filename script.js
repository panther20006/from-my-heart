```javascript
document.addEventListener("DOMContentLoaded", () => {

    const typing = document.getElementById("typing");
    const openBtn = document.getElementById("openBtn");
    const closeBtn = document.getElementById("closeBtn");
    const messageScreen = document.getElementById("messageScreen");
    const container = document.querySelector(".container");
    const heartsContainer = document.getElementById("hearts");

    /* =========================
       TYPING ANIMATION
    ========================= */

    const text =
        "Some words are difficult to say... so I wrote them here.";

    let index = 0;

    function typeText() {

        if (index < text.length) {

            typing.textContent += text.charAt(index);

            index++;

            setTimeout(typeText, 45);

        } else {

            openBtn.style.opacity = "1";

        }
    }

    openBtn.style.opacity = "0";

    setTimeout(typeText, 1000);


    /* =========================
       FLOATING HEARTS
    ========================= */

    function createHeart() {

        const heart = document.createElement("div");

        heart.classList.add("floating-heart");

        heart.innerHTML = "❤";

        const size = Math.random() * 18 + 10;

        const left = Math.random() * 100;

        const duration = Math.random() * 6 + 6;

        const move =
            (Math.random() * 160 - 80) + "px";

        heart.style.left = left + "%";

        heart.style.fontSize = size + "px";

        heart.style.animationDuration =
            duration + "s";

        heart.style.setProperty(
            "--move",
            move
        );

        heartsContainer.appendChild(heart);

        setTimeout(() => {

            heart.remove();

        }, duration * 1000);
    }

    setInterval(createHeart, 700);


    /* =========================
       OPEN MESSAGE
    ========================= */

    openBtn.addEventListener("click", () => {

        messageScreen.classList.add("active");

        container.style.filter = "blur(8px)";

        createHeartBurst();

    });


    /* =========================
       CLOSE MESSAGE
    ========================= */

    closeBtn.addEventListener("click", () => {

        messageScreen.classList.remove("active");

        container.style.filter = "blur(0)";

    });


    /* =========================
       HEART BURST
    ========================= */

    function createHeartBurst() {

        for (let i = 0; i < 25; i++) {

            const heart = document.createElement("div");

            heart.classList.add("floating-heart");

            heart.innerHTML = "❤";

            heart.style.left =
                Math.random() * 100 + "%";

            heart.style.bottom =
                Math.random() * 50 + "%";

            heart.style.fontSize =
                Math.random() * 18 + 10 + "px";

            heart.style.animationDuration =
                Math.random() * 3 + 3 + "s";

            heart.style.setProperty(
                "--move",
                (Math.random() * 300 - 150) + "px"
            );

            heartsContainer.appendChild(heart);

            setTimeout(() => {
                heart.remove();
            }, 6000);
        }
    }


    /* =========================
       ESC KEY
    ========================= */

    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape") {

            messageScreen.classList.remove("active");

            container.style.filter = "blur(0)";
        }

    });

});
```

