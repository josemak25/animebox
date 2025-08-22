# Copilot PR Template Validation Rules

<!--
This document defines the validation rules and patterns used by the automated
GitHub Copilot code review system to ensure PR templates are properly filled
and contain all necessary information for effective code reviews.

Purpose:
- Enforce consistent PR template usage across the AnimeBOX project
- Ensure all critical information is provided for efficient reviews
- Maintain high code quality standards through structured PR descriptions
- Automate quality checks to reduce manual review overhead

Usage:
This file is referenced by the auto-request-copilot.yml workflow to validate
incoming pull requests against established project standards.
-->

## Required PR Template Sections

When reviewing PRs, ensure the following sections are present and properly filled:

### 1. 📋 Description

- Must not be empty
- Should clearly explain what the PR does and why
- Should reference related issues if applicable

### 2. 🔄 Type of Change

- At least one checkbox must be selected
- Should match the actual changes made
- Breaking changes must be clearly marked

### 3. 🧪 Testing

- Test cases section must be filled
- "How to Test" should provide clear steps
- New functionality requires new tests

### 4. ✅ Checklist

- All relevant items should be checked
- Code quality items are mandatory
- Testing & Quality section must be complete
- Documentation updates required for API changes

## Validation Patterns

```regex
# Required sections (case-insensitive)
- ## 📋 Description
- ## 🔄 Type of Change
- ## 🧪 Testing
- ## ✅ Checklist

# At least one type of change should be checked
- \[x\].*(?:Bug fix|New feature|Breaking change|Documentation|Refactor|Style|Performance|Test|Build)

# Testing section should not be empty
- How to Test.*\n\n1\.

# Code quality checklist items should be checked
- \[x\].*Code follows.*style guidelines
- \[x\].*Self-review completed
```

## Review Comments for Template Violations

### Missing Description

```markdown
**Template Issue**: The PR description is missing or empty.

Please provide a clear description of:

- What changes are being made
- Why these changes are needed
- Any relevant context or background

This helps reviewers understand the purpose and scope of your changes.
```

### No Type Selected

```markdown
**Template Issue**: No type of change has been selected.

Please check at least one option in the "🔄 Type of Change" section:

- 🐛 Bug fix
- ✨ New feature
- 💥 Breaking change
- 📚 Documentation update
- 🔧 Refactor
- etc.

This helps categorize and prioritize the review.
```

### Missing Test Information

```markdown
**Template Issue**: Testing information is incomplete.

Please provide:

1. Clear testing steps in "How to Test"
2. Check appropriate boxes in "Test Cases"
3. Add new tests for new functionality

This ensures changes can be properly verified.
```

### Incomplete Checklist

```markdown
**Template Issue**: Required checklist items are not completed.

Please ensure these mandatory items are checked:

- [ ] Code follows the project's style guidelines
- [ ] Self-review completed
- [ ] All tests pass locally
- [ ] TypeScript compilation passes
- [ ] ESLint passes

These checks help maintain code quality standards.
```
