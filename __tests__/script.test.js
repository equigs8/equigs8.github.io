// Import functions to test from script.js
const { getActiveSection, activateSection, activateSubSection, consoleLog, getProjectCardsInActiveSection} = require('../script.js');

describe('Portfolio Script Tests', () => {
    describe('getActiveSection', () => {
        test('should return the ID of the active section', () => {
            // Set up a mock DOM environment for this test
            document.body.innerHTML = `
                <div>
                    <section id="about" class="content-section"></section>
                    <section id="overview" class="content-section active"></section>
                </div>
            `;
            expect(getActiveSection(document)).toBe('overview');
        });

        test('should return null if no section is active', () => {
            document.body.innerHTML = `
                <div>
                    <section id="about" class="content-section"></section>
                    <section id="overview" class="content-section"></section>
                </div>
            `;
            expect(getActiveSection(document)).toBeNull();
        });
        test('should return first active section if multiple are active', () => {
            document.body.innerHTML = `
                <div>
                    <section id="about" class="content-section active"></section>
                    <section id="overview" class="content-section active"></section>
                </div>
            `;
            expect(getActiveSection(document)).toBe('about');
        });
    });

    describe('activateSection', () => {
        describe('activateSection for "overview"', () => {
            let navButtons, sections, topBars, topBarLabels;

            beforeEach(() => {
                // Set up the mock DOM
                document.body.innerHTML = `
                    <button class="nav-push-button" data-target="about" id="nav-about"></button>
                    <button class="nav-push-button" data-target="overview" id="nav-projects"></button>
                    <div id="about-bar" class="mfd-header-bar">
                        <span class="mfd-soft-key" data-target="about"></span>
                    </div>
                    <div id="projects-bar" class="mfd-header-bar">
                         <span class="mfd-soft-key" data-target="overview"></span>
                         <span class="mfd-soft-key" data-target="projects"></span>
                    </div>
                    <section id="about" class="content-section"></section>
                    <section id="overview" class="content-section"></section>
                    <section id="projects" class="content-section"></section>
                `;

                // Query elements after DOM is set
                navButtons = document.querySelectorAll('.nav-push-button');
                sections = document.querySelectorAll('.content-section');
                topBars = document.querySelectorAll('.mfd-header-bar');
                topBarLabels = document.querySelectorAll('.mfd-soft-key');

                // Call activateSection to set the state for the following tests
                activateSection('overview', document, navButtons, sections, topBars, topBarLabels);
            });

            test('should add "active" class to the target overview section', () => {
                const overviewSection = document.getElementById('overview');
                expect(overviewSection.classList.contains('active')).toBe(true);
            });

            test('should add "active" class to the target overview/logs navigation button', () => {
                const logsNavButton = document.querySelector('.nav-push-button[data-target="overview"]');
                expect(logsNavButton.classList.contains('active')).toBe(true);
            });

            test('should add "active" class to the target projects MFD header bar', () => {
                const projectsTopBar = document.getElementById('projects-bar');
                expect(projectsTopBar.classList.contains('active')).toBe(true);
            });

            test('should add "active" class to the target overview MFD soft key label in the header bar', () => {
                const overviewTopBarLabel = document.querySelector('#projects-bar .mfd-soft-key[data-target="overview"]');
                expect(overviewTopBarLabel.classList.contains('active')).toBe(true);
            });

            test('should ensure a non-target section (e.g., about) does not have "active" class', () => {
                const aboutSection = document.getElementById('about');
                expect(aboutSection.classList.contains('active')).toBe(false);
            });

            test('should ensure a non-target navigation button (e.g., about) does not have "active" class', () => {
                const aboutNavButton = document.querySelector('.nav-push-button[data-target="about"]');
                expect(aboutNavButton.classList.contains('active')).toBe(false);
            });
        });
    });

    describe('activateSubSection', () => {
        let sections, topBarLabels;

        beforeEach(() => {
            document.body.innerHTML = `
                <div id="projects-bar" class="mfd-header-bar active">
                    <span class="mfd-soft-key" data-target="overview">OVERVIEW</span>
                    <span class="mfd-soft-key" data-target="games">GAMES</span>
                    <span class="mfd-soft-key" data-target="projects">PROJECTS</span>
                    <span class="mfd-soft-key" data-target="courses">COURSES</span>
                </div>
                <section id="overview" class="content-section active"></section>
                <section id="games" class="content-section"></section>
                <section id="projects" class="content-section"></section>
                <section id="courses" class="content-section"></section>
            `;
            sections = document.querySelectorAll('.content-section');
            topBarLabels = document.querySelectorAll('.mfd-soft-key');
        });

        test('should activate projects section and projects soft key', () => {
            activateSubSection('projects', document, sections, topBarLabels);
            expect(document.getElementById('projects').classList.contains('active')).toBe(true);
            expect(document.getElementById('overview').classList.contains('active')).toBe(false);
            expect(document.querySelector('.mfd-soft-key[data-target="projects"]').classList.contains('active')).toBe(true);
            expect(document.querySelector('.mfd-soft-key[data-target="overview"]').classList.contains('active')).toBe(false);
        });

        test('should activate courses section and courses soft key', () => {
            activateSubSection('courses', document, sections, topBarLabels);
            expect(document.getElementById('courses').classList.contains('active')).toBe(true);
            expect(document.getElementById('overview').classList.contains('active')).toBe(false);
            expect(document.querySelector('.mfd-soft-key[data-target="courses"]').classList.contains('active')).toBe(true);
            expect(document.querySelector('.mfd-soft-key[data-target="overview"]').classList.contains('active')).toBe(false);
        });
    });

    describe('getProjectCardsInActiveSection', () => {
        test('should return the project cards in the active section', () => {
            // Set up a mock DOM environment for this test
            document.body.innerHTML = `
                <section id="projects" class="content-section active">
                    <div class="project-card"></div>
                    <div class="project-card"></div>
                    <div class="project-card"></div>
                </section>
            `;
            const navButtons = document.querySelectorAll('.nav-push-button');
            const sections = document.querySelectorAll('.content-section');
            const topBars = document.querySelectorAll('.mfd-header-bar');
            const topBarLabels = document.querySelectorAll('.mfd-soft-key');

            // Call activateSection to set the state for the following tests
            activateSection('projects', document, navButtons, sections, topBars, topBarLabels);

            // Call the function to get the project cards
            const projectCards = getProjectCardsInActiveSection(document);
            // Assert that the function returns the correct number of project cards
            expect(projectCards.length).toBe(3);
        });
    });
});