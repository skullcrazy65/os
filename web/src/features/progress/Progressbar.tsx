import React from 'react';
import { Box, createStyles, Text, keyframes } from '@mantine/core';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import ScaleFade from '../../transitions/ScaleFade';
import type { ProgressbarProps } from '../../typings';

const progressAnimation = keyframes({
  '0%': { width: '0%' },
  '100%': { width: '100%' }
});

const shimmerAnimation = keyframes({
  '0%': { transform: 'translateX(-100%)' },
  '100%': { transform: 'translateX(100%)' }
});

const useStyles = createStyles((theme) => ({
  container: {
    width: 420,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#1a2332', // secondary-bg
    overflow: 'hidden',
    border: '2px solid #243447', // accent-bg border
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(12px)',
    position: 'relative',
  },
  wrapper: {
    width: '100%',
    height: '20%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 0,
    position: 'absolute',
  },
  bar: {
    height: '100%',
    background: 'linear-gradient(135deg, #10b981 0%, #34d399 50%, #10b981 100%)',
    borderRadius: 16,
    position: 'relative',
    boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.2), 0 0 20px rgba(16, 185, 129, 0.3)',
    
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
      animation: `${shimmerAnimation} 2s infinite`,
      borderRadius: 16,
    },
    
    '&::after': {
      content: '""',
      position: 'absolute',
      top: '2px',
      left: '2px',
      right: '2px',
      height: '40%',
      background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 100%)',
      borderRadius: '14px 14px 0 0',
    }
  },
  labelWrapper: {
    position: 'absolute',
    display: 'flex',
    width: 420,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  label: {
    maxWidth: 400,
    padding: 16,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    fontSize: 16,
    fontWeight: 600,
    color: '#ffffff', // primary-text
    textShadow: '0 2px 8px rgba(0, 0, 0, 0.8), 0 0 20px rgba(16, 185, 129, 0.3)',
    fontFamily: 'Inter, sans-serif',
    letterSpacing: '0.5px',
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 50%, rgba(52, 211, 153, 0.1) 0%, transparent 50%),
      linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.02) 50%, transparent 100%)
    `,
    borderRadius: 16,
  }
}));

const Progressbar: React.FC = () => {
  const { classes } = useStyles();
  const [visible, setVisible] = React.useState(false);
  const [label, setLabel] = React.useState('');
  const [duration, setDuration] = React.useState(0);

  useNuiEvent('progressCancel', () => setVisible(false));

  useNuiEvent<ProgressbarProps>('progress', (data) => {
    setVisible(true);
    setLabel(data.label);
    setDuration(data.duration);
  });

  return (
    <>
      <Box className={classes.wrapper}>
        <ScaleFade visible={visible} onExitComplete={() => fetchNui('progressComplete')}>
          <Box className={classes.container}>
            <Box className={classes.backgroundPattern} />
            <Box
              className={classes.bar}
              onAnimationEnd={() => setVisible(false)}
              sx={{
                animation: `${progressAnimation} linear`,
                animationDuration: `${duration}ms`,
              }}
            />
            <Box className={classes.labelWrapper}>
              <Text className={classes.label}>{label}</Text>
            </Box>
          </Box>
        </ScaleFade>
      </Box>
    </>
  );
};

export default Progressbar;