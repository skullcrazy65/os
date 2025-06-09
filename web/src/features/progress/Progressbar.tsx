import React from 'react';
import { Box, createStyles, Text, keyframes } from '@mantine/core';

const progressFill = keyframes({
  '0%': { width: '0%' },
  '100%': { width: '100%' },
});

const stripeMove = keyframes({
  '0%': { backgroundPosition: '0 0' },
  '100%': { backgroundPosition: '40px 0' },
});

const useStyles = createStyles(() => ({
  container: {
    width: 600,
    height: 30,
    backgroundColor: '#000',
    border: '2px solid #ff2c2c',
    overflow: 'hidden',
    position: 'relative',
    fontFamily: 'monospace',
  },
  bar: {
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    background: `
      repeating-linear-gradient(
        135deg,
        #ff2c2c,
        #ff2c2c 10px,
        #cc1f1f 10px,
        #cc1f1f 20px
      )
    `,
    backgroundSize: '40px 100%',
    animation: `${stripeMove} 0.8s linear infinite`,
    zIndex: 1,
  },
  label: {
    zIndex: 2,
    position: 'absolute',
    left: 10,
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#ff2c2c',
    fontWeight: 700,
    fontSize: 18,
    pointerEvents: 'none',
  },
}));

type CustomProgressProps = {
  label?: string;
  percent?: number;
  duration?: number; // in ms
};

const ChevronProgress: React.FC<CustomProgressProps> = ({
  label = 'LOADING',
  percent = 100,
  duration = 3000,
}) => {
  const { classes } = useStyles();

  return (
    <Box className={classes.container}>
      <Box
        className={classes.bar}
        sx={{
          width: `${percent}%`,
          animation: `${progressFill} ${duration}ms linear forwards, ${stripeMove} 0.8s linear infinite`,
        }}
      />
      <Text className={classes.label}>
        {label} {percent}%
      </Text>
    </Box>
  );
};

export default ChevronProgress;
