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

const stripeAnimation = keyframes({
  '0%': { backgroundPosition: '0 0' },
  '100%': { backgroundPosition: '40px 0' }
});

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
    width: '95%',
    height: 8,
    borderRadius: 0,
    backgroundColor: 'rgba(42, 42, 42, 0.8)',
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 20,
  },
  bar: {
    height: '100%',
    background: `
      repeating-linear-gradient(
        45deg,
        #ff4757,
        #ff4757 10px,
        #ff3742 10px,
        #ff3742 20px
      )
    `,
    position: 'relative',
    animation: `${stripeAnimation} 1s linear infinite`,
  },
  labelWrapper: {
    position: 'absolute',
    display: 'flex',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    top: 0,
    left: 0,
  },
  label: {
    padding: '2px 8px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    fontSize: 11,
    fontWeight: 600,
    color: '#ffffff',
    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
    fontFamily: 'Arial, sans-serif',
  },
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
            <Box
              className={classes.bar}
              onAnimationEnd={() => setVisible(false)}
              sx={{
                animation: `${progressAnimation} linear, ${stripeAnimation} 1s linear infinite`,
                animationDuration: `${duration}ms, 1s`,
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