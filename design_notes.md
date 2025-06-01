# GameBoy Audio Visualizer Design Notes

## GameBoy Aesthetic

### Technical Specifications
- **Screen Resolution**: 160×144 pixels
- **Original GameBoy Colors**: 4 shades of green/gray (white, light gray, dark gray, black)
- **GameBoy Color**: Full color screen, backward compatible with original GameBoy
- **Tile Size**: 8x8 pixels (some games used 16x16 tiles)
- **Background Layer**: 256x256 pixel (32x32 tiles) map

### Physical Design Elements
- Classic gray body with dark gray buttons
- D-pad on left side
- A and B buttons on right side
- START and SELECT buttons in the center bottom
- Green-tinted screen (original GameBoy)
- Nintendo GAME BOY logo at the bottom of the screen

## Vaporwave Aesthetic

### Key Visual Elements
- Pastel colors, especially pink, purple, and teal/cyan
- Geometric shapes and patterns
- Glitchy effects and distortions
- Retro-futuristic feel
- 80s and 90s nostalgia elements
- Digital artifacts and scan lines

### Color Palette
- Soft pinks (#FF6AD5, #C774E8)
- Purples (#AD8CFF, #8795E8)
- Blues/Cyans (#94D0FF, #00FFFF)
- Yellows (#FFFF8F)
- Neon accents

## Integration Approach

### Visual Style Fusion
- Use GameBoy physical layout and button arrangement
- Implement pixelated graphics at GameBoy resolution (160x144)
- Apply vaporwave color palette instead of original GameBoy greens
- Add glitch effects and scan lines for vaporwave feel
- Maintain pixelated aesthetic throughout

### Interface Elements
- GameBoy-style frame with vaporwave colors
- Menu system using GameBoy button layout
- Pixelated text in vaporwave colors
- 90s game sprites (especially Pokémon) as visual elements and visualizer seeds

### Audio Visualization
- Respond to microphone or system audio input
- Create pixelated waveforms or frequency visualizations
- Apply vaporwave color transitions based on audio intensity
- Incorporate sprite animations triggered by audio patterns
- Allow different visualization modes selectable through GameBoy buttons
