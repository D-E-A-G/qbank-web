import React from 'react';

// Tiny pressed-state hook shared by tappable components (no CSS needed).
export function usePress(disabled) {
  const [pressed, setPressed] = React.useState(false);
  if (disabled) return [false, {}];
  return [pressed, {
    onPointerDown: () => setPressed(true),
    onPointerUp: () => setPressed(false),
    onPointerLeave: () => setPressed(false),
    onPointerCancel: () => setPressed(false),
  }];
}
