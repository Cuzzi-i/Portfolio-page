document.addEventListener("DOMContentLoaded", function () {
    let isFirstScroll = true;

    function smoothScrollToNextSection() {
        const firstSection = document.querySelector(".profile-section");
        const secondSection = firstSection?.nextElementSibling;

        if (secondSection) {
            const targetPosition = secondSection.offsetTop;
            const startPosition = window.scrollY;
            const distance = targetPosition - startPosition;
            const duration = 800;
            let startTime = null;

            function animationScroll(currentTime) {
                if (startTime === null) startTime = currentTime;
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);

                window.scrollTo(0, startPosition + distance * easeOutCubic(progress));

                if (progress < 1) {
                    requestAnimationFrame(animationScroll);
                }
            }

            function easeOutCubic(t) {
                return 1 - Math.pow(1 - t, 3); 
            }

            requestAnimationFrame(animationScroll);
        }
    }

    window.addEventListener("wheel", function (event) {
        if (isFirstScroll && event.deltaY > 0) {
            smoothScrollToNextSection();
            isFirstScroll = false;
        }
    });

    window.addEventListener("scroll", function () {
        if (window.scrollY === 0) {
            isFirstScroll = true;
        }
    });
});