#!/bin/sh

# Stash any changes that aren't part of this commit
git stash -q --keep-index

echo "🔍 Running pre-commit checks..."

# Run type checking
echo "Running type check..."
bun run type-check || {
    echo "❌ Type check failed. Please fix errors before committing."
    git stash pop -q
    exit 1
}

# Run lint
echo "Running lint..."
bun run lint || {
    echo "❌ Lint failed. Please fix errors before committing."
    git stash pop -q
    exit 1
}

# Run tests
echo "Running tests..."
bun run test || {
    echo "❌ Tests failed. Please fix errors before committing."
    git stash pop -q
    exit 1
}

# Build packages
echo "Building packages..."
bun run build || {
    echo "❌ Build failed. Please fix errors before committing."
    git stash pop -q
    exit 1
}

# Pop stashed changes
git stash pop -q

echo "✅ All checks passed!"
exit 0