let DEBUG_LOGS = false;

function getActiveSection(doc = document) {
    const activeSection = doc.querySelector('.content-section.active');
    return activeSection ? activeSection.id : null;
}

function activateSection(targetId, doc = document, navButtons, sections, topBars, topBarLabels) {
    sections.forEach(section => section.classList.remove('active'));
    navButtons.forEach(btn => btn.classList.remove('active'));
    topBars.forEach(div => div.classList.remove('active'));
    topBarLabels.forEach(label => label.classList.remove('active'));

    const targetSection = doc.getElementById(targetId);
    let targetNavButton = doc.querySelector(`.nav-push-button[data-target="${targetId}"]`);
    let targetTopBarId = targetId + '-bar';
    let targetTopBar = doc.getElementById(targetTopBarId);

    // Map overview / projects / games / courses / logs to projects-bar & logs button if needed
    if (targetId === 'overview' || targetId === 'projects' || targetId === 'logs' || targetId === 'games') {
        if (!targetTopBar) targetTopBar = doc.getElementById('projects-bar') || doc.getElementById('logs-bar');
        if (!targetNavButton) targetNavButton = doc.querySelector('.nav-push-button[data-target="overview"]') || doc.querySelector('.nav-push-button[data-target="projects"]') || doc.querySelector('.nav-push-button[data-target="logs"]');
    } else if (targetId === 'about' || targetId === 'career' || targetId === 'education') {
        if (!targetTopBar) targetTopBar = doc.getElementById('about-bar');
        if (!targetNavButton) targetNavButton = doc.querySelector('.nav-push-button[data-target="about"]');
    }

    const targetTopBarLabel = doc.querySelector(`.mfd-soft-key[data-target="${targetId}"]`);

    if (targetTopBarLabel) targetTopBarLabel.classList.add('active');
    if (targetSection) targetSection.classList.add('active');
    if (targetNavButton) targetNavButton.classList.add('active');
    if (targetTopBar) targetTopBar.classList.add('active');

    getProjectCardsInActiveSection(doc);
}

function activateSubSection(targetId, doc = document, sections, topBarLabels) {
    sections.forEach(section => section.classList.remove('active'));
    topBarLabels.forEach(label => label.classList.remove('active'));

    const targetSection = doc.getElementById(targetId);
    if (targetSection) targetSection.classList.add('active');

    const activeTopBar = doc.querySelector('.mfd-header-bar.active');
    if (activeTopBar) {
        const activeLabelInBar = activeTopBar.querySelector(`.mfd-soft-key[data-target="${targetId}"]`);
        if (activeLabelInBar) {
            activeLabelInBar.classList.add('active');
        }
    } else {
        const targetTopBarLabel = doc.querySelector(`.mfd-soft-key[data-target="${targetId}"]`);
        if (targetTopBarLabel) targetTopBarLabel.classList.add('active');
    }

    getProjectCardsInActiveSection(doc);
}

function getProjectCardsInActiveSection(doc = document) {
    const activeSection = getActiveSection(doc);
    consoleLog(activeSection);
    const projectCards = doc.querySelectorAll(`#${activeSection} .project-card`);
    consoleLog(projectCards);
    return projectCards;
}

