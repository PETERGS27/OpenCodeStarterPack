# Debug Prompt

## Systematic debugging workflow

### 1. Reproduce
- What's the exact error/behavior?
- What were the inputs? Expected vs actual output?
- Can it be reproduced consistently?

### 2. Isolate
- Find the minimal reproduction case
- Binary search: comment out half the code, see if error persists
- Find the exact line/commit that introduced the bug

### 3. Hypothesize
- Based on the symptoms, what could cause this?
- List 2-3 hypotheses ranked by likelihood
- For each: what would confirm or rule it out?

### 4. Test
- Check logs, error messages, stack traces
- Add debug output if needed
- Test each hypothesis
- Document what was tried and what was found

### 5. Fix
- Once root cause is identified, propose the fix
- Explain why the fix works (not just what changed)
- Verify the fix doesn't break existing tests

### 6. Prevent
- How to prevent this class of bugs in the future?
- Additional tests? Linting rules? Type safety?
