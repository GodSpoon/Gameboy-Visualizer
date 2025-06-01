# GameBoy Audio Visualizer Interface Design

## Device Specifications
- **Height**: 5.8" (148 mm)
- **Width**: 3.5" (90 mm)
- **Depth**: 1.3" (32 mm)
- **Display Size**: 2.6" (66 mm)
- **Resolution**: 160 x 144 px
- **Controls**: D-pad, A/B buttons, START/SELECT buttons

## Interface Layout

### Main Frame
- Full-screen GameBoy-inspired frame
- Vaporwave color palette instead of original gray
- Gradient background transitioning between pink/purple/cyan

### Screen Area
- Central display area (160x144 px ratio)
- Main visualization area for audio response
- Pixelated effects with vaporwave colors

### Controls
- D-pad on left side (for navigation)
- A/B buttons on right side (for selection/back)
- START/SELECT buttons in center bottom (for menu/options)
- All buttons styled with vaporwave colors but maintaining GameBoy layout

## Menu System
- GameBoy-style pixel font
- Options accessible via D-pad navigation
- Main menu appears when START is pressed
- Options include:
  1. Visualization Style
  2. Color Palette
  3. Sprite Selection
  4. Audio Source (Mic/System)
  5. Settings

## Visualization Styles
1. **Wave Form**: Classic audio wave visualization
2. **Frequency Bars**: Vertical bars showing frequency response
3. **Sprite Dance**: Selected Pokémon sprite reacts to audio
4. **Pixel Storm**: Particles that respond to audio intensity
5. **Glitch Mode**: Distortion effects based on audio

## Sprite Integration
- Pokémon sprites (Pikachu, Bulbasaur, etc.) as visualization elements
- Sprites can be selected from menu
- Sprites animate/transform based on audio input
- Option to use multiple sprites or single focal sprite

## Color Schemes
1. **Classic Vaporwave**: Pink, purple, cyan, blue
2. **Neo Vaporwave**: More neon with yellow accents
3. **GameBoy Green**: Nostalgic 4-shade green palette
4. **Synthwave**: Purple, blue, and red with grid elements
5. **Custom**: User-defined color combinations

## Responsive Elements
- Audio intensity affects color saturation
- Bass frequencies trigger sprite animations
- Mid frequencies affect background elements
- High frequencies create particle/glitch effects
- Volume level controls overall animation speed

## Technical Implementation Notes
- Canvas-based rendering for pixel-perfect display
- Web Audio API for audio input processing
- Responsive design to maintain aspect ratio on all screens
- Fullscreen toggle option
- Performance optimization for smooth animations
