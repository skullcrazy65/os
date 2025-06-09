import { MantineThemeOverride } from '@mantine/core';

export const theme: MantineThemeOverride = {
  colorScheme: 'dark',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
  fontFamilyMonospace: 'JetBrains Mono, Fira Code, Monaco, Consolas, monospace',
  
  colors: {
    // Server color scheme
    primary: ['#34d399', '#10b981', '#059669', '#047857', '#065f46', '#064e3b', '#022c22', '#021c15', '#01120b', '#000a05'],
    dark: [
      '#ffffff',    // primary-text
      '#94a3b8',    // secondary-text  
      '#64748b',    // muted-text
      '#2d4159',    // hover-bg
      '#243447',    // accent-bg
      '#1a2332',    // secondary-bg
      '#0f1419',    // primary-bg
      '#0a0f14',    // darker
      '#050a0f',    // darkest
      '#000000'     // black
    ],
    success: ['#34d399', '#10b981', '#059669', '#047857', '#065f46', '#064e3b', '#022c22', '#021c15', '#01120b', '#000a05'],
    warning: ['#fbbf24', '#f59e0b', '#d97706', '#b45309', '#92400e', '#78350f', '#451a03', '#1c0701', '#0c0300', '#000000'],
    error: ['#f87171', '#ef4444', '#dc2626', '#b91c1c', '#991b1b', '#7f1d1d', '#450a0a', '#1c0404', '#0c0202', '#000000']
  },

  primaryColor: 'success',
  primaryShade: { light: 1, dark: 1 },

  shadows: { 
    sm: '0 2px 8px rgba(0, 0, 0, 0.3)',
    md: '0 4px 16px rgba(0, 0, 0, 0.4)',
    lg: '0 8px 32px rgba(0, 0, 0, 0.5)'
  },

  radius: {
    xs: '4px',
    sm: '8px', 
    md: '12px',
    lg: '16px',
    xl: '24px'
  },

  spacing: {
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '24px',
    xl: '32px'
  },

  components: {
    Button: {
      styles: (theme) => ({
        root: {
          border: 'none',
          fontWeight: 500,
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: theme.shadows.md,
          }
        },
      }),
    },
    Modal: {
      styles: (theme) => ({
        modal: {
          backgroundColor: theme.colors.dark[5],
          border: `1px solid ${theme.colors.dark[4]}`,
        },
        header: {
          backgroundColor: theme.colors.dark[5],
          borderBottom: `1px solid ${theme.colors.dark[4]}`,
        },
        title: {
          color: theme.colors.dark[0],
          fontWeight: 600,
        }
      }),
    },
    Progress: {
      styles: (theme) => ({
        root: {
          backgroundColor: theme.colors.dark[5],
          borderRadius: theme.radius.sm,
          overflow: 'hidden',
        },
        bar: {
          transition: 'width 0.3s ease',
        }
      }),
    }
  },
};