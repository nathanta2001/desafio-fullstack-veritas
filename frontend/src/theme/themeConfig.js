import { theme } from 'antd';

export const darkThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: '#007aff',       // Azul vibrante 
    colorSuccess: '#10b981',       // Verde mint 
    colorBgBase: '#18181b',        // Background 
    colorBgContainer: '#27272a',   // Cards e Containers
    colorBgElevated: '#3f3f46',    // Modais e Popups
    borderRadius: 12,              // Cantos arredondados do design
    fontFamily: "'Inter', sans-serif",
  },
  components: {
    Card: {
      colorBgContainer: '#27272a',
      borderRadiusLG: 16,
    },
    Button: {
      borderRadius: 10,
      fontWeight: 600,
    },
    Tag: {
      borderRadius: 20,            // Tag em formato de pílula
    },
  },
};