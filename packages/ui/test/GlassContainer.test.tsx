import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GlassContainer } from '../src/components/GlassContainer';

describe('GlassContainer', () => {
  it('renders children correctly', () => {
    render(
      <GlassContainer>
        <div>Test Content</div>
      </GlassContainer>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies correct styles based on props', () => {
    const { container } = render(
      <GlassContainer
        opacity={0.5}
        blur={10}
        border={true}
        dark={true}
        performance="high"
      >
        <div>Test Content</div>
      </GlassContainer>
    );

    const glassContainer = container.firstChild as HTMLElement;
    const styles = window.getComputedStyle(glassContainer);

    expect(styles.backgroundColor).toBe('rgba(15, 23, 42, 0.8)');
    expect(styles.backdropFilter).toBe('blur(10px)');
    expect(styles.border).toBe('1px solid rgba(255, 255, 255, 0.1)');
  });

  it('renders reflection element only when performance is high', () => {
    const { container: highPerf } = render(
      <GlassContainer performance="high">
        <div>Test Content</div>
      </GlassContainer>
    );

    const { container: lowPerf } = render(
      <GlassContainer performance="low">
        <div>Test Content</div>
      </GlassContainer>
    );

    expect(highPerf.querySelector('.glass-reflection')).toBeInTheDocument();
    expect(lowPerf.querySelector('.glass-reflection')).not.toBeInTheDocument();
  });

  it('merges custom className with default class', () => {
    const { container } = render(
      <GlassContainer className="custom-class">
        <div>Test Content</div>
      </GlassContainer>
    );

    const glassContainer = container.firstChild as HTMLElement;
    expect(glassContainer.className).toContain('glass-container');
    expect(glassContainer.className).toContain('custom-class');
  });

  it('handles accent color properly', () => {
    const { container } = render(
      <GlassContainer
        performance="high"
        accentColor="#6366f1"
      >
        <div>Test Content</div>
      </GlassContainer>
    );

    const reflection = container.querySelector('.glass-reflection') as HTMLElement;
    const styles = window.getComputedStyle(reflection);
    expect(styles.background).toContain('rgba(99, 102, 241, 0.1)');
  });
});