Practice set row inside a week's ListGroup, with a status icon + line; replaced sets get a Restore button.
```jsx
<SetRow title="Set 1: Heart failure" status="done" detail="Done Sep 24 · 13 of 17 fully right" onClick={run} />
<SetRow title="Set 2: Diuretics" status="replaced" onRestore={ask} />
```
