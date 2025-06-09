import React from 'react';
import {createStyles, keyframes, RingProgress, Stack, Text, useMantineTheme} from '@mantine/core';
import {useNuiEvent} from '../../hooks/useNuiEvent';
import {fetchNui} from '../../utils/fetchNui';
import ScaleFade from '../../transitions/ScaleFade';
import type {CircleProgressbarProps} from '../../typings';

// 33.5 is the r of the circle
const progressCircle = keyframes({
  '0%': { strokeDasharray: `0, ${33.5 * 2 * Math.PI}` },
  '100%': { strokeDasharray: `${33.5 * 2 * Math.PI}, 0` },
});

const useStyles = createStyles((theme, params: { position: 'middle' | 'bottom'; duration: number }) => ({
  container: {
    width: '100%',
    height: params.position === 'middle' ? '100%' : '20%',
    bottom: 0,
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progress: {
    filter: 'drop-shadow(0 4px 16px rgba(0, 0, 0, 0.3))',
    
    '> svg > circle:nth-of-type(1)': {
      stroke: theme.colors.dark[5], // secondary-bg
    },
    // Scuffed way of grabbing the first section and animating it
    '> svg > circle:nth-of-type(2)': {
      transition: 'none',
      animation: `${progressCircle} linear forwards`,
      animationDuration: `${params.duration}ms`,
      stroke: 'url(#gradient)',
    },
  },
  value: {
    textAlign: 'center',
    fontFamily: 'Inter, monospace',
    textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
    color: theme.colors.dark[0], // primary-text
    fontSize: 18,
    fontWeight: 600,
  },
  label: {
    textAlign: 'center',
    textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
    color: theme.colors.dark[1], // secondary-text
    height: 25,
    fontSize: 14,
    fontWeight: 500,
    fontFamily: 'Inter, sans-serif',
  },
  wrapper: {
    marginTop: params.position === 'middle' ? 25 : undefined,
    padding: 20,
    borderRadius: 16,
    backgroundColor: 'rgba(15, 20, 25, 0.8)',
    backdropFilter: 'blur(8px)',
    border: `1px solid ${theme.colors.dark[4]}`,
  },
  gradient: {
    position: 'absolute',
    width: 0,
    height: 0,
  }
}));

const CircleProgressbar: React.FC = () => {
  const [visible, setVisible] = React.useState(false);
  const [progressDuration, setProgressDuration] = React.useState(0);
  const [position, setPosition] = React.useState<'middle' | 'bottom'>('middle');
  const [value, setValue] = React.useState(0);
  const [label, setLabel] = React.useState('');
  const theme = useMantineTheme();
  const { classes } = useStyles({ position, duration: progressDuration });

  useNuiEvent('progressCancel', () => {
    setValue(99);
    setVisible(false);
  });

  useNuiEvent<CircleProgressbarProps>('circleProgress', (data) => {
    if (visible) return;
    setVisible(true);
    setValue(0);
    setLabel(data.label || '');
    setProgressDuration(data.duration);
    setPosition(data.position || 'middle');
    const onePercent = data.duration * 0.01;
    const updateProgress = setInterval(() => {
      setValue((previousValue) => {
        const newValue = previousValue + 1;
        newValue >= 100 && clearInterval(updateProgress);
        return newValue;
      });
    }, onePercent);
  });

  return (
    <>
      <Stack spacing={0} className={classes.container}>
        <ScaleFade visible={visible} onExitComplete={() => fetchNui('progressComplete')}>
          <Stack spacing={0} align="center" className={classes.wrapper}>
            <svg className={classes.gradient}>
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
              </defs>
            </svg>
            <RingProgress
              size={110}
              thickness={8}
              sections={[{ value: 0, color: '#10b981' }]}
              onAnimationEnd={() => setVisible(false)}
              className={classes.progress}
              label={<Text className={classes.value}>{value}%</Text>}
            />
            {label && <Text className={classes.label}>{label}</Text>}
          </Stack>
        </ScaleFade>
      </Stack>
    </>
  );
};

export default CircleProgressbar;