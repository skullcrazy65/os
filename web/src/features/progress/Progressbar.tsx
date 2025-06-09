import React from 'react';
import { Box, createStyles, Text } from '@mantine/core';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import ScaleFade from '../../transitions/ScaleFade';
import type { ProgressbarProps } from '../../typings';

const useStyles = createStyles(() => ({
  wrapper: {
    width: '100%',
    height: '100vh',
    position: 'absolute',
    left: 0,
    bottom: 60, // udaljenost od dna ekrana (možeš podesiti)
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none', // da ne blokira klikove
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
    setLabel(data.label || 'LOADING');
    setDuration(data.duration);
    setVisible(true);

    // animate from 0% to 100%
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
      <ScaleFade visible={visible}>
        <Box className={classes.container}>
          <Text className={classes.labelText}>{label}</Text>
          <Text className={classes.labelText}>{percentage}%</Text>
          <Box className={classes.barContainer}>
            {[...Array(totalSegments)].map((_, i) => (
              <Box
                key={i}
                className={classes.segment}
                style={{ opacity: i < activeSegments ? 1 : 0.15 }}
              />
            ))}
          </Box>
        </Box>
      </ScaleFade>
    </Box>
  ) : null;
};

export default Progressbar;
