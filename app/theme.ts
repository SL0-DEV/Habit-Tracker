// theme.ts
// Easy theme configuration - change colors here without touching page.tsx

export const theme = {
  // Light Mode Colors (positive energy colors)
  light: {
    // Primary color - main interactive elements (warm orange)
    primary: "#FF6B35",        // Energetic Orange
    
    // Secondary color - accents and highlights (success green)
    secondary: "#22C55E",      // Fresh Green
    
    // Accent color - special elements like streak (sunny yellow)
    accent: "#FFC107",         // Sunshine Yellow
    
    // Background colors
    background: "#FFFFFF",     // Pure white
    surface: "#FFFFFF",        // Pure white
    
    // Text colors
    textPrimary: "#000000",    // Pure black
    textSecondary: "#4B5563",  // Dark gray
    textMuted: "#6B7280",      // Medium gray
    
    // Border colors
    border: "#E5E7EB",         // Light gray border
    borderHover: "#FF6B35",    // Primary color on hover
  },
  
  // Dark Mode Colors (positive energy colors)
  dark: {
    // Primary color - main interactive elements (warm orange)
    primary: "#FF7A50",        // Lighter energetic orange for dark mode
    
    // Secondary color - accents and highlights (success green)
    secondary: "#34D399",      // Fresh green for dark mode
    
    // Accent color - special elements like streak (golden yellow)
    accent: "#FFD700",         // Golden yellow for dark mode
    
    // Background colors
    background: "#000000",     // Pure black
    surface: "#1F1F1F",        // Dark gray
    
    // Text colors
    textPrimary: "#FFFFFF",    // Pure white
    textSecondary: "#D1D5DB",  // Light gray
    textMuted: "#9CA3AF",      // Medium gray
    
    // Border colors
    border: "#374151",         // Dark gray border
    borderHover: "#FF7A50",    // Primary color on hover
  }
};

// Usage helper function
export const getThemeColor = (colorKey: string, isDark: boolean) => {
  const mode = isDark ? theme.dark : theme.light;
  return mode[colorKey as keyof typeof mode] || mode.primary;
};