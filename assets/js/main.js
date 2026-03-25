// 1. SCROLL PROGRESS
window.addEventListener('scroll', () => {
    const h = document.documentElement,
        b = document.body,
        st = 'scrollTop',
        sh = 'scrollHeight';
    const percent = (h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight) * 100;
    const progressEl = document.getElementById('scroll-progress');
    if (progressEl) progressEl.style.width = percent + "%";

    const nav = document.getElementById('navbar');
    if (nav) {
        if (window.scrollY > 20) {
            nav.classList.add('shadow-[0_10px_30px_rgba(0,0,0,0.05)]');
            nav.classList.remove('bg-[#EAEAE5]/60');
            nav.classList.add('bg-[#EAEAE5]/90');
        } else {
            nav.classList.remove('shadow-[0_10px_30px_rgba(0,0,0,0.05)]', 'bg-[#EAEAE5]/90');
            nav.classList.add('bg-[#EAEAE5]/60');
        }
    }
});

// Detect Mobile for Payloads
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

window.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        initAnimations();
    }
    
    // Lazy Video Implementation (Saves ~4MB on load)
    const lazyVideos = document.querySelectorAll('.main-video-lazy');
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(video => {
            if (video.isIntersecting) {
                const source = video.target.querySelector('source');
                if (source && source.dataset.src) {
                    source.src = source.dataset.src;
                    video.target.load();
                    video.target.play();
                    videoObserver.unobserve(video.target);
                    console.log("Video Lazy Loaded");
                }
            }
        });
    }, { threshold: 0.1 });
    lazyVideos.forEach(v => videoObserver.observe(v));
});

function initAnimations() {
    gsap.to(".animate-float-slow", {
        y: (i, t) => -window.innerHeight * 0.1,
        ease: "none",
        scrollTrigger: {
            trigger: ".animate-float-slow",
            start: "top bottom",
            end: "bottom top",
            scrub: 2
        }
    });

    setTimeout(() => {
        const heroContent = document.getElementById('hero-content');
        if (heroContent) heroContent.classList.add('reveal-active');
    }, 300);

    const initElements = document.querySelectorAll('.init-hidden');
    gsap.to(initElements, {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.2,
        force3D: true
    });

    // IMAGE SEQUENCE (CANVAS)
    const frameCount = 192;
    const images = [];
    const frameData = { index: 0 };
    const canvas = document.getElementById("hero-canvas");
    
    if (canvas) {
        const ctx = canvas.getContext("2d");

        function loadFrame(i) {
            const img = new Image();
            const zeroPaddedNum = i.toString().padStart(4, '0');
            img.src = `assets/video_frames/frame_${zeroPaddedNum}.webp`;
            images[i - 1] = img;
        }

        // MOBILE OPTIMIZATION: Load less initial frames
        const criticalBatch = isMobile ? 8 : 25;
        for (let i = 1; i <= criticalBatch; i++) {
            loadFrame(i);
        }

        window.addEventListener('load', () => {
            // Delay non-critical frames to boost LCP score
            const loadDelay = isMobile ? 3000 : 1500; 
            setTimeout(() => {
                for (let i = criticalBatch + 1; i <= frameCount; i++) {
                    setTimeout(() => loadFrame(i), (i - criticalBatch) * 15);
                }
            }, loadDelay);
        });

        if (images[0]) {
            images[0].onload = renderFrame;
        }

        function renderFrame() {
            const index = Math.floor(frameData.index);
            const img = images[index];
            if (img && img.complete) {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            } else if (index > 0) {
                let prevIndex = index - 1;
                while (prevIndex >= 0) {
                    if (images[prevIndex] && images[prevIndex].complete) {
                        ctx.drawImage(images[prevIndex], 0, 0, canvas.width, canvas.height);
                        break;
                    }
                    prevIndex--;
                }
            }
        }

        gsap.to(frameData, {
            index: frameCount - 1,
            ease: "none",
            scrollTrigger: {
                trigger: ".hero-scrub",
                start: "top top",
                end: "bottom bottom",
                scrub: 0,
                onUpdate: () => requestAnimationFrame(renderFrame)
            }
        });
    }

    gsap.to("#hero-content", {
        y: -50,
        opacity: 0,
        filter: "blur(12px)",
        scrollTrigger: {
            trigger: ".hero-scrub",
            start: "10% top",
            end: "30% top",
            scrub: 1.5
        }
    });

    gsap.to("#hero-overlays", {
        opacity: 0,
        y: 30,
        scrollTrigger: {
            trigger: ".hero-scrub",
            start: "5% top",
            end: "15% top",
            scrub: true
        }
    });

    ScrollTrigger.create({
        trigger: ".lg\\:col-span-12", // Bento container
        start: "top 85%",
        onEnter: () => {
            gsap.to(".stagger-item", {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out",
                force3D: true
            });
        }
    });

    gsap.to("#cta-final", {
        y: 0, opacity: 1, duration: 1.2, ease: "power3.out", force3D: true,
        scrollTrigger: { trigger: "#cta-final", start: "top 90%" }
    });
}

const revealElements = document.querySelectorAll(".reveal-up");
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
        }
    });
}, { threshold: 0.1, rootMargin: "0px" });
revealElements.forEach(el => observer.observe(el));

window.updateFlashlight = function(e, card) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
    if (typeof gsap !== 'undefined') {
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 60;
        const rotateY = (centerX - x) / 60;
        gsap.to(card, { rotateX, rotateY, duration: 0.5, ease: "power2.out" });
    }
}
document.querySelectorAll('.flashlight-card').forEach(card => {
    card.addEventListener('mouseleave', () => {
        if (typeof gsap !== 'undefined') gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.5 });
    });
});
document.querySelectorAll('button.group, a.gemini-laser-button').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        if (typeof gsap !== 'undefined') {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(btn, { x: x * 0.15, y: y * 0.15, duration: 0.4, ease: "power2.out" });
        }
    });
    btn.addEventListener('mouseleave', () => {
        if (typeof gsap !== 'undefined') gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" });
    });
});
