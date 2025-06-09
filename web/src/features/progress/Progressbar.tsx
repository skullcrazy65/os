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
  container: {
    width: 400,
    height: 20,
    borderRadius: 0,
    backgroundColor: '#2a2a2a',
    overflow: 'hidden',
    border: '1px solid #444',
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
    width: 400,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  label: {
    maxWidth: 380,
    padding: 4,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    fontSize: 12,
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