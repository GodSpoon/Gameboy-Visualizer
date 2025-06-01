// Interface controller
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize audio processor
    const initAudio = await audioProcessor.init();
    if (!initAudio) {
        alert('Failed to initialize audio. Please ensure microphone access is allowed.');
    }
    
    // Load sprites for visualizer
    await visualizer.loadSprites();
    
    // UI elements
    const menuOverlay = document.getElementById('menu-overlay');
    const menuItems = document.querySelectorAll('.menu-items li');
    let selectedMenuItem = 0;
    let menuVisible = false;
    
    // Button elements
    const btnUp = document.getElementById('btn-up');
    const btnDown = document.getElementById('btn-down');
    const btnLeft = document.getElementById('btn-left');
    const btnRight = document.getElementById('btn-right');
    const btnA = document.getElementById('btn-a');
    const btnB = document.getElementById('btn-b');
    const btnStart = document.getElementById('btn-start');
    const btnSelect = document.getElementById('btn-select');
    
    // Visualization options
    const visualizationStyles = ['waveform', 'frequencyBars', 'spriteDance', 'pixelStorm', 'glitchMode'];
    const colorSchemes = ['vaporwave', 'neoVaporwave', 'gameboyGreen', 'synthwave'];
    const spriteOptions = ['pikachu_gen1', 'bulbasaur_gen1'];
    const audioSources = ['mic', 'system'];
    
    let currentVisualizationIndex = 0;
    let currentColorSchemeIndex = 0;
    let currentSpriteIndex = 0;
    let currentAudioSourceIndex = 0;
    
    // Menu categories and their options
    const menuCategories = [
        {
            name: 'Visualization Style',
            options: ['Waveform', 'Frequency Bars', 'Sprite Dance', 'Pixel Storm', 'Glitch Mode'],
            currentIndex: 0,
            action: (index) => {
                currentVisualizationIndex = index;
                visualizer.setVisualizationStyle(visualizationStyles[index]);
            }
        },
        {
            name: 'Color Palette',
            options: ['Vaporwave', 'Neo Vaporwave', 'GameBoy Green', 'Synthwave'],
            currentIndex: 0,
            action: (index) => {
                currentColorSchemeIndex = index;
                visualizer.setColorScheme(colorSchemes[index]);
            }
        },
        {
            name: 'Sprite Selection',
            options: ['Pikachu', 'Bulbasaur'],
            currentIndex: 0,
            action: (index) => {
                currentSpriteIndex = index;
                visualizer.setCurrentSprite(spriteOptions[index]);
            }
        },
        {
            name: 'Audio Source',
            options: ['Microphone', 'System Audio'],
            currentIndex: 0,
            action: (index) => {
                currentAudioSourceIndex = index;
                if (index === 0) {
                    audioProcessor.setupMicrophone();
                } else {
                    audioProcessor.setupSystemAudio();
                }
            }
        },
        {
            name: 'Settings',
            options: ['Toggle Fullscreen', 'Toggle Glitch Effect', 'Reset All'],
            currentIndex: 0,
            action: (index) => {
                if (index === 0) {
                    toggleFullscreen();
                } else if (index === 1) {
                    visualizer.toggleGlitch();
                } else if (index === 2) {
                    resetAllSettings();
                }
            }
        }
    ];
    
    let currentMenuCategory = 0;
    let currentSubmenuOpen = false;
    
    // Button click handlers
    btnStart.addEventListener('click', toggleMenu);
    btnSelect.addEventListener('click', toggleAudioSource);
    btnA.addEventListener('click', selectMenuItem);
    btnB.addEventListener('click', goBack);
    btnUp.addEventListener('click', navigateUp);
    btnDown.addEventListener('click', navigateDown);
    btnLeft.addEventListener('click', navigateLeft);
    btnRight.addEventListener('click', navigateRight);
    
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'ArrowUp':
                navigateUp();
                break;
            case 'ArrowDown':
                navigateDown();
                break;
            case 'ArrowLeft':
                navigateLeft();
                break;
            case 'ArrowRight':
                navigateRight();
                break;
            case 'z': // A button
                selectMenuItem();
                break;
            case 'x': // B button
                goBack();
                break;
            case 'Enter': // START
                toggleMenu();
                break;
            case 'Shift': // SELECT
                toggleAudioSource();
                break;
        }
    });
    
    // Menu navigation functions
    function toggleMenu() {
        menuVisible = !menuVisible;
        if (menuVisible) {
            menuOverlay.classList.add('active');
            updateMenuDisplay();
        } else {
            menuOverlay.classList.remove('active');
            currentSubmenuOpen = false;
        }
    }
    
    function updateMenuDisplay() {
        if (!menuVisible) return;
        
        const menuTitle = document.querySelector('.menu-title');
        const menuItemsList = document.querySelector('.menu-items');
        
        if (currentSubmenuOpen) {
            // Show submenu options
            const category = menuCategories[currentMenuCategory];
            menuTitle.textContent = category.name;
            
            let menuHTML = '';
            category.options.forEach((option, index) => {
                const selectedClass = index === category.currentIndex ? 'selected' : '';
                menuHTML += `<li class="${selectedClass}">${option}</li>`;
            });
            
            menuItemsList.innerHTML = menuHTML;
        } else {
            // Show main menu categories
            menuTitle.textContent = 'MENU';
            
            let menuHTML = '';
            menuCategories.forEach((category, index) => {
                const selectedClass = index === currentMenuCategory ? 'selected' : '';
                menuHTML += `<li class="${selectedClass}">${category.name}</li>`;
            });
            
            menuItemsList.innerHTML = menuHTML;
        }
    }
    
    function navigateUp() {
        if (!menuVisible) return;
        
        if (currentSubmenuOpen) {
            const category = menuCategories[currentMenuCategory];
            category.currentIndex = (category.currentIndex - 1 + category.options.length) % category.options.length;
        } else {
            currentMenuCategory = (currentMenuCategory - 1 + menuCategories.length) % menuCategories.length;
        }
        
        updateMenuDisplay();
    }
    
    function navigateDown() {
        if (!menuVisible) return;
        
        if (currentSubmenuOpen) {
            const category = menuCategories[currentMenuCategory];
            category.currentIndex = (category.currentIndex + 1) % category.options.length;
        } else {
            currentMenuCategory = (currentMenuCategory + 1) % menuCategories.length;
        }
        
        updateMenuDisplay();
    }
    
    function navigateLeft() {
        if (!menuVisible || !currentSubmenuOpen) return;
        
        const category = menuCategories[currentMenuCategory];
        category.currentIndex = (category.currentIndex - 1 + category.options.length) % category.options.length;
        updateMenuDisplay();
    }
    
    function navigateRight() {
        if (!menuVisible || !currentSubmenuOpen) return;
        
        const category = menuCategories[currentMenuCategory];
        category.currentIndex = (category.currentIndex + 1) % category.options.length;
        updateMenuDisplay();
    }
    
    function selectMenuItem() {
        if (!menuVisible) return;
        
        if (currentSubmenuOpen) {
            // Apply the selected option
            const category = menuCategories[currentMenuCategory];
            category.action(category.currentIndex);
            
            // Go back to main menu
            currentSubmenuOpen = false;
        } else {
            // Enter submenu
            currentSubmenuOpen = true;
        }
        
        updateMenuDisplay();
    }
    
    function goBack() {
        if (!menuVisible) return;
        
        if (currentSubmenuOpen) {
            // Go back to main menu
            currentSubmenuOpen = false;
            updateMenuDisplay();
        } else {
            // Close menu
            toggleMenu();
        }
    }
    
    function toggleAudioSource() {
        audioProcessor.toggleAudioSource();
    }
    
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }
    
    function resetAllSettings() {
        currentVisualizationIndex = 0;
        currentColorSchemeIndex = 0;
        currentSpriteIndex = 0;
        currentAudioSourceIndex = 0;
        
        visualizer.setVisualizationStyle(visualizationStyles[0]);
        visualizer.setColorScheme(colorSchemes[0]);
        visualizer.setCurrentSprite(spriteOptions[0]);
        audioProcessor.setupMicrophone();
        
        menuCategories.forEach(category => {
            category.currentIndex = 0;
        });
        
        updateMenuDisplay();
    }
    
    // Animation loop
    function animate() {
        // Get audio data
        const audioData = audioProcessor.getAudioData();
        const bassLevel = audioProcessor.getBassLevel();
        const midLevel = audioProcessor.getMidLevel();
        const highLevel = audioProcessor.getHighLevel();
        
        // Render visualization
        visualizer.render(audioData, bassLevel, midLevel, highLevel);
        
        // Request next frame
        requestAnimationFrame(animate);
    }
    
    // Start animation loop
    animate();
});
