Answer choice for single, priority and select-all questions; covers pre-check and all revealed states.
```jsx
<AnswerOption control="checkbox" state="selected" text="Weigh the client daily" onClick={toggle} />
<AnswerOption state="missed" text="Elevate the head of the bed" reason="Orthopnea eases when upright." />
```
- Revealed states carry an icon AND a caps tag ("Your answer · Correct"), never color alone. Missed uses a dashed border.
