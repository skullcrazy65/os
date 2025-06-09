import React from 'react';
import { Box, createStyles, Text } from '@mantine/core';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import ScaleFade from '../../transitions/ScaleFade';
import type { ProgressbarProps } from '../../typings';

const useStyles = createStyles((theme) => ({
  container: {
    width: 460,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#1a2332', // secondary-bg - tamna pozadina kao na slici
    overflow: 'hidden',
    position: 'relative',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
    border: '1px solid #243447',
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
    backgroundColor: '#10b981', // zelena boja
    transition: 'width 0.1s linear',
    borderRadius: '8px 0 0 8px',
  },
  labelWrapper: {
    position: 'absolute',
    display: 'flex',
    width: 460,
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 2,
    padding: '0 24px',
  },
  label: {
    maxWidth: 320,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    fontSize: 16,
    fontWeight: 500,
    color: '#ffffff',
    fontFamily: 'Inter, sans-serif',
  },
  percentage: {
    fontSize: 16,
    fontWeight: 600,
    color: '#ffffff',
    fontFamily: 'Inter, sans-serif',
    minWidth: '50px',
    textAlign: 'right',
  },
  progressDots: {
    position: 'absolute',
    bottom: 12,
    left: 24,
    display: 'flex',
    gap: 8,
    zIndex: 3,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    transition: 'all 0.2s ease',
  },
  activeDot: {
    backgroundColor: '#10b981',
    boxShadow: '0 0 8px rgba(16, 185, 129, 0.5)',
  },
  progressContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 0,
  }
}));

const Progressbar: React.FC = () => {
  const { classes } = useStyles();
  const [visible, setVisible] = React.useState(false);
  const [label, setLabel] = React.useState('');
  const [duration, setDuration] = React.useState(0);
  const [progress, setProgress] = React.useState(0);

  useNuiEvent('progressCancel', () => {
    setVisible(false);
    setProgress(0);
  });

  useNuiEvent<ProgressbarProps>('progress', (data) => {
    setVisible(true);
    setLabel(data.label);
    setDuration(data.duration);
    setProgress(0);
    
    // Animiraj progress
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / data.duration) * 100, 100);
      setProgress(newProgress);
      
      if (newProgress < 100) {
        requestAnimationFrame(animate);
      } else {
        setTimeout(() => setVisible(false), 200);
      }
    };
    
    requestAnimationFrame(animate);
  });

  const renderDots = () => {
    const dots = [];
    const totalDots = 8;
    for (let i = 0; i < totalDots; i++) {
      const isActive = (progress / 100) * totalDots > i;
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
          <Box className={classes.progressContainer}>
            <Box className={classes.container}>
              <Box
                className={classes.bar}
                sx={{
                  width: `${progress}%`,
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
          </Box>
        </ScaleFade>
      </Box>
    </>
  );
};

export default Progressbar;