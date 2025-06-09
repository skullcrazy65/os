import { Button, createStyles, Group, Modal, Stack, useMantineTheme } from '@mantine/core';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import { useLocales } from '../../providers/LocaleProvider';
import remarkGfm from 'remark-gfm';
import type { AlertProps } from '../../typings';
import MarkdownComponents from '../../config/MarkdownComponents';

const useStyles = createStyles((theme) => ({
  contentStack: {
    color: '#94a3b8', // secondary-text
  },
  modal: {
    backgroundColor: '#1a2332', // secondary-bg
    border: '1px solid #243447', // accent-bg
    borderRadius: 12,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
  },
  header: {
    backgroundColor: '#1a2332', // secondary-bg
    borderBottom: '1px solid #243447', // accent-bg
    color: '#ffffff', // primary-text
    fontWeight: 600,
  },
  confirmButton: {
    backgroundColor: '#10b981', // accent-color
    '&:hover': {
      backgroundColor: '#059669', // accent-color-dark
    }
  },
  cancelButton: {
    backgroundColor: '#243447', // accent-bg
    color: '#94a3b8', // secondary-text
    '&:hover': {
      backgroundColor: '#2d4159', // hover-bg
    }
  }
}));

const AlertDialog: React.FC = () => {
  const { locale } = useLocales();
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const [dialogData, setDialogData] = useState<AlertProps>({
    header: '',
    content: '',
  });

  const closeAlert = (button: string) => {
    setOpened(false);
    fetchNui('closeAlert', button);
  };

  useNuiEvent('sendAlert', (data: AlertProps) => {
    setDialogData(data);
    setOpened(true);
  });

  useNuiEvent('closeAlertDialog', () => {
    setOpened(false);
  });

  return (
    <>
      <Modal
        opened={opened}
        centered={dialogData.centered}
        size={dialogData.size || 'md'}
        overflow={dialogData.overflow ? 'inside' : 'outside'}
        closeOnClickOutside={false}
        onClose={() => {
          setOpened(false);
          closeAlert('cancel');
        }}
        withCloseButton={false}
        overlayOpacity={0.5}
        exitTransitionDuration={150}
        transition="fade"
        title={<ReactMarkdown components={MarkdownComponents}>{dialogData.header}</ReactMarkdown>}
        classNames={{
          modal: classes.modal,
          header: classes.header,
        }}
      >
        <Stack className={classes.contentStack}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              ...MarkdownComponents,
              img: ({ ...props }) => <img style={{ maxWidth: '100%', maxHeight: '100%' }} {...props} />,
            }}
          >
            {dialogData.content}
          </ReactMarkdown>
          <Group position="right" spacing={10}>
            {dialogData.cancel && (
              <Button 
                uppercase 
                className={classes.cancelButton}
                onClick={() => closeAlert('cancel')} 
                mr={3}
              >
                {dialogData.labels?.cancel || locale.ui.cancel}
              </Button>
            )}
            <Button
              uppercase
              className={classes.confirmButton}
              onClick={() => closeAlert('confirm')}
            >
              {dialogData.labels?.confirm || locale.ui.confirm}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};

export default AlertDialog;