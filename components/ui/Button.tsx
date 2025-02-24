import { Button as MantineButton, ButtonProps, createStyles } from '@mantine/core';
import { forwardRef } from 'react';

const useStyles = createStyles((theme) => ({
  root: {
    fontWeight: 500,
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    transition: 'all 150ms',
    '&:hover': {
      transform: 'translateY(-1px)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
  },
  primary: {
    backgroundColor: theme.colors.blue[6],
    color: 'white',
    '&:hover': {
      backgroundColor: theme.colors.blue[7],
    },
  },
  secondary: {
    backgroundColor: theme.colors.dark[6],
    color: 'white',
    '&:hover': {
      backgroundColor: theme.colors.dark[7],
    },
  },
  outline: {
    borderColor: theme.colors.blue[6],
    color: theme.colors.blue[6],
    '&:hover': {
      backgroundColor: theme.colors.blue[0],
    },
  },
  ghost: {
    '&:hover': {
      backgroundColor: theme.colors.dark[0],
    },
  },
}));

export interface CustomButtonProps extends ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
}

export const Button = forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ variant = 'primary', className, ...props }, ref) => {
    const { classes, cx } = useStyles();

    return (
      <MantineButton
        ref={ref}
        className={cx(classes.root, classes[variant], className)}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
