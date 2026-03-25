// 1. SCROLL PROGRESS
window.addEventListener('scroll', () => {
    const h = document.documentElement, 
          b = document.body,
          st = 'scrollTop',
          sh = 'scrollHeight';
    const percent = (h[st]||b[st]) / ((h[sh]||b[sh]) - h.clientHeight) * 100;
    document.getElementById('scroll-progress').style.width = percent + "%";
    
    // Navbar Shadow logic
    const nav = document.getElementById('navbar');
    if (window.scrollY > 20) {
        nav.classList.add('shadow-[0_10px_30px_rgba(0,0,0,0.05)]');
        nav.classList.remove('bg-[#EAEAE5]/60');
        nav.classList.add('bg-[#EAEAE5]/90');
    } else {
        nav.classList.remove('shadow-[0_10px_30px_rgba(0,0,0,0.05)]', 'bg-[#EAEAE5]/90');
        nav.classList.add('bg-[#EAEAE5]/60');
    }
});

// 2. PARALLAX BLOBS (Second Fold)
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

// 3. ACTIVATE MASK REVEAL ON LOAD
window.addEventListener('load', () => {
    setTimeout(() => {
        const heroContent = document.getElementById('hero-content');
        if (heroContent) heroContent.classList.add('reveal-active');
    }, 300);
});

// 4. GSAP REGISTER & CANVAS SETUP
gsap.registerPlugin(ScrollTrigger);

const canvas = document.getElementById("hero-canvas");
if (canvas) {
    const ctx = canvas.getContext("2d");
    const frameCount = 180;
    const images = [];
    const frameData = { index: 0 };

    function preloadImages() {
        for (let i = 1; i <= frameCount; i++) {
            const img = new Image();
            const zeroPaddedNum = i.toString().padStart(4, '0');
            img.src = `assets/video_frames/frame_${zeroPaddedNum}.jpg`;
            images.push(img);
        }
    }

    function renderFrame() {
        const index = Math.floor(frameData.index);
        const img = images[index];
        if (img && img.complete) {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
    }

    preloadImages();
    if (images[0]) {
        images[0].onload = renderFrame;
    }

    // Scroll Scrub for Canvas
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

    // Fade out Hero Content
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

    // Fade out Overlays
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
}

// 5. OBSERVERS FOR REVEAL UP
const revealElements = document.querySelectorAll(".reveal-up");
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.classList.add("visible");
        }
    });
}, { threshold: 0.1 });

revealElements.forEach(el => observer.observe(el));

// 6. GSAP STAGGER FOR FEED
ScrollTrigger.create({
    trigger: ".lg\\:col-span-5",
    start: "top 85%",
    onEnter: () => {
        gsap.to(".stagger-item", {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            force3D: true
        });
    }
});

// 7. FLASHLIGHT & TILT EFFECT
function updateFlashlight(e, card) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 50;
    const rotateY = (centerX - x) / 50;
    
    gsap.to(card, {
        rotateX: rotateX,
        rotateY: rotateY,
        duration: 0.5,
        ease: "power2.out"
    });
}

document.querySelectorAll('.flashlight-card').forEach(card => {
    card.addEventListener('mousemove', (e) => updateFlashlight(e, card));
    card.addEventListener('mouseleave', () => {
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.5 });
    });
});

// 8. CTA FINAL REVEAL
gsap.to("#cta-final", {
    y: 0,
    opacity: 1,
    duration: 1.2,
    ease: "power3.out",
    force3D: true,
    scrollTrigger: {
        trigger: "#cta-final",
        start: "top 90%",
    }
});

// 9. MAGNETIC BUTTONS
document.querySelectorAll('button.group, a.gemini-laser-button, button.init-hidden').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        gsap.to(btn, {
            x: x * 0.2,
            y: y * 0.2,
            duration: 0.4,
            ease: "power2.out"
        });
    });
    
    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" });
    });
});
