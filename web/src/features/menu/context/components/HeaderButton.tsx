import { Button, createStyles } from '@mantine/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import LibIcon from '../../../../components/LibIcon';

interface Props {
  icon: IconProp;
  canClose?: boolean;
  iconSize: number;
  handleClick: () => void;
}

const useStyles = createStyles((theme, params: { canClose?: boolean }) => ({
  button: {
    borderRadius: 8,
    flex: '1 15%',
    alignSelf: 'stretch',
    height: 'auto',
    textAlign: 'center',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: theme.colors.dark[4], // accent-bg
    border: `1px solid ${theme.colors.dark[3]}`, // hover-bg border
    transition: 'all 0.2s ease',
    
    '&:hover': {
      backgroundColor: params.canClose === false ? theme.colors.dark[4] : theme.colors.dark[3], // hover-bg
      transform: params.canClose === false ? 'unset' : 'translateY(-1px)',
      boxShadow: params.canClose === false ? 'unset' : '0 4px 16px rgba(0, 0, 0, 0.3)',
    }
  },
  root: {
    border: 'none',
  },
  label: {
    color: params.canClose === false ? theme.colors.dark[2] : theme.colors.dark[0], // primary-text
  },
}));

const HeaderButton: React.FC<Props> = ({ icon, canClose, iconSize, handleClick }) => {
  const { classes } = useStyles({ canClose });

  return (
    <Button
      variant="default"
      className={classes.button}
      classNames={{ label: classes.label, root: classes.root }}
      disabled={canClose === false}
      onClick={handleClick}
    >
      <LibIcon icon={icon} fontSize={iconSize} fixedWidth />
    </Button>
  );
};

export default HeaderButton;