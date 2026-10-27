# Last Caretaker Map

An interactive map application built with Leaflet.js and Vite that displays locations from `data.json`.

Based on the game ["The Last Caretaker"](https://thelastcaretaker.com/) by [Channel 37](https://www.channel37.co/). This map is not affiliated with Channel 37, and just made by a loving fan.

For your viewing pleasure: https://the1killer.github.io/LastCaretakerMap/

<img width="529" height="326" alt="tlc-map" src="https://github.com/user-attachments/assets/3c27b5f5-8a32-4344-9140-ac96625547b5" />


## Features

- 🗺️ Interactive map with Icons from the game.
- 📋 Sidebar with location list
- 🔍 Click locations to zoom and view details
- 🧪 Samples browser with capture tracking for all 143 samples & cave paintings
- 📱 Responsive design for mobile and desktop
- ⚡ Fast development with Vite and HMR

### Future plans/hopes

- 🎨 Add custom markers
- 🔍 Add search functionality
- 📋 Enhance location details
- 🗝️ Add hidden locations

## Acknowledgements

The samples & cave painting locations are based on the community-made
["Complete Samples List, Holograms, Cave Paintings"](https://steamcommunity.com/app/1783560/discussions/0/581683203528667623/)
by [SoulKilla](https://steamcommunity.com/id/SoulKilla/) on the game's Steam discussion board.

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

### Running the Application

1. **Development mode (with hot reload):**
   ```bash
   npm run dev
   ```
   The app will automatically open at `http://localhost:3000`

2. **Build for production:**
   ```bash
   npm run build
   ```

3. **Preview production build:**
   ```bash
   npm run preview
   ```

## Project Structure

```
lastcaretakermap/
├── index.html         # Main HTML file
├── main.js            # JavaScript entry point with Leaflet integration
├── styles.css         # Styling and layout
├── data.json          # Location data
├── package.json       # npm dependencies and scripts
├── vite.config.js     # Vite configuration
├── .gitignore         # Git ignore rules
└── README.md          # This file
```

## Data Format

The application reads location data from `data.json`. Each location should have:

```json
{
  "name": "Location Name",
  "id": "unique-id",
  "description": "Location description",
  "latitude": 0.0,
  "longitude": 0.0,
  "image": "optional-image.png"
}
```

## Customization

- **Map Style**: Change the tile layer in `main.js` to use different map styles
- **Marker Icons**: Modify the `customIcon` configuration in `main.js`
- **Colors**: Update the gradient colors in `styles.css`
- **Initial View**: Adjust the `setView()` parameters in `main.js`

## Technologies Used

- [Vite](https://vitejs.dev/) - Fast build tool and dev server
- [Leaflet.js](https://leafletjs.com/) - Interactive map library
- [OpenStreetMap](https://www.openstreetmap.org/) - Map tiles
- Vanilla JavaScript (ES6 modules)
- CSS Grid - Modern layout system

## License

This project is BSD-2 licensed and available for personal use.
