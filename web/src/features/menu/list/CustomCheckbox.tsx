import { Checkbox, createStyles } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    backgroundColor: theme.colors.dark[6], // primary-bg
    border: `2px solid ${theme.colors.dark[4]}`, // accent-bg border
    borderRadius: 4,
    
    '&:checked': { 
      backgroundColor: '#10b981', 
      borderColor: '#10b981',
    },
    
    '&:hover': {
      borderColor: theme.colors.dark[3], // hover-bg
    }
  },
  inner: {
    '> svg > path': {
      fill: '#ffffff',
    },
  },
}));

const CustomCheckbox: React.FC<{ checked: boolean }> = ({ checked }) => {
  const { classes } = useStyles();
  return (
    <Checkbox
      checked={checked}
      size="md"
      classNames={{ root: classes.root, input: classes.input, inner: classes.inner }}
    />
  );
};

export default CustomCheckbox;