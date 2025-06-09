import { useNuiEvent } from '../../hooks/useNuiEvent';
import { toast, Toaster } from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { Box, Center, createStyles, Group, keyframes, RingProgress, Stack, Text, ThemeIcon } from '@mantine/core';
import React, { useState } from 'react';
import tinycolor from 'tinycolor2';
import type { NotificationProps } from '../../typings';
import MarkdownComponents from '../../config/MarkdownComponents';
import LibIcon from '../../components/LibIcon';

const useStyles = createStyles((theme) => ({
  container: {
    width: 320,
    height: 'fit-content',
    backgroundColor: theme.colors.dark[5], // secondary-bg
    color: theme.colors.dark[0], // primary-text
    padding: '8px 12px',
    borderRadius: 10,
    fontFamily: 'Inter, sans-serif',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
    border: `1px solid ${theme.colors.dark[4]}`, // accent-bg border
    backdropFilter: 'blur(8px)',
    position: 'relative',
    overflow: 'hidden',
    
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '3px',
      background: 'linear-gradient(90deg, #10b981, #34d399)',
      borderRadius: '10px 10px 0 0',
    }
  },
  title: {
    fontWeight: 600,
    lineHeight: 1.4,
    fontSize: 14,
    color: theme.colors.dark[0],
  },
  description: {
    fontSize: 12,
    color: theme.colors.dark[1], // secondary-text
    fontFamily: 'Inter, sans-serif',
    lineHeight: 1.5,
    marginTop: 2,
  },
  descriptionOnly: {
    fontSize: 13,
    color: theme.colors.dark[1],
    fontFamily: 'Inter, sans-serif',
    lineHeight: 1.5,
  },
  iconContainer: {
    borderRadius: 1,
    padding: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
}));

const createAnimation = (from: string, to: string, visible: boolean) => keyframes({
  from: {
    opacity: visible ? 0 : 1,
    transform: `translate${from}`,
  },
  to: {
    opacity: visible ? 1 : 0,
    transform: `translate${to}`,
  },
});

const getAnimation = (visible: boolean, position: string) => {
  const animationOptions = visible ? '0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' : '0.2s ease-in forwards'
  let animation: { from: string; to: string };

  if (visible) {
    animation = position.includes('bottom') ? { from: 'Y(40px)', to: 'Y(0px)' } : { from: 'Y(-40px)', to:'Y(0px)' };
  } else {
    if (position.includes('right')) {
      animation = { from: 'X(0px)', to: 'X(100%)' }
    } else if (position.includes('left')) {
      animation = { from: 'X(0px)', to: 'X(-100%)' };
    } else if (position === 'top-center') {
      animation = { from: 'Y(0px)', to: 'Y(-100%)' };
    } else if (position === 'bottom') {
      animation = { from: 'Y(0px)', to: 'Y(100%)' };
    } else {
      animation = { from: 'X(0px)', to: 'X(100%)' };
    }
  }

  return `${createAnimation(animation.from, animation.to, visible)} ${animationOptions}`
};

const durationCircle = keyframes({
  '0%': { strokeDasharray: `0, ${15.1 * 2 * Math.PI}` },
  '100%': { strokeDasharray: `${15.1 * 2 * Math.PI}, 0` },
});

const Notifications: React.FC = () => {
  const { classes } = useStyles();
  const [toastKey, setToastKey] = useState(0);

  useNuiEvent<NotificationProps>('notify', (data) => {
    if (!data.title && !data.description) return;

    const toastId = data.id?.toString();
    const duration = data.duration || 4000;

    let iconColor: string;
    let iconBgColor: string;
    let position = data.position || 'top-right';

    data.showDuration = data.showDuration !== undefined ? data.showDuration : true;

    if (toastId) setToastKey(prevKey => prevKey + 1);

    // Backwards compat with old notifications
    switch (position) {
      case 'top':
        position = 'top-center';
        break;
      case 'bottom':
        position = 'bottom-center';
        break;
    }

    if (!data.icon) {
      switch (data.type) {
        case 'error':
          data.icon = 'circle-xmark';
          break;
        case 'success':
          data.icon = 'circle-check';
          break;
        case 'warning':
          data.icon = 'triangle-exclamation';
          break;
        default:
          data.icon = 'circle-info';
          break;
      }
    }

    if (!data.iconColor) {
      switch (data.type) {
        case 'error':
          iconColor = '#ef4444';
          iconBgColor = 'rgba(239, 68, 68, 0.1)';
          break;
        case 'success':
          iconColor = '#10b981';
          iconBgColor = 'rgba(16, 185, 129, 0.1)';
          break;
        case 'warning':
          iconColor = '#f59e0b';
          iconBgColor = 'rgba(245, 158, 11, 0.1)';
          break;
        default:
          iconColor = '#3b82f6';
          iconBgColor = 'rgba(59, 130, 246, 0.1)';
          break;
      }
    } else {
      iconColor = tinycolor(data.iconColor).toRgbString();
      iconBgColor = tinycolor(data.iconColor).setAlpha(0.1).toRgbString();
    }
    
    toast.custom(
      (t) => (
        <Box
          sx={{
            animation: getAnimation(t.visible, position),
            ...data.style,
          }}
          className={`${classes.container}`}
        >
          <Group noWrap spacing={10}>
            {data.icon && (
              <Box className={classes.iconContainer} sx={{ backgroundColor: iconBgColor }}>
                {data.showDuration ? (
                 <RingProgress
  key={toastKey}
  size={36}s
  thickness={3}
  sections={[{ value: 100, color: iconColor }]}
  style={{ alignSelf: !data.alignIcon || data.alignIcon === 'center' ? 'center' : 'start' }}
  styles={{
    root: data.showDuration
      ? {
          '> svg > circle:nth-of-type(2)': {
            animation: `${durationCircle} linear forwards reverse`,
            animationDuration: `${duration}ms`,
          },
        }
      : {},
  }}
  label={
    <Center>
      <LibIcon 
        icon={data.icon} 
        fixedWidth 
        color={iconColor} 
        animation={data.iconAnimation}
        size="sm"
      />
    </Center>
  }
/>

                ) : (
                  <LibIcon 
                    icon={data.icon} 
                    fixedWidth 
                    color={iconColor} 
                    animation={data.iconAnimation}
                    size="sm"
                    style={{ alignSelf: !data.alignIcon || data.alignIcon === 'center' ? 'center' : 'start' }}
                  />
                )}
              </Box>
            )}
            <Stack spacing={1} sx={{ flex: 1 }}>
              {data.title && <Text className={classes.title}>{data.title}</Text>}
              {data.description && (
                <ReactMarkdown
                  components={MarkdownComponents}
                  className={`${!data.title ? classes.descriptionOnly : classes.description} description`}
                >
                  {data.description}
                </ReactMarkdown>
              )}
            </Stack>
          </Group>
        </Box>
      ),
      {
        id: toastId,
        duration: duration,
        position: position,
      }
    );
  });

  return <Toaster />;
};

export default Notifications;