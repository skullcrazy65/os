import { Box, createStyles, Text } from '@mantine/core';
import React from 'react';

const useStyles = createStyles((theme) => ({
  container: {
    textAlign: 'center',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: theme.colors.dark[5], // secondary-bg
    border: `1px solid ${theme.colors.dark[4]}`, // accent-bg border
    height: 64,
    width: 400,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(8px)',
    position: 'relative',
    
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '3px',
      background: 'linear-gradient(90deg, #10b981, #34d399)',
      borderRadius: '12px 12px 0 0',
    }
  },
  heading: {
    fontSize: 18,
    textTransform: 'uppercase',
    fontWeight: 600,
    color: theme.colors.dark[0], // primary-text
    fontFamily: 'Inter, sans-serif',
    letterSpacing: '0.5px',
  },
}));

const Header: React.FC<{ title: string }> = ({ title }) => {
  const { classes } = useStyles();

  return (
    <Box className={classes.container}>
      <Text className={classes.heading}>{title}</Text>
    </Box>
  );
};

export default React.memo(Header);