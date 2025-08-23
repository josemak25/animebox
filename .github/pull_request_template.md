# Pull Request

## 📋 Description

<!-- Briefly describe what this PR does and why it's needed -->

## 🔄 Type of Change

<!-- Check the relevant option(s) -->
- [ ] 🐛 Bug fix (non-breaking change that fixes an issue)
- [ ] ✨ New feature (non-breaking change that adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing
  functionality to not work as expected)
- [ ] 📚 Documentation update
- [ ] 🔧 Refactor (no functional changes)
- [ ] 🎨 Style/UI changes
- [ ] ⚡ Performance improvements
- [ ] 🧪 Test improvements
- [ ] 🔨 Build/CI changes

## 🧪 Testing

<!-- Describe the tests you ran and how reviewers can test this -->

### Test Cases

- [ ] All existing tests pass
- [ ] New tests added for new functionality
- [ ] Manual testing completed

### How to Test

<!-- Step-by-step instructions for testing this change -->

1.
2.
3.

## 📱 Screenshots/Demo
<!-- Add screenshots for UI changes or demo for new features -->

### Before
<!-- Screenshots or description of current state -->

### After
<!-- Screenshots or description after changes -->

## ✅ Checklist

<!-- Check all that apply -->

### Code Quality

- [ ] Code follows the project's style guidelines
- [ ] Self-review completed
- [ ] Code is properly commented
- [ ] No console.log statements left in production code

### Testing & Quality

- [ ] All tests pass locally (`npm test`)
- [ ] TypeScript compilation passes (`npm run type-check`)
- [ ] ESLint passes (`npm run lint`)
- [ ] No new TypeScript errors introduced
- [ ] Performance impact considered

### Documentation

- [ ] Documentation updated (if needed)
- [ ] README updated (if needed)
- [ ] API changes documented

### Mobile Specific

- [ ] Tested on iOS simulator/device
- [ ] Tested on Android simulator/device
- [ ] Responsive design verified
- [ ] Accessibility considerations addressed


## 🔗 Related Issue (Required)
<!-- Specify the main issue this PR addresses. Use the format 'Closes #<issue_number>' to enable automation. -->
Closes #
<!-- Example: Closes #42 -->

> **Note:**
>
> - Every PR must reference an issue ID using `Closes #<issue_number>`.
> - The workflow will use this ID to automatically close the issue and keep `.github/issues.md` in sync.
> - If you are addressing multiple issues, list each with `Closes #` or `Related to #` as needed.
>

## 🚨 Breaking Changes
<!-- If this is a breaking change, describe what breaks and migration steps -->
-

## 📝 Additional Notes
<!-- Any additional information, considerations, or context -->

---

## 👀 Review Guidelines for Reviewers

### Focus Areas

- [ ] Code correctness and logic
- [ ] Performance implications
- [ ] Security considerations
- [ ] Mobile UX/UI consistency
- [ ] Error handling
- [ ] Test coverage

### Questions to Consider

- Does this change accomplish what it's supposed to?
- Are there any edge cases not covered?
- Is the code readable and maintainable?
- Are there any performance concerns?
- Does this follow React Native best practices?
