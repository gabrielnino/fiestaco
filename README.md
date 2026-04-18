# 🎉 FiestaCo - Modern Taco Kit Configurator

FiestaCo is a Next.js-based interactive taco kit configurator with comprehensive analytics, A/B testing capabilities, and real-time dashboard.

## ✨ Features

- **🎯 Interactive Product Configurator** - Step-by-step taco kit builder
- **📊 Comprehensive Analytics** - SQLite-based event tracking with privacy focus
- **📈 Real-time Dashboard** - Business intelligence with conversion funnel tracking
- **🔧 A/B Testing Ready** - Dynamic pricing and feature experimentation
- **⚡ Performance Optimized** - Next.js 15 with image optimization
- **🔒 Security Hardened** - Input validation, security headers, and audit trails

## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test

# Run TypeScript checks
npm run type-check
```

### Environment Setup

Copy the example environment file:
```bash
cp .env.example .env.local
```

Update `.env.local` with your configuration.

## 📁 Project Structure

```
fiestaco/
├── app/                    # Next.js app router
│   ├── api/               # API routes (analytics, config)
│   ├── dashboard/         # Analytics dashboard
│   └── page.tsx           # Main landing page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── sections/         # Page sections
│   └── layout/           # Layout components
├── lib/                   # Core libraries
│   ├── analytics.ts      # Analytics client
│   ├── constants.ts      # App constants
│   └── db/               # Database utilities
├── features/              # Feature-based modules
├── hooks/                 # Custom React hooks
├── tests/                 # Test suites
└── scripts/               # Utility scripts
```

## 📚 Documentation

### Core Guides
- [**Configuration Guide**](CONFIGURATION-GUIDE.md) - Environment setup and configuration
- [**Performance Guide**](PERFORMANCE-GUIDE.md) - Optimization techniques and benchmarks
- [**Security Guide**](SECURITY-GUIDE.md) - Security practices and hardening
- [**Testing Guide**](TESTING-GUIDE.md) - Testing strategies and coverage

### Deployment & Operations
- [**Deployment Guide**](DEPLOYMENT-GUIDE-ANALYTICS.md) - Production deployment
- [**Migration Guide**](MIGRATION-GUIDE.md) - Database and state migrations
- [**State Migration Guide**](STATE-MIGRATION-GUIDE.md) - State management migrations

### Features
- [**Analytics Dashboard**](DASHBOARD-README.md) - Dashboard usage and metrics
- [**Audio Integration**](audio-integration-guide.md) - Audio player implementation

## 🛠 Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server

# Quality Assurance
npm run lint             # Run ESLint
npm run type-check       # TypeScript type checking
npm run format           # Format code with Prettier

# Testing
npm run test             # Run basic tests
npm run test:extreme     # Extreme testing with coverage
npm run test:integration # Integration tests
npm run test:security    # Security-focused tests
npm run coverage         # Generate test coverage report

# Analysis
npm run analyze          # Bundle size analysis
```

### Testing Strategy

The project uses a comprehensive testing strategy:
- **Unit Tests** - Component and utility testing
- **Integration Tests** - API and data layer testing
- **Performance Tests** - Load and stress testing
- **Security Tests** - Vulnerability and injection testing
- **Extreme Testing** - 100% coverage goal with edge cases

## 🐳 Deployment

### Docker Deployment

```bash
# Simple deployment
./deploy-simple.sh

# Advanced deployment (with timestamps)
./deploy-advanced.sh
```

### Manual Deployment

```bash
# Build Docker image
docker build -t fiestaco:latest .

# Run container
docker run -p 3001:3001 \
  -e NODE_ENV=production \
  -v ./data:/app/data \
  fiestaco:latest
```

## 📊 Analytics System

The built-in analytics system provides:
- **Real-time Event Tracking** - Page views, user interactions, conversions
- **Funnel Analysis** - User journey tracking with drop-off points
- **Revenue Attribution** - UTM tracking and channel performance
- **A/B Testing** - Dynamic configuration for experiments
- **Dashboard** - Real-time business metrics

## 🔧 Configuration

Key configuration areas:
1. **Pricing** - Dynamic pricing through `/api/config/prices`
2. **Analytics** - Event tracking and dashboard access tokens
3. **WhatsApp Integration** - Order notification templates
4. **A/B Testing** - Feature flags and experiment variants

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm run test`
5. Submit a pull request

## 📄 License

Proprietary - All rights reserved

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Analytics powered by SQLite
- Deployment optimized for Docker
- Testing with Jest and React Testing Library
