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
    border: '1px solid #243447', // accent-bg border
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
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
    background: 'linear-gradient(90deg, #10b981, #34d399)',
    borderRadius: 16,
    position: 'relative',
    boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)',
    
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
      animation: `${shimmerAnimation} 2s infinite`,
      borderRadius: 16,
    }
  },
  labelWrapper: {
    position: 'absolute',
    display: 'flex',
    width: 420,
    height: 64,
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 2,
    padding: '0 20px',
  },
  label: {
    maxWidth: 300,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    fontSize: 16,
    fontWeight: 600,
    color: '#ffffff', // primary-text
    textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
    fontFamily: 'Inter, sans-serif',
  },
  percentage: {
    fontSize: 16,
    fontWeight: 700,
    color: '#ffffff',
    textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
    fontFamily: 'Inter, sans-serif',
    minWidth: '50px',
    textAlign: 'right',
  },
  progressDots: {
    position: 'absolute',
    bottom: 8,
    left: 20,
    display: 'flex',
    gap: 4,
    zIndex: 3,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    transition: 'all 0.3s ease',
  },
  activeDot: {
    backgroundColor: '#10b981',
    boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)',
  }
}));

const Progressbar: React.FC = () => {
  const { classes } = useStyles();
  const [visible, setVisible] = React.useState(false);
  const [label, setLabel] = React.useState('');
  const [duration, setDuration] = React.useState(0);
  const [progress, setProgress] = React.useState(0);

  useNuiEvent('progressCancel', () => setVisible(false));

  useNuiEvent<ProgressbarProps>('progress', (data) => {
    setVisible(true);
    setLabel(data.label);
    setDuration(data.duration);
    setProgress(0);
    
    // Animate progress percentage
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (data.duration / 100));
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, 100);
  });

  const renderDots = () => {
    const dots = [];
    for (let i = 0; i < 8; i++) {
      const isActive = (progress / 100) * 8 > i;
      dots.push(
        <div 
          key={i} 
          className={`${classes.dot} ${isActive ? classes.activeDot : ''}`}
        />
      );
    }
    return dots;
  };

  return (
    <>
      <Box className={classes.wrapper}>
        <ScaleFade visible={visible} onExitComplete={() => fetchNui('progressComplete')}>
          <Box className={classes.container}>
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
              <Text className={classes.percentage}>{Math.round(progress)}%</Text>
            </Box>
            <Box className={classes.progressDots}>
              {renderDots()}
            </Box>
          </Box>
        </ScaleFade>
      </Box>
    </>
  );
};

export default Progressbar;