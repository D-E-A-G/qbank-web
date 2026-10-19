Inset grouped list (iOS Form/List style) with hairline separators; ListRow is its row. Settings, Admin, week groups on Course.
```jsx
<ListGroup header="Account" footer="Passkeys use Face ID or Touch ID.">
  <ListRow icon="key-round" title="Passkeys" value="2" chevron onClick={...} />
  <ListRow icon="log-out" title="Sign out" destructive />
</ListGroup>
```
- Any child works (SetRow, WeekCheckboxRow) — separators are inserted automatically.
