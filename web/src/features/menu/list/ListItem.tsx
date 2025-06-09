import { Box, createStyles, Group, Progress, Stack, Text } from '@mantine/core';
import React, { forwardRef } from 'react';
import CustomCheckbox from './CustomCheckbox';
import type { MenuItem } from '../../../typings';
import { isIconUrl } from '../../../utils/isIconUrl';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import LibIcon from '../../../components/LibIcon';

interface Props {
  item: MenuItem;
  index: number;
  scrollIndex: number;
  checked: boolean;
}

const useStyles = createStyles((theme, params: { iconColor?: string }) => ({
  buttonContainer: {
    backgroundColor: theme.colors.dark[4], // accent-bg
    borderRadius: 8,
    padding: 12,
    height: 64,
    scrollMargin: 8,
    border: `1px solid ${theme.colors.dark[3]}`, // hover-bg border
    transition: 'all 0.2s ease',
    
    '&:focus': {
      backgroundColor: theme.colors.dark[3], // hover-bg
      outline: 'none',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
      borderColor: '#10b981',
    },
  },
  iconImage: {
    maxWidth: 32,
    borderRadius: 4,
  },
  buttonWrapper: {
    paddingLeft: 0,
    paddingRight: 0,
    height: '100%',
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    width: 36,
    height: 36,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 6,
    justifyContent: 'center',
  },
  icon: {
    fontSize: 18,
    color: params.iconColor || '#10b981',
  },
  label: {
    color: theme.colors.dark[0], // primary-text
    textTransform: 'uppercase',
    fontSize: 12,
    fontWeight: 600,
    verticalAlign: 'middle',
    letterSpacing: '0.5px',
  },
  chevronIcon: {
    fontSize: 12,
    color: theme.colors.dark[1], // secondary-text
  },
  scrollIndexValue: {
    color: theme.colors.dark[1], // secondary-text
    textTransform: 'uppercase',
    fontSize: 12,
    fontWeight: 500,
  },
  progressStack: {
    width: '100%',
    marginRight: 8,
  },
  progressLabel: {
    verticalAlign: 'middle',
    marginBottom: 4,
    fontWeight: 500,
  },
  valueText: {
    color: theme.colors.dark[0], // primary-text
    fontSize: 14,
    fontWeight: 500,
  },
  scrollContainer: {
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
    borderRadius: 6,
    padding: '4px 8px',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  }
}));

const ListItem = forwardRef<Array<HTMLDivElement | null>, Props>(({ item, index, scrollIndex, checked }, ref) => {
  const { classes } = useStyles({ iconColor: item.iconColor });

  return (
    <Box
      tabIndex={index}
      className={classes.buttonContainer}
      key={`item-${index}`}
      ref={(element: HTMLDivElement) => {
        if (ref)
          // @ts-ignore i cba
          return (ref.current = [...ref.current, element]);
      }}
    >
      <Group spacing={12} noWrap className={classes.buttonWrapper}>
        {item.icon && (
          <Box className={classes.iconContainer}>
            {typeof item.icon === 'string' && isIconUrl(item.icon) ? (
              <img src={item.icon} alt="Missing image" className={classes.iconImage} />
            ) : (
              <LibIcon
                icon={item.icon as IconProp}
                className={classes.icon}
                fixedWidth
                animation={item.iconAnimation}
              />
            )}
          </Box>
        )}
        {Array.isArray(item.values) ? (
          <Group position="apart" w="100%">
            <Stack spacing={2} justify="space-between">
              <Text className={classes.label}>{item.label}</Text>
              <Text className={classes.valueText}>
                {typeof item.values[scrollIndex] === 'object'
                  ? // @ts-ignore for some reason even checking the type TS still thinks it's a string
                    item.values[scrollIndex].label
                  : item.values[scrollIndex]}
              </Text>
            </Stack>
            <Box className={classes.scrollContainer}>
              <LibIcon icon="chevron-left" className={classes.chevronIcon} />
              <Text className={classes.scrollIndexValue}>
                {scrollIndex + 1}/{item.values.length}
              </Text>
              <LibIcon icon="chevron-right" className={classes.chevronIcon} />
            </Box>
          </Group>
        ) : item.checked !== undefined ? (
          <Group position="apart" w="100%">
            <Text className={classes.valueText}>{item.label}</Text>
            <CustomCheckbox checked={checked}></CustomCheckbox>
          </Group>
        ) : item.progress !== undefined ? (
          <Stack className={classes.progressStack} spacing={0}>
            <Text className={classes.progressLabel}>{item.label}</Text>
            <Progress
              value={item.progress}
              color={item.colorScheme || '#10b981'}
              styles={(theme) => ({ 
                root: { 
                  backgroundColor: theme.colors.dark[6],
                  borderRadius: 4,
                },
                bar: {
                  borderRadius: 4,
                }
              })}
            />
          </Stack>
        ) : (
          <Text className={classes.valueText}>{item.label}</Text>
        )}
      </Group>
    </Box>
  );
});

export default React.memo(ListItem);