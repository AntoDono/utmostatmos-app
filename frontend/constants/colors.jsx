// Base colors
const BASE = {
    WHITE: '#fff',
    BLACK: '#000',
    LIGHTGREEN: '#6D9773',
    DARKGREEN: '#0C3B2E',
    BROWN: '#B46617',
    YELLOW: '#FABB00',
    GREY: '#808080',
    LIGHTERGREY: '#F5F5F5',
};

// Semantic color palette
const colors = {
    // Base colors (for backward compatibility)
    ...BASE,

    // Primary - Main brand color (green theme)
    primary: BASE.LIGHTGREEN,
    primaryDark: BASE.DARKGREEN,
    primaryLight: '#8FB996',
    primaryMuted: '#E8F0E9',

    // Secondary - Accent color
    secondary: BASE.BROWN,
    secondaryLight: '#D4924D',

    // Accent - Highlight color
    accent: BASE.YELLOW,
    accentLight: '#FFCE4A',

    // Neutral - Grays and backgrounds
    background: '#F5F7F5',
    backgroundDark: '#E8ECE8',
    surface: BASE.WHITE,
    surfaceElevated: '#FAFCFA',

    // Text colors
    text: '#1A1A1A',
    textSecondary: '#4A5568',
    textMuted: '#718096',
    textLight: '#A0AEC0',
    textOnPrimary: BASE.WHITE,
    textOnDark: BASE.WHITE,

    // Status colors
    success: '#4CAF50',
    successLight: '#E8F5E9',
    error: '#E53E3E',
    errorLight: '#FED7D7',
    warning: BASE.YELLOW,
    warningLight: '#FEFCBF',
    info: '#3182CE',
    infoLight: '#BEE3F8',

    // Border colors
    border: '#E2E8E0',
    borderDark: '#CBD5C8',
    borderFocus: BASE.LIGHTGREEN,

    // Shadow color
    shadow: '#000',

    // Specific UI elements
    cardBackground: BASE.WHITE,
    cardBorder: '#E2E8E0',
    inputBackground: '#F7FAF7',
    inputBorder: '#CBD5C8',
    buttonDisabled: '#A0AEC0',
    overlay: 'rgba(0, 0, 0, 0.5)',

    // Tab bar
    tabActive: BASE.LIGHTGREEN,
    tabInactive: BASE.GREY,
};

export default colors;