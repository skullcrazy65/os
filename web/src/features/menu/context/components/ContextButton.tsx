import { Button, createStyles, Group, HoverCard, Image, Progress, Stack, Text } from '@mantine/core';
import ReactMarkdown from 'react-markdown';
import { ContextMenuProps, Option } from '../../../../typings';
import { fetchNui } from '../../../../utils/fetchNui';
import { isIconUrl } from '../../../../utils/isIconUrl';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import MarkdownComponents from '../../../../config/MarkdownComponents';
import LibIcon from '../../../../components/LibIcon';

const openMenu = (id: string | undefined) => {
  fetchNui<ContextMenuProps>('openContext', { id: id, back: false });
};

const clickContext = (id: string) => {
  fetchNui('clickContext', id);
};

const useStyles = createStyles((theme, params: { disabled?: boolean; readOnly?: boolean }) => ({
  inner: {
    justifyContent: 'flex-start',
  },
  label: {
    width: '100%',
    color: params.disabled ? theme.colors.dark[2] : theme.colors.dark[0], // primary-text
    whiteSpace: 'pre-wrap',
  },
  button: {
    height: 'fit-content',
    width: '100%',
    padding: 12,
    backgroundColor: theme.colors.dark[4], // accent-bg
    border: `1px solid ${theme.colors.dark[3]}`, // hover-bg border
    borderRadius: 8,
    transition: 'all 0.2s ease',
    
    '&:hover': {
      backgroundColor: params.readOnly ? theme.colors.dark[4] : theme.colors.dark[3], // hover-bg
      cursor: params.readOnly ? 'unset' : 'pointer',
      transform: params.readOnly ? 'unset' : 'translateY(-1px)',
      boxShadow: params.readOnly ? 'unset' : '0 4px 16px rgba(0, 0, 0, 0.3)',
    },
    '&:active': {
      transform: params.readOnly ? 'unset' : 'translateY(0px)',
    },
  },
  iconImage: {
    maxWidth: '28px',
    borderRadius: 4,
  },
  description: {
    color: params.disabled ? theme.colors.dark[2] : theme.colors.dark[1], // secondary-text
    fontSize: 12,
    lineHeight: 1.4,
  },
  dropdown: {
    padding: 12,
    color: theme.colors.dark[0], // primary-text
    fontSize: 14,
    maxWidth: 280,
    width: 'fit-content',
    border: `1px solid ${theme.colors.dark[4]}`, // accent-bg border
    backgroundColor: theme.colors.dark[5], // secondary-bg
    borderRadius: 8,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(8px)',
  },
  buttonStack: {
    gap: 6,
    flex: '1',
  },
  buttonGroup: {
    gap: 8,
    flexWrap: 'nowrap',
  },
  buttonIconContainer: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 6,
    display: 'flex',
  },
  buttonTitleText: {
    overflowWrap: 'break-word',
    fontWeight: 500,
    fontSize: 14,
  },
  buttonArrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 28,
    height: 28,
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
    borderRadius: 6,
    display: 'flex',
  },
}));

const ContextButton: React.FC<{
  option: [string, Option];
}> = ({ option }) => {
  const button = option[1];
  const buttonKey = option[0];
  const { classes } = useStyles({ disabled: button.disabled, readOnly: button.readOnly });

  return (
    <>
      <HoverCard
        position="right-start"
        disabled={button.disabled || !(button.metadata || button.image)}
        openDelay={200}
      >
        <HoverCard.Target>
          <Button
            classNames={{ inner: classes.inner, label: classes.label, root: classes.button }}
            onClick={() =>
              !button.disabled && !button.readOnly
                ? button.menu
                  ? openMenu(button.menu)
                  : clickContext(buttonKey)
                : null
            }
            variant="default"
            disabled={button.disabled}
          >
            <Group position="apart" w="100%" noWrap>
              <Stack className={classes.buttonStack}>
                {(button.title || Number.isNaN(+buttonKey)) && (
                  <Group className={classes.buttonGroup}>
                    {button?.icon && (
                      <Stack className={classes.buttonIconContainer}>
                        {typeof button.icon === 'string' && isIconUrl(button.icon) ? (
                          <img src={button.icon} className={classes.iconImage} alt="Missing img" />
                        ) : (
                          <LibIcon
                            icon={button.icon as IconProp}
                            fixedWidth
                            size="sm"
                            style={{ color: button.iconColor || '#10b981' }}
                            animation={button.iconAnimation}
                          />
                        )}
                      </Stack>
                    )}
                    <Text className={classes.buttonTitleText}>
                      <ReactMarkdown components={MarkdownComponents}>{button.title || buttonKey}</ReactMarkdown>
                    </Text>
                  </Group>
                )}
                {button.description && (
                  <Text className={classes.description}>
                    <ReactMarkdown components={MarkdownComponents}>{button.description}</ReactMarkdown>
                  </Text>
                )}
                {button.progress !== undefined && (
                  <Progress 
                    value={button.progress} 
                    size="sm" 
                    color={button.colorScheme || '#10b981'}
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
                )}
              </Stack>
              {(button.menu || button.arrow) && button.arrow !== false && (
                <Stack className={classes.buttonArrowContainer}>
                  <LibIcon icon="chevron-right" fixedWidth size="sm" style={{ color: '#94a3b8' }} />
                </Stack>
              )}
            </Group>
          </Button>
        </HoverCard.Target>
        <HoverCard.Dropdown className={classes.dropdown}>
          {button.image && <Image src={button.image} radius={6} />}
          {Array.isArray(button.metadata) ? (
            button.metadata.map(
              (
                metadata: string | { label: string; value?: any; progress?: number; colorScheme?: string },
                index: number
              ) => (
                <>
                  <Text key={`context-metadata-${index}`} size="sm">
                    {typeof metadata === 'string' ? `${metadata}` : `${metadata.label}: ${metadata?.value ?? ''}`}
                  </Text>

                  {typeof metadata === 'object' && metadata.progress !== undefined && (
                    <Progress
                      value={metadata.progress}
                      size="sm"
                      color={metadata.colorScheme || button.colorScheme || '#10b981'}
                      styles={(theme) => ({
                        root: { 
                          backgroundColor: theme.colors.dark[6],
                          borderRadius: 4,
                          marginTop: 4,
                        },
                        bar: {
                          borderRadius: 4,
                        }
                      })}
                    />
                  )}
                </>
              )
            )
          ) : (
            <>
              {typeof button.metadata === 'object' &&
                Object.entries(button.metadata).map((metadata: { [key: string]: any }, index) => (
                  <Text key={`context-metadata-${index}`} size="sm">
                    {metadata[0]}: {metadata[1]}
                  </Text>
                ))}
            </>
          )}
        </HoverCard.Dropdown>
      </HoverCard>
    </>
  );
};

export default ContextButton;