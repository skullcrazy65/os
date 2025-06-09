import React from 'react';
import { Box, createStyles, Text } from '@mantine/core';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import ScaleFade from '../../transitions/ScaleFade';
import type { ProgressbarProps } from '../../typings';

const useStyles = createStyles(() => ({
  wrapper: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
    zIndex: 9999,
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'transparent',
  },
  labelText: {
    color: '#ff1e47',
    fontWeight: 800,
    fontSize: 20,
    fontFamily: 'Arial, sans-serif',
    textShadow: '1px 1px 2px black',
  },
  barContainer: {
    display: 'flex',
    gap: 4,
  },
  segment: {
    width: 24,
    height: 32,
    backgroundColor: '#ff1e47',
    clipPath: 'polygon(0% 0%, 80% 0%, 100% 50%, 80% 100%, 0% 100%)',
    transition: 'opacity 0.2s ease-in-out',
  },
}));

const Progressbar: React.FC = () => {
  const { classes } = useStyles();
  const [visible, setVisible] = React.useState(false);
  const [label, setLabel] = React.useState('');
  const [duration, setDuration] = React.useState(0);
  const [percentage, setPercentage] = React.useState(0);

  useNuiEvent('progressCancel', () => setVisible(false));

  useNuiEvent<ProgressbarProps>('progress', (data) => {
    setLabel(data.label || 'Loading');
    setDuration(data.duration);
    setVisible(true);
    setPercentage(0);

    // Animacija napredovanja
    let start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const newPercent = Math.min(100, Math.floor((elapsed / data.duration) * 100));
      setPercentage(newPercent);
      if (elapsed < data.duration) {
        requestAnimationFrame(tick);
      } else {
        setVisible(false);
        fetchNui('progressComplete');
      }
    };
    requestAnimationFrame(tick);
  });

  const totalSegments = 15;
  const activeSegments = Math.floor((percentage / 100) * totalSegments);

  return visible ? (
    <Box className={classes.wrapper}>
      <Box className={classes.container}>
        <ScaleFade visible={visible}>
          <>
            <Text className={classes.labelText}>
              {label} {percentage}%
            </Text>
            <Box className={classes.barContainer}>
              {[...Array(totalSegments)].map((_, i) => (
                <Box
                  key={i}
                  className={classes.segment}
                  style={{ opacity: i < activeSegments ? 1 : 0.15 }}
                />
              ))}
            </Box>
          </>
        </ScaleFade>
      </Box>
    </Box>
  ) : null;
};

export default Progressbar;
