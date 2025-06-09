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
    width: '80vw',
    height: 8,
    borderRadius: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    overflow: 'hidden',
    border: 'none',
    position: 'relative',
  },
  wrapper: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    bottom: 0,
    position: 'absolute',
    paddingBottom: 20,
  },
  bar: {
    height: '100%',
    background: `
      repeating-linear-gradient(
        45deg,
        #ff3333,
        #ff3333 10px,
        #cc2222 10px,
        #cc2222 20px
      )
    `,
    position: 'relative',
    animation: `${stripeAnimation} 1s linear infinite`,
  },
  labelWrapper: {
    position: 'absolute',
    display: 'flex',
    width: '80vw',
    height: 8,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    top: -25,
  },
  label: {
    maxWidth: '70vw',
    padding: 4,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    fontSize: 14,
    fontWeight: 500,
    color: '#ffffff',
    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
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
            <Box className={classes.labelWrapper}>
              <Text className={classes.label}>{label}</Text>
            </Box>
            <Box
              className={classes.bar}
              onAnimationEnd={() => setVisible(false)}
              sx={{
                animation: `${progressAnimation} linear, ${stripeAnimation} 1s linear infinite`,
                animationDuration: `${duration}ms, 1s`,
              }}
            />
          </Box>
        </ScaleFade>
      </Box>
    </>
  );
};

export default Progressbar;