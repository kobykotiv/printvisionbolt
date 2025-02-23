import { Card as MantineCard, CardProps, createStyles } from '@mantine/core';
import { forwardRef } from 'react';

const useStyles = createStyles((theme) => ({
  root: {
    backgroundColor: 'white',
    borderRadius: theme.radius.lg,
    border: `1px solid ${theme.colors.dark[1]}`,
    transition: 'all 150ms',
    '&:hover': {
      boxShadow: theme.shadows.md,
    },
  },
  withHover: {
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows.lg,
    },
  },
}));

interface CustomCardProps extends CardProps {
  hoverable?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CustomCardProps>(
  ({ hoverable, className, ...props }, ref) => {
    const { classes, cx } = useStyles();

    return (
      <MantineCard
        ref={ref}
        className={cx(
          classes.root,
          { [classes.withHover]: hoverable },
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';
