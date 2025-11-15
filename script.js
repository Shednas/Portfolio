document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('#hero, #about, #projects, #skills, #blogs-footer');
    const navLinks = document.querySelectorAll('nav a');
    
    let currentSection = 0;
    let isAnimating = false;

    const sectionMap = {
        'about': 1,
        'projects': 2,
        'contact': 4
    };

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    // Initialize sections with animations
    sections.forEach((section, index) => {
        Object.assign(section.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100vh',
            opacity: index === 0 ? '1' : '0',
            transform: index === 0 ? 'translateY(0)' : 'translateY(100%)',
            transition: 'all 0.8s cubic-bezier(0.645, 0.045, 0.355, 1)',
            zIndex: index === 0 ? '10' : '1'
        });
    });

    function goToSection(index) {
        if (isAnimating || index < 0 || index >= sections.length || index === currentSection) return;
        
        isAnimating = true;
        const direction = index > currentSection ? 1 : -1;
        const oldSection = sections[currentSection];
        const newSection = sections[index];

        oldSection.style.transform = `translateY(${-100 * direction}%)`;
        oldSection.style.opacity = '0';
        oldSection.style.zIndex = '1';

        newSection.style.zIndex = '10';
        newSection.style.transform = `translateY(${100 * direction}%)`;
        newSection.style.opacity = '0';

        setTimeout(() => {
            newSection.style.transform = 'translateY(0)';
            newSection.style.opacity = '1';
        }, 50);

        currentSection = index;
        updateIndicators();
        updateNavLinks();

        setTimeout(() => {
            isAnimating = false;
        }, 800);
    }

    // Wheel scrolling
    let scrollTimeout;
    document.addEventListener('wheel', function(e) {
        e.preventDefault();
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            goToSection(e.deltaY > 0 ? currentSection + 1 : currentSection - 1);
        }, 50);
    }, { passive: false });

    // Touch scrolling
    let touchStartY = 0;
    document.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    });

    document.addEventListener('touchmove', (e) => {
        e.preventDefault();
    }, { passive: false });

    document.addEventListener('touchend', (e) => {
        const touchEndY = e.changedTouches[0].clientY;
        const diff = touchStartY - touchEndY;

        if (Math.abs(diff) > 50) {
            goToSection(diff > 0 ? currentSection + 1 : currentSection - 1);
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            e.preventDefault();
            goToSection(currentSection + 1);
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            goToSection(currentSection - 1);
        } else if (e.key === 'Home') {
            e.preventDefault();
            goToSection(0);
        } else if (e.key === 'End') {
            e.preventDefault();
            goToSection(sections.length - 1);
        }
    });

    // Navigation link clicks
    navLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href').replace('#', '');
            const sectionIndex = sectionMap[href];
            if (sectionIndex !== undefined) {
                goToSection(sectionIndex);
            }
        });
    });

    // Navigation indicators
    const indicators = document.createElement('div');
    indicators.style.cssText = `
        position: fixed;
        right: 30px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 1000;
        display: flex;
        flex-direction: column;
        gap: 15px;
    `;

    const sectionTitles = ['Hero', 'About', 'Projects', 'Skills', 'Contact'];

    sections.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.style.cssText = `
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background-color: ${index === 0 ? '#10B981' : '#9ca3af'};
            cursor: pointer;
            transition: all 0.3s ease;
            border: 2px solid transparent;
        `;
        
        dot.title = sectionTitles[index];
        
        dot.addEventListener('click', () => goToSection(index));
        dot.addEventListener('mouseenter', () => {
            if (index !== currentSection) {
                dot.style.backgroundColor = '#F59E0B';
                dot.style.transform = 'scale(1.2)';
            }
        });
        dot.addEventListener('mouseleave', () => {
            if (index !== currentSection) {
                dot.style.backgroundColor = '#9ca3af';
                dot.style.transform = 'scale(1)';
            }
        });
        
        indicators.appendChild(dot);
    });

    document.body.appendChild(indicators);

    function updateIndicators() {
        const dots = indicators.children;
        Array.from(dots).forEach((dot, index) => {
            if (index === currentSection) {
                dot.style.backgroundColor = '#10B981';
                dot.style.transform = 'scale(1.3)';
                dot.style.border = '2px solid #10B981';
            } else {
                dot.style.backgroundColor = '#9ca3af';
                dot.style.transform = 'scale(1)';
                dot.style.border = '2px solid transparent';
            }
        });
    }

    function updateNavLinks() {
        navLinks.forEach((link) => {
            const href = link.getAttribute('href').replace('#', '');
            const sectionIndex = sectionMap[href];
            
            if (sectionIndex === currentSection) {
                link.style.color = '#10B981';
            } else {
                link.style.color = '#ffffff';
            }
        });
    }

    updateIndicators();
    updateNavLinks();
});
