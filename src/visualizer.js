// Visualizer implementation
class Visualizer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.width = 160; // GameBoy resolution width
        this.height = 144; // GameBoy resolution height
        this.visualizationStyle = 'waveform'; // Default style
        this.colorScheme = 'vaporwave'; // Default color scheme
        this.sprites = {}; // Will hold loaded sprite images
        this.currentSprite = null;
        this.isGlitching = false;
        this.pixelSize = 2; // Size of each "pixel" for pixelated effect
        this.particles = [];
        this.scanLinePos = 0;
        
        // Vaporwave color palette
        this.colors = {
            vaporwave: {
                primary: '#ff6ad5',
                secondary: '#c774e8',
                tertiary: '#94d0ff',
                accent: '#00ffff',
                highlight: '#ffff8f',
                background: '#000000'
            },
            neoVaporwave: {
                primary: '#fd1d53',
                secondary: '#833ab4',
                tertiary: '#fcb045',
                accent: '#00ffff',
                highlight: '#ffff00',
                background: '#000000'
            },
            gameboyGreen: {
                primary: '#0f380f',
                secondary: '#306230',
                tertiary: '#8bac0f',
                accent: '#9bbc0f',
                highlight: '#9bbc0f',
                background: '#0f380f'
            },
            synthwave: {
                primary: '#ff00ff',
                secondary: '#9600ff',
                tertiary: '#4900ff',
                accent: '#00ffff',
                highlight: '#ff0000',
                background: '#000000'
            }
        };
        
        // Initialize canvas size
        this.resizeCanvas();
        
        // Bind methods
        this.resizeCanvas = this.resizeCanvas.bind(this);
        
        // Add event listener for window resize
        window.addEventListener('resize', this.resizeCanvas);
    }
    
    resizeCanvas() {
        // Set canvas resolution to GameBoy's native resolution
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        
        // CSS will handle scaling to fit the container
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.imageRendering = 'pixelated';
    }
    
    async loadSprites() {
        // Load Pokémon sprites
        const spriteNames = ['pikachu_gen1', 'bulbasaur_gen1'];
        const loadPromises = spriteNames.map(name => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    this.sprites[name] = img;
                    resolve();
                };
                img.onerror = () => reject(new Error(`Failed to load sprite: ${name}`));
                img.src = `../assets/${name}.png`;
            });
        });
        
        try {
            await Promise.all(loadPromises);
            this.currentSprite = 'pikachu_gen1'; // Default sprite
            console.log('All sprites loaded successfully');
            return true;
        } catch (error) {
            console.error('Error loading sprites:', error);
            return false;
        }
    }
    
    setVisualizationStyle(style) {
        this.visualizationStyle = style;
    }
    
    setColorScheme(scheme) {
        if (this.colors[scheme]) {
            this.colorScheme = scheme;
        }
    }
    
    setCurrentSprite(spriteName) {
        if (this.sprites[spriteName]) {
            this.currentSprite = spriteName;
        }
    }
    
    toggleGlitch() {
        this.isGlitching = !this.isGlitching;
    }
    
    // Draw methods for different visualization styles
    
    drawWaveform(audioData) {
        const ctx = this.ctx;
        const colors = this.colors[this.colorScheme];
        const sliceWidth = this.width / audioData.length;
        
        ctx.fillStyle = colors.background;
        ctx.fillRect(0, 0, this.width, this.height);
        
        ctx.lineWidth = 2;
        ctx.strokeStyle = colors.primary;
        ctx.beginPath();
        
        for (let i = 0; i < audioData.length; i++) {
            const value = audioData[i] / 255.0;
            const y = (this.height / 2) * (1 - value);
            const x = sliceWidth * i;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.lineTo(this.width, this.height / 2);
        ctx.stroke();
        
        // Add a mirrored waveform for aesthetic
        ctx.strokeStyle = colors.tertiary;
        ctx.beginPath();
        
        for (let i = 0; i < audioData.length; i++) {
            const value = audioData[i] / 255.0;
            const y = (this.height / 2) * (1 + value);
            const x = sliceWidth * i;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.lineTo(this.width, this.height / 2);
        ctx.stroke();
    }
    
    drawFrequencyBars(audioData) {
        const ctx = this.ctx;
        const colors = this.colors[this.colorScheme];
        const barWidth = this.width / audioData.length;
        
        ctx.fillStyle = colors.background;
        ctx.fillRect(0, 0, this.width, this.height);
        
        for (let i = 0; i < audioData.length; i++) {
            const value = audioData[i] / 255.0;
            const barHeight = value * this.height;
            const x = barWidth * i;
            const y = this.height - barHeight;
            
            // Create gradient for each bar
            const gradient = ctx.createLinearGradient(x, y, x, this.height);
            gradient.addColorStop(0, colors.accent);
            gradient.addColorStop(0.5, colors.primary);
            gradient.addColorStop(1, colors.secondary);
            
            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, barWidth - 1, barHeight);
        }
    }
    
    drawSpriteDance(audioData, bassLevel, midLevel, highLevel) {
        const ctx = this.ctx;
        const colors = this.colors[this.colorScheme];
        const sprite = this.sprites[this.currentSprite];
        
        if (!sprite) return;
        
        ctx.fillStyle = colors.background;
        ctx.fillRect(0, 0, this.width, this.height);
        
        // Calculate sprite position and size based on audio levels
        const avgLevel = (bassLevel + midLevel + highLevel) / 3;
        const scale = 1 + (avgLevel / 255) * 0.3; // Scale between 1x and 1.3x
        
        const spriteWidth = sprite.width * scale;
        const spriteHeight = sprite.height * scale;
        const x = (this.width - spriteWidth) / 2;
        const y = (this.height - spriteHeight) / 2;
        
        // Apply rotation based on mid frequencies
        const rotation = (midLevel / 255) * 0.2 - 0.1; // Rotate between -0.1 and 0.1 radians
        
        // Save context state
        ctx.save();
        
        // Translate to center of sprite for rotation
        ctx.translate(this.width / 2, this.height / 2);
        ctx.rotate(rotation);
        
        // Draw sprite
        ctx.drawImage(
            sprite,
            -spriteWidth / 2,
            -spriteHeight / 2,
            spriteWidth,
            spriteHeight
        );
        
        // Restore context state
        ctx.restore();
        
        // Draw background effects based on bass
        const circleRadius = (bassLevel / 255) * 50;
        ctx.beginPath();
        ctx.arc(this.width / 2, this.height / 2, circleRadius, 0, Math.PI * 2);
        ctx.strokeStyle = colors.tertiary;
        ctx.lineWidth = 2;
        ctx.stroke();
    }
    
    drawPixelStorm(audioData, bassLevel, midLevel, highLevel) {
        const ctx = this.ctx;
        const colors = this.colors[this.colorScheme];
        
        ctx.fillStyle = colors.background;
        ctx.fillRect(0, 0, this.width, this.height);
        
        // Create new particles based on audio levels
        const particleCount = Math.floor(bassLevel / 10);
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * 4 + 2,
                speedX: (Math.random() - 0.5) * 2,
                speedY: (Math.random() - 0.5) * 2,
                color: [colors.primary, colors.secondary, colors.tertiary, colors.accent][Math.floor(Math.random() * 4)]
            });
        }
        
        // Update and draw particles
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            
            // Update position
            p.x += p.speedX;
            p.y += p.speedY;
            
            // Remove particles that are off-screen
            if (p.x < 0 || p.x > this.width || p.y < 0 || p.y > this.height) {
                this.particles.splice(i, 1);
                i--;
                continue;
            }
            
            // Draw particle
            ctx.fillStyle = p.color;
            ctx.fillRect(
                Math.floor(p.x / this.pixelSize) * this.pixelSize,
                Math.floor(p.y / this.pixelSize) * this.pixelSize,
                this.pixelSize,
                this.pixelSize
            );
        }
        
        // Limit number of particles for performance
        if (this.particles.length > 200) {
            this.particles = this.particles.slice(-200);
        }
    }
    
    drawGlitchMode(audioData, bassLevel, midLevel, highLevel) {
        const ctx = this.ctx;
        const colors = this.colors[this.colorScheme];
        
        // Start with a basic visualization
        this.drawWaveform(audioData);
        
        // Apply glitch effects based on audio levels
        const glitchIntensity = highLevel / 255;
        
        // Horizontal glitch lines
        const lineCount = Math.floor(glitchIntensity * 10);
        for (let i = 0; i < lineCount; i++) {
            const y = Math.floor(Math.random() * this.height);
            const width = Math.floor(Math.random() * 50) + 20;
            const x = Math.floor(Math.random() * (this.width - width));
            
            ctx.fillStyle = colors.accent;
            ctx.fillRect(x, y, width, 2);
        }
        
        // Color shift effect
        if (glitchIntensity > 0.5) {
            ctx.globalCompositeOperation = 'screen';
            ctx.fillStyle = `rgba(255, 0, 255, ${glitchIntensity * 0.3})`;
            ctx.fillRect(0, 0, this.width, this.height);
            ctx.globalCompositeOperation = 'source-over';
        }
        
        // Random blocks
        const blockCount = Math.floor(glitchIntensity * 5);
        for (let i = 0; i < blockCount; i++) {
            const size = Math.floor(Math.random() * 20) + 10;
            const x = Math.floor(Math.random() * (this.width - size));
            const y = Math.floor(Math.random() * (this.height - size));
            
            // Copy from one part of the canvas to another
            const sourceX = Math.floor(Math.random() * (this.width - size));
            const sourceY = Math.floor(Math.random() * (this.height - size));
            
            ctx.drawImage(
                this.canvas,
                sourceX, sourceY, size, size,
                x, y, size, size
            );
        }
    }
    
    // Main render method
    render(audioData, bassLevel, midLevel, highLevel) {
        if (!audioData) return;
        
        // Apply visualization based on selected style
        switch (this.visualizationStyle) {
            case 'waveform':
                this.drawWaveform(audioData);
                break;
            case 'frequencyBars':
                this.drawFrequencyBars(audioData);
                break;
            case 'spriteDance':
                this.drawSpriteDance(audioData, bassLevel, midLevel, highLevel);
                break;
            case 'pixelStorm':
                this.drawPixelStorm(audioData, bassLevel, midLevel, highLevel);
                break;
            case 'glitchMode':
                this.drawGlitchMode(audioData, bassLevel, midLevel, highLevel);
                break;
            default:
                this.drawWaveform(audioData);
        }
        
        // Add scan line effect
        this.drawScanLine();
        
        // Apply glitch effect if enabled
        if (this.isGlitching) {
            this.applyGlitchEffect();
        }
    }
    
    drawScanLine() {
        const ctx = this.ctx;
        
        // Draw a subtle scan line
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(0, this.scanLinePos, this.width, 2);
        
        // Update scan line position
        this.scanLinePos += 2;
        if (this.scanLinePos >= this.height) {
            this.scanLinePos = 0;
        }
    }
    
    applyGlitchEffect() {
        const ctx = this.ctx;
        const imageData = ctx.getImageData(0, 0, this.width, this.height);
        const data = imageData.data;
        
        // Apply random shifts to color channels
        for (let i = 0; i < data.length; i += 4) {
            if (Math.random() < 0.01) {
                const offset = Math.floor(Math.random() * 30) * 4;
                if (i + offset < data.length) {
                    data[i] = data[i + offset];
                }
            }
        }
        
        ctx.putImageData(imageData, 0, 0);
    }
}

// Export the visualizer
const visualizer = new Visualizer('visualizer-canvas');
