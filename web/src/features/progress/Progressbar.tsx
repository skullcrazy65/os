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

const useStyles = createStyles((theme) => ({
  container: {
    width: 400,
    height: 56,
    borderRadius: 12,
    backgroundColor: theme.colors.dark[5], // secondary-bg
    overflow: 'hidden',
    border: `1px solid ${theme.colors.dark[4]}`, // accent-bg border
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(8px)',
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
    borderRadius: 12,
    position: 'relative',
    
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
      animation: 'shimmer 2s infinite',
    }
  },
  labelWrapper: {
    position: 'absolute',
    display: 'flex',
    width: 400,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  label: {
    maxWidth: 380,
    padding: 12,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    fontSize: 16,
    fontWeight: 500,
    color: theme.colors.dark[0], // primary-text
    textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
    fontFamily: 'Inter, sans-serif',
  },
  '@keyframes shimmer': {
    '0%': { transform: 'translateX(-100%)' },
    '100%': { transform: 'translateX(100%)' }
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