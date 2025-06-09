import React from 'react';
import { Box, createStyles, Text, Group, Stack } from '@mantine/core';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import ScaleFade from '../../transitions/ScaleFade';
import type { ProgressbarProps } from '../../typings';
import LibIcon from '../../components/LibIcon';

const useStyles = createStyles((theme) => ({
  wrapper: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    bottom: 0,
    position: 'absolute',
    pointerEvents: 'none',
  },
  container: {
    height: '8%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
    marginBottom: 12,
  },
  iconContainer: {
    backgroundColor: 'rgba(36, 36, 36, 0.8)',
    width: 50,
    height: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    padding: 12,
  },
  icon: {
    fontSize: 24,
    color: '#0284c7',
    textShadow: '0px 0px 15px rgb(2 132 199)',
  },
  progressSection: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    gap: 8,
  },
  labelRow: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 400,
    color: '#ffffff',
    fontFamily: 'Arial, sans-serif',
  },
  percentage: {
    fontSize: 16,
    fontWeight: 500,
    color: '#ffffff',
    fontFamily: 'Arial, sans-serif',
  },
  segmentsContainer: {
    width: '100%',
    borderRadius: 9999,
    height: 16,
    display: 'flex',
    gap: 1,
    backgroundColor: 'transparent',
  },
  segment: {
    height: '100%',
    flex: 1,
    borderRadius: 2,
    position: 'relative',
  },
  segmentInner: {
    position: 'absolute',
    inset: 0,
    borderRadius: 2,
    opacity: 1,
    transition: 'all 1000ms ease-out',
  },
  segmentActive: {
    backgroundColor: '#0284c7',
    boxShadow: '0 0px 6px 2px rgba(2, 132, 199, 0.5)',
  },
  segmentInactive: {
    backgroundColor: '#242424',
    boxShadow: '0 0px 6px 2px rgba(36, 36, 36, 0.5)',
  },
}));

const Progressbar: React.FC = () => {
  const { classes } = useStyles();
  const [visible, setVisible] = React.useState(false);
  const [label, setLabel] = React.useState('');
  const [duration, setDuration] = React.useState(0);
  const [progressPercentage, setProgressPercentage] = React.useState(0);
  const [interval, setIntervalState] = React.useState<NodeJS.Timeout | null>(null);

  const startProgress = () => {
    const totalTime = duration;
    const intervalTime = 100;
    let elapsedTime = 0;

    if (interval) {
      clearInterval(interval);
    }

    const newInterval = setInterval(() => {
      elapsedTime += intervalTime;
      const newPercentage = (elapsedTime / totalTime) * 100;
      setProgressPercentage(newPercentage);

      if (newPercentage >= 100) {
        clearInterval(newInterval);
        setVisible(false);
        fetchNui('progressComplete');
      }
    }, intervalTime);

    setIntervalState(newInterval);
  };

  useNuiEvent('progressCancel', () => {
    setProgressPercentage(99);
    setVisible(false);
    if (interval) {
      clearInterval(interval);
    }
  });

  useNuiEvent<ProgressbarProps>('progress', (data) => {
    if (visible) return;
    setVisible(true);
    setProgressPercentage(0);
    setLabel(data.label || '');
    setDuration(data.duration);
  });

  // Generate 30 segments
  const segments = Array.from({ length: 30 }, (_, index) => {
    const segmentNumber = index + 1;
    const isActive = Math.ceil((progressPercentage / 100) * 30) >= segmentNumber;
    
    return (
      <Box key={segmentNumber} className={classes.segment}>
        <Box 
          className={`${classes.segmentInner} ${isActive ? classes.segmentActive : classes.segmentInactive}`}
        />
      </Box>
    );
  });

  return (
    <>
      <Box className={classes.wrapper}>
        <ScaleFade visible={visible} onExitComplete={() => fetchNui('progressComplete')}>
          <Box 
            className={classes.container}
            sx={{ 
              width: label ? '17%' : '15%',
              '@media (max-width: 1920px)': {
                width: label ? '25%' : '20%',
              },
              '@media (max-width: 1366px)': {
                width: label ? '35%' : '30%',
              }
            }}
            onAnimationStart={startProgress}
          >
            {/* Icon container - only show if there's a label */}
            {label && (
              <Box className={classes.iconContainer}>
                <LibIcon icon="cog" className={classes.icon} />
              </Box>
            )}
            
            {/* Progress section */}
            <Box className={classes.progressSection}>
              {/* Label and percentage row */}
              <Box className={classes.labelRow}>
                <Text className={classes.label}>{label}</Text>
                <Text className={classes.percentage}>{Math.round(progressPercentage)}%</Text>
              </Box>
              
              {/* Segments container */}
              <Box className={classes.segmentsContainer}>
                {segments}
              </Box>
            </Box>
          </Box>
        </ScaleFade>
      </Box>
    </>
  );
};

export default Progressbar;