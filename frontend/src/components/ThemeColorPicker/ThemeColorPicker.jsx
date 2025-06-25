import React, { useState, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import "./ThemeColorPicker.css";

function ThemeColorPicker() {
  // Default green theme color
  const defaultColor = "#00a65a";
  
  // Get the theme color from localStorage or use default
  const [color, setColor] = useState(() => {
    const savedColor = localStorage.getItem("theme-color");
    return savedColor || defaultColor;
  });
  
  // Track if the color picker is open
  const [isOpen, setIsOpen] = useState(false);
  
  // Update CSS variables when color changes
  useEffect(() => {
    // Get color luminance to determine if text should be dark or light
    const luminance = getLuminance(color);
    const textColor = luminance > 0.5 ? "#000000" : "#ffffff";
    
    // Calculate darker shade for hover states
    const darkerColor = adjustBrightness(color, -20);
    
    // Calculate lighter shade for accent color
    const lighterColor = adjustBrightness(color, 20);
    
    // Update CSS variables
    document.documentElement.style.setProperty("--primary-color", color);
    document.documentElement.style.setProperty("--primary-dark", darkerColor);
    document.documentElement.style.setProperty("--primary-light", lighterColor);
    document.documentElement.style.setProperty("--text-on-primary", textColor);
    
    // Save to localStorage
    localStorage.setItem("theme-color", color);
  }, [color]);
  
  // Calculate relative luminance using the sRGB formula
  function getLuminance(hexColor) {
    const r = parseInt(hexColor.substring(1, 3), 16) / 255;
    const g = parseInt(hexColor.substring(3, 5), 16) / 255;
    const b = parseInt(hexColor.substring(5, 7), 16) / 255;
    
    const R = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
    const G = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
    const B = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
    
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
  }
  
  // Adjust color brightness
  function adjustBrightness(hexColor, percent) {
    const r = parseInt(hexColor.substring(1, 3), 16);
    const g = parseInt(hexColor.substring(3, 5), 16);
    const b = parseInt(hexColor.substring(5, 7), 16);
    
    const adjustedR = Math.max(0, Math.min(255, r + percent));
    const adjustedG = Math.max(0, Math.min(255, g + percent));
    const adjustedB = Math.max(0, Math.min(255, b + percent));
    
    return `#${adjustedR.toString(16).padStart(2, '0')}${adjustedG.toString(16).padStart(2, '0')}${adjustedB.toString(16).padStart(2, '0')}`;
  }
  
  // Reset to default color
  const resetToDefault = () => {
    setColor(defaultColor);
  };
  
  return (
    <div className="theme-color-picker">
      <button 
        className="theme-color-button" 
        onClick={() => setIsOpen(!isOpen)}
        style={{ backgroundColor: color }}
        title="Customize theme color"
      >
        <i className="ion-paintbrush"></i>
      </button>
      
      {isOpen && (
        <div className="color-picker-popover">
          <HexColorPicker color={color} onChange={setColor} />
          <div className="color-picker-actions">
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="color-code-input"
            />
            <button onClick={resetToDefault} className="reset-button">
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ThemeColorPicker;