## [2.1.1](https://github.com/ArlindMaliqi/feedback-report/compare/v2.1.0...v2.1.1) (2025-06-14)


### Bug Fixes

* optimize localization with bundle size reduction ([330c6a0](https://github.com/ArlindMaliqi/feedback-report/commit/330c6a00d5c520a4700f1b09ccf41e27098ebb2d))

# [2.1.0](https://github.com/ArlindMaliqi/feedback-report/compare/v2.0.0...v2.1.0) (2025-06-14)


### Features

* Add missing dependency and optimize webpack externals configuration ([2981af8](https://github.com/ArlindMaliqi/feedback-report/commit/2981af813597f51927c317c8bc443a3ad6a36764))

# [2.0.0](https://github.com/ArlindMaliqi/feedback-report/compare/v1.5.0...v2.0.0) (2025-06-14)


### Bug Fixes

* resolve TypeScript errors and improve type safety in UserIdentityFields ([6727d67](https://github.com/ArlindMaliqi/feedback-report/commit/6727d6707c8249273bb07e014b09bafbcdf66cba))


### Features

* Add comprehensive integrations and developer experience improvements ([d1f79ef](https://github.com/ArlindMaliqi/feedback-report/commit/d1f79ef97ea6f5aa349886d51787a0166151e8ed))
* add comprehensive JSDoc documentation and clean up TypeScript errors ([170236e](https://github.com/ArlindMaliqi/feedback-report/commit/170236e13871f450f73de340b73ca45eb21ad6cc))


### BREAKING CHANGES

* Updated TypeScript types may require type assertion updates in consuming applications

# [1.5.0](https://github.com/ArlindMaliqi/feedback-report/compare/v1.4.0...v1.5.0) (2025-06-14)

### Features

* **core:** Add comprehensive integrations and developer experience improvements ([ab58dd1](https://github.com/ArlindMaliqi/feedback-report/commit/ab58dd10075a155cb8621d13dce619ba4b4fd637))
  - Analytics integration with Google Analytics, Segment, Mixpanel, and custom providers
  - Issue tracker integration supporting GitHub, Jira, GitLab, and Azure DevOps
  - Webhook support for custom endpoints with payload signing
  - Chat platform notifications for Slack, Teams, and Discord
  - Comprehensive localization support with RTL language capabilities
  - Testing utilities with mock helpers and React Testing Library integration
  - Storybook configuration with component documentation and visual testing
  - Framework-specific examples for Next.js, Gatsby, and Remix
  - Specialized hooks: useFeedbackHistory and useFeedbackAnalytics
  - Performance optimizations with bundle size optimization and lazy loading
  - SSR-compatible components with proper hydration handling
  - Professional TypeScript type definitions for all integrations

### Performance

* **bundle:** Add code splitting and tree-shaking optimization
  - Lazy loading of components only when needed
  - Bundle size analysis and monitoring tools
  - Performance monitoring with Core Web Vitals tracking
  - Memory leak prevention and cleanup mechanisms

### Developer Experience

* **testing:** Complete testing utilities and Storybook integration
* **docs:** Comprehensive documentation and API reference
* **types:** Professional TypeScript definitions throughout
* **examples:** Framework-specific implementation guides

# [1.4.0](https://github.com/ArlindMaliqi/feedback-report/compare/v1.3.2...v1.4.0) (2025-06-14)


### Features

* Add comprehensive feedback functionality with attachments, categories, and offline support ([4671d40](https://github.com/ArlindMaliqi/feedback-report/commit/4671d40e7f5ea56e720fc45a0d8055693b304f62))

## [1.3.2](https://github.com/ArlindMaliqi/feedback-report/compare/v1.3.1...v1.3.2) (2025-06-14)


### Bug Fixes

* update GitHub Packages publishing configuration ([58b7637](https://github.com/ArlindMaliqi/feedback-report/commit/58b7637d073c417f9867de87b3ce59a5101eab8f))

## [1.3.1](https://github.com/ArlindMaliqi/feedback-report/compare/v1.3.0...v1.3.1) (2025-06-13)


### Bug Fixes

* resolve React hooks order violation and setup GitHub Packages publishing ([3489495](https://github.com/ArlindMaliqi/feedback-report/commit/3489495665be6e2f5467236b370284f1ce3b30d7))

# [1.3.0](https://github.com/ArlindMaliqi/feedback-report/compare/v1.2.1...v1.3.0) (2025-06-13)


### Features

* add GitHub Packages publishing and enhance release workflow ([ae9058e](https://github.com/ArlindMaliqi/feedback-report/commit/ae9058e5022ad921e4c9199bb4dffb80293ebc72))

## [1.2.1](https://github.com/ArlindMaliqi/feedback-report/compare/v1.2.0...v1.2.1) (2025-06-11)


### Bug Fixes

* function layers updated ([565a655](https://github.com/ArlindMaliqi/feedback-report/commit/565a6558880e364797cdbfd70f31f29d78569308))

# [1.2.0](https://github.com/ArlindMaliqi/feedback-report/compare/v1.1.0...v1.2.0) (2025-06-11)


### Features

* add comprehensive modal styling customization system ([b39bbcf](https://github.com/ArlindMaliqi/feedback-report/commit/b39bbcf65fbb94ac268daed09da656a42858a8d7))

# [1.1.0](https://github.com/ArlindMaliqi/feedback-report/compare/v1.0.0...v1.1.0) (2025-06-10)


### Bug Fixes

* resolve ESLint configuration and add missing dependencies ([3415e19](https://github.com/ArlindMaliqi/feedback-report/commit/3415e19c1fa4e9a12729c0bc5aaceec98fab4ce2))


### Features

* initial release of React feedback widget with automated CI/CD ([7a09a4e](https://github.com/ArlindMaliqi/feedback-report/commit/7a09a4e43fa33fbed68d0bfa2b9ff089e3bd9503))
* setup automated release pipeline with semantic-release ([ac125f5](https://github.com/ArlindMaliqi/feedback-report/commit/ac125f5577bd1b7fa313291dc6c477d2e52c9d34))
* setup project structure with TypeScript and ESLint configuration ([b4729f6](https://github.com/ArlindMaliqi/feedback-report/commit/b4729f614def7fa325f27800db5250aad1283fa1))
