// Import functions to test from script.js
const { getActiveSection, activateSection, consoleLog, getProjectCards} = require('../script.js');


describe('Portfolio Script Tests', () => {
    describe('getActiveSection', () => {
        test('should return the ID of the active section', () => {
            // Set up a mock DOM environment for this test
            document.body.innerHTML = `
                <div>
                    <section id="about" class="content-section"></section>
                    <section id="projects" class="content-section active"></section>
                </div>
            `;
            expect(getActiveSection(document)).toBe('projects');
        });

        test('should return null if no section is active', () => {
            document.body.innerHTML = `
                <div>
                    <section id="about" class="content-section"></section>
                    <section id="projects" class="content-section"></section>
                </div>
            `;
            expect(getActiveSection(document)).toBeNull();
        });
    });

    describe('activateSection', () => {
        describe('activateSection for "projects"', () => {
    let navButtons, sections, topBars, topBarLabels;

    beforeEach(() => {
        // Set up the mock DOM
        document.body.innerHTML = `
            <button class="nav-push-button" data-target="about" id="nav-about"></button>
            <button class="nav-push-button" data-target="projects" id="nav-projects"></button>
            <div id="about-bar" class="mfd-header-bar">
                <span class="mfd-soft-key" data-target="about"></span>
            </div>
            <div id="projects-bar" class="mfd-header-bar">
                 <span class="mfd-soft-key" data-target="projects"></span>
            </div>
            <section id="about" class="content-section"></section>
            <section id="projects" class="content-section"></section>
        `;

        // Query elements after DOM is set
        navButtons = document.querySelectorAll('.nav-push-button');
        sections = document.querySelectorAll('.content-section');
        topBars = document.querySelectorAll('.mfd-header-bar');
        topBarLabels = document.querySelectorAll('.mfd-soft-key');

        // Call activateSection to set the state for the following tests
        activateSection('projects', document, navButtons, sections, topBars, topBarLabels);
        });

        test('should add "active" class to the target projects section', () => {
            const projectsSection = document.getElementById('projects');
            expect(projectsSection.classList.contains('active')).toBe(true);
        });

        test('should add "active" class to the target projects navigation button', () => {
            const projectsNavButton = document.querySelector('.nav-push-button[data-target="projects"]');
            expect(projectsNavButton.classList.contains('active')).toBe(true);
        });

        test('should add "active" class to the target projects MFD header bar', () => {
            const projectsTopBar = document.getElementById('projects-bar');
            expect(projectsTopBar.classList.contains('active')).toBe(true);
        });

        test('should add "active" class to the target projects MFD soft key label in the header bar', () => {
            const projectsTopBarLabel = document.querySelector('#projects-bar .mfd-soft-key[data-target="projects"]');
            expect(projectsTopBarLabel.classList.contains('active')).toBe(true);
        });

        test('should ensure a non-target section (e.g., about) does not have "active" class', () => {
            const aboutSection = document.getElementById('about');
            expect(aboutSection.classList.contains('active')).toBe(false);
        });

        test('should ensure a non-target navigation button (e.g., about) does not have "active" class', () => {
            const aboutNavButton = document.querySelector('.nav-push-button[data-target="about"]');
            // Assuming activateSection also deactivates other buttons
            expect(aboutNavButton.classList.contains('active')).toBe(false);
        });

        test('should ensure a non-target MFD header bar (e.g., about-bar) does not have "active" class', () => {
            const aboutTopBar = document.getElementById('about-bar');
            // Assuming activateSection also deactivates other top bars
            expect(aboutTopBar.classList.contains('active')).toBe(false);
        });

        test('should ensure a non-target MFD soft key label (e.g., about) does not have "active" class', () => {
            const aboutTopBarLabel = document.querySelector('#about-bar .mfd-soft-key[data-target="about"]');
            // Assuming activateSection also deactivates other labels
            expect(aboutTopBarLabel.classList.contains('active')).toBe(false);
        });
        });
    });
});