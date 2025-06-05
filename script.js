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

    const targetSection = document.getElementById(targetId);
    const targetNavButton = document.querySelector(`.nav-push-button[data-target="${targetId}"]`);
    let targetTopBarId = targetId + '-bar';
    consoleLog('targetTopBarId', targetTopBarId);
    const targetTopBar = document.getElementById(targetTopBarId);
    consoleLog('targetTopBar', targetTopBar);
    const targetTopBarLabel = document.querySelector(`.mfd-soft-key[data-target="${targetId}"]`);


    if (targetTopBarLabel) targetTopBarLabel.classList.add('active');
    if (targetSection) targetSection.classList.add('active');
    if (targetNavButton) targetNavButton.classList.add('active');
    if (targetTopBar) targetTopBar.classList.add('active');
}

function activateSubSection(targetId, doc = document, sections, topBarLabels) {
    sections.forEach(section => section.classList.remove('active'));
    topBarLabels.forEach(label => label.classList.remove('active'));

    const targetSection = document.getElementById(targetId);
    if (targetSection) targetSection.classList.add('active');

    const targetTopBarLabel = document.querySelector(`.mfd-soft-key[data-target="${targetId}"]`);
    if (targetTopBarLabel) targetTopBarLabel.classList.add('active');

    getProjectCards();
}

function getProjectCards() {
    const activeSection = getActiveSection();
    consoleLog(activeSection);
    const projectCards = document.querySelectorAll(`#${activeSection} .project-card`);
    consoleLog(projectCards);
}

function consoleLog(message){
    if (DEBUG_LOGS) {
        console.log(message)
    };
}



document.addEventListener('DOMContentLoaded', () => {
            // get if runnig on local server        
            const IS_LOCALHOST = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
            DEBUG_LOGS = IS_LOCALHOST;

            // get top buttons, sections, and nav buttons
            const navButtons = document.querySelectorAll('.nav-push-button');
            const sections = document.querySelectorAll('.content-section');
            const topBars = document.querySelectorAll('.mfd-header-bar');
            const topBarLabels = document.querySelectorAll('.mfd-soft-key');

            //initial call
            activeSection('projects', document, navButtons, sections, topBars, topBarLabels);

            function GetActiveSection() {
                const activeSection = document.querySelector('.content-section.active');
                return activeSection ? activeSection.id : null;
            }

            function changeTopBarText(targetId) {
                
            }
            

            function consoleLog(message){
                if (DEBUG_LOGS) {
                    console.log(message)
                };
            }
            function getProjectCards() {
                    const activeSection = GetActiveSection();
                    consoleLog(activeSection);
                    const projectCards = document.querySelectorAll(`#${activeSection} .project-card`);
                    consoleLog(projectCards);
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
                    // if(GetActiveSection() === 'projects')
                    // {
                    //     activateSubSection('games');
                    //     console.log('MFD Button Pressed:', button.textContent || button.title);
                    // }
                    if(button.dataset.target != null){
                        consoleLog('MFD Button Pressed:', button.textContent || button.title);
                        activateSubSection(button.dataset.target, document, sections, topBarLabels);
                    }
                    
                    
                    button.classList.add('mfd-pressed'); // This class is not styled yet, but can be used for feedback
                    setTimeout(() => button.classList.remove('mfd-pressed'), 150);
                });
            });

            
            document.getElementById('currentYear').textContent = new Date().getFullYear();

            // get scrolling buttons and content area
            const scrollButtonUp = document.getElementById('scroll-up');
            const scrollButtonDown = document.getElementById('scroll-down');
            const mfdContentArea = document.querySelector('.mfd-content-area');

            
            if(mfdContentArea){
                window.addEventListener('wheel', function(event){
                    if(mfdContentArea.contains(event.target)){
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
            if(contactForm){
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
    module.exports = { getActiveSection, activateSection, consoleLog, getProjectCards};
}