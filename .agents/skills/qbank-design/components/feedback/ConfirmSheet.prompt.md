Asks before anything destructive: Replace set, Restore, Clear review list, End exam, Repair, passkey offer.
```jsx
<ConfirmSheet title="Clear all 12 questions from this course's Review list?" message="Your answers and scores are kept."
  actions={[{label:'Clear',variant:'destructive'},{label:'Cancel'}]} />
```
