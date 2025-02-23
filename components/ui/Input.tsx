import { TextInput, TextInputProps, createStyles } from '@mantine/core';
import { forwardRef } from 'react';

const useStyles = createStyles((theme) => ({
  root: {
    '& input': {
      borderRadius: theme.radius.md,
      border: `1px solid ${theme.colors.dark[2]}`,
      fontSize: '0.875rem',
      transition: 'all 150ms',
      '&:hover': {
        borderColor: theme.colors.dark[3],
      },
      '&:focus': {
        borderColor: theme.colors.blue[6],
        boxShadow: `0 0 0 2px ${theme.colors.blue[1]}`,
      },
    },
    '& label': {
      fontSize: '0.875rem',
      marginBottom: '0.25rem',
      color: theme.colors.dark[7],
    },
  },
  error: {
    '& input': {
      borderColor: theme.colors.red[6],
      '&:focus': {
        borderColor: theme.colors.red[6],
        boxShadow: `0 0 0 2px ${theme.colors.red[1]}`,
      },
    },
    '& label': {
      color: theme.colors.red[6],
    },
  },
}));

export const Input = forwardRef<HTMLInputElement, TextInputProps>(
  ({ className, error, ...props }, ref) => {
    const { classes, cx } = useStyles();

    return (
      <TextInput
        ref={ref}
        className={cx(classes.root, { [classes.error]: error }, className)}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
