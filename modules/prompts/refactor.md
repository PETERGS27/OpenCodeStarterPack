# Refactor Prompt

## Safe refactoring workflow

### 1. Understand
- What does the code do? Read all related code paths
- What are the inputs, outputs, and side effects?
- Are there existing tests? If not, note this risk

### 2. Plan
- What's the goal of this refactor? (readability, performance, extensibility)
- Break into small, reversible steps
- Each step should preserve behavior exactly

### 3. Transform (one step at a time)
- Extract repeated code into functions
- Simplify conditionals
- Rename for clarity
- Split large functions
- Each transformation is its own commit

### 4. Verify
- After each step: run tests
- If no tests exist, run the code to verify behavior
- Check for regressions

### 5. Review
- Is the result cleaner than the original?
- Is it easier to understand and modify?
- Did we introduce any new dependencies or complexity?

### Don't do
- Don't refactor and add features at the same time
- Don't change public API without clear migration path
- Don't optimize prematurely
