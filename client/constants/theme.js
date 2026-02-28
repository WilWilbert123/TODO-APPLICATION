export const getTheme = (isDarkMode) => ({
  background: isDarkMode ? '#0A0A0A' : '#F5F7FA',
  surface: isDarkMode ? '#1A1A1A' : '#FFFFFF',
  text: isDarkMode ? '#FFFFFF' : '#1A1A1A',
  subText: isDarkMode ? '#777' : '#64748B',
  border: isDarkMode ? '#222' : '#E2E8F0',
  card: isDarkMode ? '#1A1A1A' : '#FFFFFF',
  accent: '#2a9d7a',
  danger: '#FF5252',
});

export const getPriorityStyle = (p, isDarkMode, theme) => {
  switch (p) {
    case 'High': return { color: '#FF5252', bg: isDarkMode ? '#331a1a' : '#FEE2E2' };
    case 'Medium': return { color: '#FFC107', bg: isDarkMode ? '#332b1a' : '#FEF3C7' };
    case 'Low': return { color: '#4CAF50', bg: isDarkMode ? '#1a331c' : '#DCFCE7' };
    default: return { color: theme.text, bg: theme.border };
  }
};