function consoleLog(message){
    if (DEBUG_LOGS) {
        console.log(message);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // get if running on local server
    const IS_LOCALHOST = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    DEBUG_LOGS = IS_LOCALHOST;

    // get top buttons, sections, and nav buttons
    const navButtons = document.querySelectorAll('.nav-push-button');
    const sections = document.querySelectorAll('.content-section');
    const topBars = document.querySelectorAll('.mfd-header-bar');
    const topBarLabels = document.querySelectorAll('.mfd-soft-key');

    // initial call based on data-initial-section or default
    const initialTarget = document.body.dataset.initialSection || 'overview';
    if (initialTarget === 'games' || initialTarget === 'projects' || initialTarget === 'courses') {
        activateSection('overview', document, navButtons, sections, topBars, topBarLabels);
        activateSubSection(initialTarget, document, sections, topBarLabels);
    } else if (initialTarget === 'career' || initialTarget === 'education') {
        activateSection('about', document, navButtons, sections, topBars, topBarLabels);
        activateSubSection(initialTarget, document, sections, topBarLabels);
    } else {
        activateSection(initialTarget, document, navButtons, sections, topBars, topBarLabels);
    }

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.dataset.target;
            activateSection(targetId, document, navButtons, sections, topBars, topBarLabels);
        });
    });

    const mfdButtons = document.querySelectorAll('.mfd-push-button');
    mfdButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.classList.add('mfd-pressed');
            setTimeout(() => button.classList.remove('mfd-pressed'), 150);
        });
    });

    const topMfdButtons = document.querySelectorAll('.mfd-button-bank.top .mfd-push-button');
    topMfdButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            const activeTopBar = document.querySelector('.mfd-header-bar.active');
            let target = null;
            if (activeTopBar) {
                const softKeys = activeTopBar.querySelectorAll('.mfd-soft-key');
                if (softKeys[index] && softKeys[index].dataset.target) {
                    target = softKeys[index].dataset.target;
                }
            }
            if (!target && button.dataset.target) {
                target = button.dataset.target;
            }
            if (target) {
                consoleLog('MFD Top Button Pressed:', button.textContent || button.title, 'Target:', target);
                activateSubSection(target, document, sections, topBarLabels);
            }
        });
    });

    // Soft key direct clicks
    topBarLabels.forEach(label => {
        label.addEventListener('click', () => {
            if (label.dataset.target) {
                consoleLog('Soft Key Pressed:', label.textContent, 'Target:', label.dataset.target);
                activateSubSection(label.dataset.target, document, sections, topBarLabels);
            }
        });
    });

    const currentYearEl = document.getElementById('currentYear');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    // get scrolling buttons and content area
    const scrollButtonUp = document.getElementById('scroll-up');
    const scrollButtonDown = document.getElementById('scroll-down');
    const mfdContentArea = document.querySelector('.mfd-content-area');

    if (mfdContentArea) {
        window.addEventListener('wheel', function(event) {
            if (mfdContentArea.contains(event.target)) {
                return;
            }
            event.preventDefault();
            mfdContentArea.scrollTop += event.deltaY;
        }, { passive: false });
    }

    if (scrollButtonUp && scrollButtonDown && mfdContentArea) {
        const scrollAmount = 275;

        scrollButtonUp.addEventListener('click', () => {
            mfdContentArea.scrollBy({ top: -scrollAmount, behavior: 'smooth' });
            consoleLog('Scrolling Up');
        });
        scrollButtonDown.addEventListener('click', () => {
            mfdContentArea.scrollBy({ top: scrollAmount, behavior: 'smooth' });
            consoleLog('Scrolling Down');
        });
    }

    const contactForm = document.querySelector('#contact form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const sendButton = contactForm.querySelector('button[type="submit"]');
            const originalText = sendButton.textContent;
            sendButton.textContent = 'TRANSMITTING...';
            sendButton.disabled = true;
            sendButton.style.backgroundColor = 'var(--button-face)';
            sendButton.style.color = 'var(--text-muted)';

            setTimeout(() => {
                sendButton.textContent = 'PACKET ACKNOWLEDGED';
                sendButton.style.backgroundColor = 'var(--indicator-on-green)';
                sendButton.style.color = 'var(--console-bg)';
                setTimeout(() => {
                    sendButton.textContent = originalText;
                    sendButton.style.backgroundColor = '';
                    sendButton.style.color = '';
                    sendButton.disabled = false;
                    contactForm.reset();
                }, 2500);
            }, 1500);
        });
    }
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getActiveSection, activateSection, activateSubSection, consoleLog, getProjectCardsInActiveSection };
}