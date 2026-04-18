# Contributing to FiestaCo

Thank you for your interest in contributing to FiestaCo! This document provides guidelines and instructions for contributors.

## 🚀 Development Workflow

### 1. Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/your-org/fiestaco.git
cd fiestaco

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

### 2. Code Standards

#### TypeScript
- Use strict TypeScript configuration
- Define explicit types for all function parameters and return values
- Avoid `any` type unless absolutely necessary
- Use interfaces for component props

#### React/Next.js
- Use functional components with hooks
- Follow Next.js 15+ conventions
- Implement proper error boundaries
- Use `next/image` for image optimization

#### Styling
- Use inline styles for dynamic styling
- Follow the existing color scheme from `lib/constants.ts`
- Ensure responsive design for mobile/desktop

### 3. Testing Requirements

All contributions must include appropriate tests:

```bash
# Run tests before submitting
npm run test
npm run type-check
npm run lint

# For specific test types:
npm run test:integration    # API and integration tests
npm run test:security       # Security-focused tests
npm run test:performance    # Performance benchmarks
```

### 4. Commit Guidelines

Use conventional commit messages:

```
feat: add new flavor selection component
fix: resolve image optimization issue
docs: update deployment guide
test: add unit tests for analytics module
refactor: simplify pricing configuration
chore: update dependencies
```

### 5. Pull Request Process

1. **Create a branch** from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following code standards

3. **Run tests** to ensure nothing is broken
   ```bash
   npm run test
   npm run type-check
   npm run lint
   ```

4. **Update documentation** if needed

5. **Submit PR** with:
   - Clear description of changes
   - Reference to related issues
   - Test results screenshot
   - Checklist of completed items

### 6. Code Review Checklist

Before requesting review, ensure:

- [ ] All tests pass
- [ ] TypeScript has no errors
- [ ] ESLint has no warnings
- [ ] Code follows project patterns
- [ ] Documentation is updated
- [ ] No sensitive data is committed
- [ ] Performance considerations addressed

## 🏗️ Architecture Guidelines

### Project Structure
- `app/` - Next.js app router pages and API routes
- `components/` - Reusable React components
- `lib/` - Core utilities and business logic
- `features/` - Feature-based modules (experimental)
- `hooks/` - Custom React hooks
- `tests/` - Test suites

### Adding New Features

1. **Analyze Requirements** - Document the feature specification
2. **Design API** - Define endpoints and data structures
3. **Implement Core** - Business logic in `lib/` directory
4. **Create Components** - UI in `components/` directory
5. **Add Tests** - Comprehensive test coverage
6. **Update Documentation** - Guides and API documentation

### Analytics Integration

All user interactions should be tracked:

```typescript
import { analytics } from '@/lib/analytics';

// Track user actions
analytics.flavorSelect(flavorId);
analytics.stepVisit(stepNumber);
analytics.whatsappClick(orderData);
```

## 🔧 Development Tools

### Available Scripts

```bash
# Development
npm run dev              # Development server
npm run build            # Production build
npm run start            # Production server

# Quality
npm run lint             # ESLint
npm run type-check       # TypeScript
npm run format           # Prettier formatting

# Testing
npm run test             # Basic tests
npm run test:extreme     # Full coverage
npm run test:ci          # CI/CD pipeline tests
npm run coverage         # Coverage report

# Analysis
npm run analyze          # Bundle analysis
```

### Debugging

1. **Component Debugging** - Use React DevTools
2. **API Debugging** - Check browser network tab
3. **Analytics Debugging** - View SQLite database
4. **Performance Debugging** - Use `npm run analyze`

## 📝 Documentation

### Required Documentation

- [ ] Code comments for complex logic
- [ ] JSDoc for public APIs
- [ ] Component prop documentation
- [ ] Update relevant guide files
- [ ] API endpoint documentation

### Documentation Locations

- `README.md` - Project overview
- `CONFIGURATION-GUIDE.md` - Setup and configuration
- `PERFORMANCE-GUIDE.md` - Optimization guidelines
- `SECURITY-GUIDE.md` - Security practices
- `TESTING-GUIDE.md` - Testing strategies

## 🐛 Issue Reporting

When reporting issues:

1. **Check existing issues** - Avoid duplicates
2. **Provide details** - Steps to reproduce, expected vs actual behavior
3. **Include environment** - OS, Node version, browser
4. **Add screenshots** - Visual evidence when applicable

## ❓ Questions?

- Check existing documentation first
- Review similar implementations in codebase
- Ask in PR discussions
- Reference relevant guide files

## 🙏 Thank You!

Your contributions help make FiestaCo better for everyone. We appreciate your time and effort!