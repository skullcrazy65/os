import { useNuiEvent } from '../../../hooks/useNuiEvent';
import { Box, createStyles, Flex, Stack, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { ContextMenuProps } from '../../../typings';
import ContextButton from './components/ContextButton';
import { fetchNui } from '../../../utils/fetchNui';
import ReactMarkdown from 'react-markdown';
import HeaderButton from './components/HeaderButton';
import ScaleFade from '../../../transitions/ScaleFade';
import MarkdownComponents from '../../../config/MarkdownComponents';

const openMenu = (id: string | undefined) => {
  fetchNui<ContextMenuProps>('openContext', { id: id, back: true });
};

const useStyles = createStyles((theme) => ({
  container: {
    position: 'absolute',
    top: '15%',
    right: '25%',
    width: 340,
    height: 580,
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  titleContainer: {
    borderRadius: 8,
    flex: '1 85%',
    backgroundColor: theme.colors.dark[5], // secondary-bg
    border: `1px solid ${theme.colors.dark[4]}`, // accent-bg border
    backdropFilter: 'blur(8px)',
  },
  titleText: {
    color: theme.colors.dark[0], // primary-text
    padding: 12,
    textAlign: 'center',
    fontWeight: 600,
    fontSize: 16,
    fontFamily: 'Inter, sans-serif',
  },
  buttonsContainer: {
    height: 560,
    overflowY: 'scroll',
    backgroundColor: theme.colors.dark[5], // secondary-bg
    borderRadius: 12,
    border: `1px solid ${theme.colors.dark[4]}`, // accent-bg border
    backdropFilter: 'blur(8px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
    padding: 8,
    
    '&::-webkit-scrollbar': {
      width: 6,
    },
    '&::-webkit-scrollbar-track': {
      background: theme.colors.dark[6],
      borderRadius: 3,
    },
    '&::-webkit-scrollbar-thumb': {
      background: theme.colors.dark[4],
      borderRadius: 3,
      '&:hover': {
        background: theme.colors.dark[3],
      }
    }
  },
  buttonsFlexWrapper: {
    gap: 6,
  },
}));

const ContextMenu: React.FC = () => {
  const { classes } = useStyles();
  const [visible, setVisible] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenuProps>({
    title: '',
    options: { '': { description: '', metadata: [] } },
  });

  const closeContext = () => {
    if (contextMenu.canClose === false) return;
    setVisible(false);
    fetchNui('closeContext');
  };

  // Hides the context menu on ESC
  useEffect(() => {
    if (!visible) return;

    const keyHandler = (e: KeyboardEvent) => {
      if (['Escape'].includes(e.code)) closeContext();
    };

    window.addEventListener('keydown', keyHandler);

    return () => window.removeEventListener('keydown', keyHandler);
  }, [visible]);

  useNuiEvent('hideContext', () => setVisible(false));

  useNuiEvent<ContextMenuProps>('showContext', async (data) => {
    if (visible) {
      setVisible(false);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    setContextMenu(data);
    setVisible(true);
  });

  return (
    <Box className={classes.container}>
      <ScaleFade visible={visible}>
        <Flex className={classes.header}>
          {contextMenu.menu && (
            <HeaderButton icon="chevron-left" iconSize={16} handleClick={() => openMenu(contextMenu.menu)} />
          )}
          <Box className={classes.titleContainer}>
            <Text className={classes.titleText}>
              <ReactMarkdown components={MarkdownComponents}>{contextMenu.title}</ReactMarkdown>
            </Text>
          </Box>
          <HeaderButton icon="xmark" canClose={contextMenu.canClose} iconSize={18} handleClick={closeContext} />
        </Flex>
        <Box className={classes.buttonsContainer}>
          <Stack className={classes.buttonsFlexWrapper}>
            {Object.entries(contextMenu.options).map((option, index) => (
              <ContextButton option={option} key={`context-item-${index}`} />
            ))}
          </Stack>
        </Box>
      </ScaleFade>
    </Box>
  );
};

export default ContextMenu;