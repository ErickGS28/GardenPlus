/**
 * Garden Plus Color Theme Constants
 */

export const COLORS = {
  teal: '#1b676b',
  green: '#519548',
  lime: '#88c425',
  chartreuse: '#bef202',
  mint: '#eafde6'
};

export const THEME = {
  primary: COLORS.teal,
  secondary: COLORS.green,
  accent: COLORS.lime,
  highlight: COLORS.chartreuse,
  background: COLORS.mint,
  
  // Text colors
  textDark: COLORS.teal,
  textLight: COLORS.mint,
  
  // Gradients
  gradientPrimary: `linear-gradient(to right, ${COLORS.teal}, ${COLORS.green})`,
  gradientSecondary: `linear-gradient(to right, ${COLORS.lime}, ${COLORS.chartreuse})`,
};

export default THEME;
