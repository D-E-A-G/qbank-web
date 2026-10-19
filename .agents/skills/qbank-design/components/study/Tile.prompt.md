Course-level entry tile; three in a row: Exam, N to review, N terms.
```jsx
<div style={{display:'flex',gap:10}}>
  <Tile icon="timer" label="Exam" detail="40 in 60 min" emphasis />
  <Tile icon="inbox" value={12} label="to review" />
  <Tile icon="book-open" value={58} label="terms" />
</div>
```
