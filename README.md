# Skip Size Selector - Frontend Redesign

## Overview

This project presents a modern and responsive redesign of the **"Choose Your Skip Size"** page for [wewantwaste.co.uk](https://wewantwaste.co.uk). The goal was to enhance the user experience (UX), visual clarity, and code maintainability, while preserving the original functionality and integrating dynamic data from a provided API endpoint.

## Objectives

- Modernize the UI with a clean, accessible, and responsive design.
- Improve UX by highlighting important information such as road access, popularity, and value.
- Use semantic HTML and scalable, maintainable CSS and React components.
- Ensure a fluid selection experience across devices.

---

## Approach

### 🔧 Tech Stack

- **React** (with functional components)
- **CSS3** (custom styling, no external frameworks)
- **REST API** integration
- **ESLint + Prettier** for code quality and formatting

---

## 🧠 Design & UX Principles

### 1. **Grid Layout**
A responsive grid system adapts to screen size using `auto-fit` and `minmax`. Cards stack vertically on small screens and align neatly in rows on desktops.

### 2. **Card Highlights**
Each skip is represented as a **Card** with the following dynamic styles:

- ✅ **Road Access**  
  - Green border for allowed  
  - Red dashed border for denied
- ⭐ **Popular / Value Badges**  
  - Animated pulse effect to catch the user's eye
- 🟪 **Heavy Waste**  
  - Visual distinction with violet shades and a dedicated badge

### 3. **Selection Feedback**
Selected cards receive subtle scaling, glowing shadows, and color changes to provide immediate feedback without being intrusive.

```css
.card.selected {
  transform: scale(1.02);
  background-color: #e0f2f1;
  box-shadow: 0 6px 20px rgba(0, 121, 107, 0.35);
}
