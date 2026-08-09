# Step-by-Step Explanation (Simple English)

## What the program does

It checks if the brackets `()`, `[]`, `{}` in a string are balanced — meaning every opening bracket has a matching closing bracket, and they close in the right order (like nested boxes: the last box you opened must be the first one you close).

## Step 1: Set up two helpers

```python
stack = []
pairs = {')': '(', ']': '[', '}': '{'}
```

- `stack` — an empty list. We'll use it like a stack of plates: you can only add or remove from the top.
- `pairs` — a dictionary that says "this closing bracket belongs to this opening bracket." For example, `)` belongs to `(`.

## Step 2: Go through the string one character at a time

```python
for char in s:
```

We look at each character in the input string, left to right, one at a time.

## Step 3: If it's an opening bracket, save it

```python
    if char in '([{':
        stack.append(char)
```

- If the character is `(`, `[`, or `{`, we **push** it onto the stack — just place it on top.
- This means: "remember this bracket is open and still waiting to be closed."

## Step 4: If it's a closing bracket, check it matches

```python
    elif char in ')]}':
        if not stack or stack[-1] != pairs[char]:
            return False
        stack.pop()
```

- If the character is `)`, `]`, or `}`, we need to check if it correctly closes the most recent open bracket.
- **`stack[-1]`** means "look at the top item of the stack" (the most recently opened bracket).
- Two ways this can go wrong:
  1. **`not stack`** — the stack is empty, meaning there's no open bracket at all to close. Example: seeing `)` with nothing opened yet.
  2. **`stack[-1] != pairs[char]`** — the top of the stack doesn't match. Example: top is `[` but we're trying to close with `)`.
- If either problem happens → return `False` immediately. The string is invalid.
- If it matches correctly → `stack.pop()` removes that opening bracket from the stack, since it's now properly closed.

## Step 5: After checking the whole string, check if anything's left open

```python
    return len(stack) == 0
```

- If the stack is **empty** at the end, every bracket that was opened also got closed properly → return `True`.
- If anything is **still sitting in the stack**, it means some bracket was opened but never closed → return `False`.

## Step 6: Run some tests

```python
print(is_valid("([{}])"))   # True
print(is_valid("([)]"))     # False
```

### Trace 1: `"([{}])"`

| Step | char | What happens | Stack |
|---|---|---|---|
| 1 | `(` | opening → push | `(` |
| 2 | `[` | opening → push | `( [` |
| 3 | `{` | opening → push | `( [ {` |
| 4 | `}` | closing → matches top `{` → pop | `( [` |
| 5 | `]` | closing → matches top `[` → pop | `(` |
| 6 | `)` | closing → matches top `(` → pop | (empty) |

End of string → stack is empty → **`True`**

### Trace 2: `"([)]"`

| Step | char | What happens | Stack |
|---|---|---|---|
| 1 | `(` | opening → push | `(` |
| 2 | `[` | opening → push | `( [` |
| 3 | `)` | closing → top is `[`, but `)` needs `(` → **mismatch** → return `False` right away | — |

Stops immediately → **`False`**

## One-line summary

**Every time you open a bracket, remember it on top of a pile; every time you close one, it must match whatever's on top of that pile — if it doesn't match, or the pile's empty, the string is invalid.**