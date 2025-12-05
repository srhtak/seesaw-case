# Seesaw Simulation

A visual seesaw simulation built with pure JavaScript, HTML, and CSS.

## 🎯 Features

- **Click to Drop Weights**: Click anywhere in the drop zone to add random weights (1-10 kg)
- **Real Physics**: Torque-based angle calculation with ±30° limit
- **Smooth Animations**: Falling weights with realistic drop animation
- **Dynamic Sizing**: Weight size scales based on kg value
- **Mouse Preview**: Preview weight follows cursor with projection line (desktop only)
- **Position Tracking**: Real-time position display while hovering
- **Undo Support**: Remove last added weight
- **Reset Button**: Clear all weights
- **Weight Log**: Track all added weights with position info
- **LocalStorage**: State persists after page refresh
- **Responsive Design**: Works on desktop, tablet, and mobile

## 🛠️ Tech Stack

- Pure JavaScript (No frameworks)
- HTML5
- CSS3 (Animations, Flexbox, Media Queries)

## 📱 Responsive

| Screen | Features |
|--------|----------|
| Desktop | Mouse preview, projection line |
| Mobile | Touch support, tick labels visible |

## 🚀 Live Demo

[https://srhtak.github.io/seesaw-case/](https://srhtak.github.io/seesaw-case/)

## 📂 Project Structure

```
├── index.html      # Main HTML structure
├── style.css       # All styles and animations
├── script.js       # Game logic and interactions
└── .github/
    └── workflows/
        └── deploy.yml  # GitHub Actions deployment
```

## 🎮 How to Use

1. Hover over the drop zone (blue dashed area)
2. Click to drop a weight
3. Watch the seesaw tilt based on torque
4. Use **Undo** to remove last weight
5. Use **Reset** to clear all

## 📐 Physics Formula

```
Torque = Weight × Distance from center
Angle = (RightTorque - LeftTorque) / 10
Angle capped at ±30°
```

## 👤 Author

Serhat Ak
