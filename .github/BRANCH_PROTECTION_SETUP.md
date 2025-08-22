# 🛡️ Branch Protection Setup Instructions

To enable branch protection and ensure PRs can only be merged when all checks pass:

## 1. Go to GitHub Repository Settings

Navigate to: `https://github.com/josemak25/animebox/settings/branches`

## 2. Add Branch Protection Rule for `main`

### Basic Settings

- **Branch name pattern**: `main`
- ✅ **Require a pull request before merging**
  - ✅ Require approvals: `1`
  - ✅ Dismiss stale PR approvals when new commits are pushed
  - ✅ Require review from code owners (if you have CODEOWNERS file)

### Status Checks

- ✅ **Require status checks to pass before merging**
- ✅ **Require branches to be up to date before merging**

**Select these required status checks:**

- `🔍 Code Quality`
- `🧪 Test Suite`
- `✅ All Checks Complete`

### Additional Restrictions

- ✅ **Require signed commits** (recommended)
- ✅ **Include administrators** (applies rules to admins too)
- ✅ **Allow force pushes** ❌ (disable this)
- ✅ **Allow deletions** ❌ (disable this)

## 3. Alternative: Use GitHub CLI (if you have it installed)

```bash
# Enable branch protection
gh api repos/josemak25/animebox/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":\
["🔍 Code Quality","🧪 Test Suite","✅ All Checks Complete"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews=\
'{"required_approving_review_count":1,"dismiss_stale_reviews":true}' \
  --field restrictions=null
```

## 4. Verify Protection is Active

- Try pushing directly to main branch - it should be blocked
- Create a PR and verify all status checks are required

---

## 🎯 What This Achieves

- ✅ **No direct pushes to main** - all changes via PR
- ✅ **All tests must pass** - prevents broken code merging
- ✅ **Code quality enforced** - ESLint and TypeScript checks required
- ✅ **Format consistency** - Prettier formatting validated
- ✅ **Security validation** - dependency audit included

Your main branch is now fully protected! 🛡️
