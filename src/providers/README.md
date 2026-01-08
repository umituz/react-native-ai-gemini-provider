# Provider Configuration

Tier-based AI provider configuration system. Manages model selection, cost optimization, and quality preferences based on subscription tier.

## 📍 Import Path

```
import {
  providerFactory,
  resolveProviderConfig,
  getCostOptimizedConfig,
  getQualityOptimizedConfig
} from '@umituz/react-native-ai-gemini-provider';
```

## 🎯 Purpose

Use this system to configure AI provider based on subscription tier and user preferences. Automates model selection and optimization.

**When to use:**
- Initialize AI provider for application
- Configure models based on user tier
- Optimize costs or quality
- Manage runtime configuration updates
- Implement tier-based features

## 📌 Strategy

Different users need different configurations. This system:
- Selects appropriate models for subscription tier
- Balances cost vs quality
- Provides runtime configuration updates
- Supports optimization strategies
- Manages provider lifecycle

**Key Decision**: Use tier-based configuration to provide different experiences for free vs premium users while optimizing costs.

## ⚠️ Rules

### Usage Rules
- **MUST** initialize provider before any operations
- **SHOULD** select appropriate tier for user
- **MUST** provide valid API key
- **SHOULD** configure preferences appropriately
- **MUST NOT** reinitialize unnecessarily

### Configuration Rules
- **MUST** use valid subscription tier ("free" | "premium")
- **SHOULD** set quality preference appropriately
- **MUST** provide API key (required field)
- **SHOULD** configure retry limits
- **MUST NOT** use invalid model IDs

### Tier Rules
- **FREE tier**: Faster models, limited retries
- **PREMIUM tier**: Higher quality, more retries
- **SHOULD** match tier to user subscription
- **MUST** update config when tier changes
- **SHOULD** optimize based on tier

### Strategy Rules
- **COST strategy**: Cheapest models, no retries
- **QUALITY strategy**: Best models, more retries
- **BALANCED strategy**: Tier-based defaults
- **SHOULD** select strategy based on environment
- **MUST** align strategy with business goals

## 🤖 AI Agent Guidelines

### When Modifying Provider System
1. **READ** existing configuration code first
2. **UNDERSTAND** tier-based logic
3. **MAINTAIN** backward compatibility
4. **ADD** tests for new configurations
5. **UPDATE** documentation

### When Adding New Tiers
1. **CHECK** business requirements
2. **DEFINE** tier configuration
3. **UPDATE** resolution logic
4. **TEST** tier transitions
5. **DOCUMENT** tier differences

### When Adding Optimization Strategies
1. **ANALYZE** cost/quality tradeoffs
2. **DEFINE** strategy rules
3. **IMPLEMENT** selection logic
4. **TEST** strategy effectiveness
5. **DOCUMENT** strategy use cases

### Code Style Rules
- **USE** factory pattern for provider
- **VALIDATE** configuration inputs
- **THROW** typed errors for invalid config
- **LOG** configuration changes
- **COMMENT** complex logic only

## 📦 Available Functions

### `providerFactory.initialize(options)`

Initialize provider with configuration.

**Refer to**: [`ProviderFactory.ts`](./ProviderFactory.ts)

### `providerFactory.getConfig()`

Get current provider configuration.

**Refer to**: [`ProviderFactory.ts`](./ProviderFactory.ts)

### `providerFactory.isInitialized()`

Check if provider is initialized.

**Refer to**: [`ProviderFactory.ts`](./ProviderFactory.ts)

### `providerFactory.updateConfig(updates)`

Update configuration at runtime.

**Refer to**: [`ProviderFactory.ts`](./ProviderFactory.ts)

### `resolveProviderConfig(input)`

Resolve configuration based on tier and preferences.

**Refer to**: [`ProviderConfig.ts`](./ProviderConfig.ts)

### `getCostOptimizedConfig(input)`

Get cost-optimized configuration.

**Refer to**: [`ProviderConfig.ts`](./ProviderConfig.ts)

### `getQualityOptimizedConfig(input)`

Get quality-optimized configuration.

**Refer to**: [`ProviderConfig.ts`](./ProviderConfig.ts)

## 🔗 Related Modules

- **Core Client**: [`../infrastructure/services/CORE_CLIENT_SERVICE.md`](../infrastructure/services/CORE_CLIENT_SERVICE.md)
- **Domain Types**: [`../domain/README.md`](../domain/README.md)
- **Services**: [`../infrastructure/services/README.md`](../infrastructure/services/README.md)

## 📋 Configuration Reference

### Subscription Tiers

**FREE** - Free tier users
- Faster models (gemini-2.5-flash)
- Limited retries (1)
- Shorter timeout (30s)

**PREMIUM** - Premium tier users
- Higher quality models (gemini-3-pro-image)
- More retries (2)
- Longer timeout (60s)

### Quality Preferences

**FAST** - Fast responses
- Uses fastest models

**BALANCED** - Balanced approach
- Uses tier default models

**HIGH** - High quality
- Uses best available models

### Optimization Strategies

**COST** - Minimize cost
- Cheapest models only
- No retries
- Use for: Development, testing

**QUALITY** - Maximize quality
- Best models
- More retries
- Use for: Production, critical operations

**BALANCED** - Tier-based defaults
- Tier-appropriate models
- Standard retries
- Use for: General usage

## 🎓 Usage Patterns

### Basic Initialization
1. Import `providerFactory`
2. Call `initialize()` with API key and tier
3. Verify initialization
4. Use AI services normally
5. Handle errors appropriately

### Tier-Based Configuration
1. Determine user subscription tier
2. Initialize with appropriate tier
3. System selects appropriate models
4. User gets tier-appropriate experience
5. Update config when tier changes

### Runtime Updates
1. User upgrades/downgrades subscription
2. Call `updateConfig()` with new tier
3. Provider updates without reinitialization
4. New models take effect immediately
5. Continue operations normally

### Environment-Specific Strategy
1. Check environment (dev/staging/prod)
2. Select appropriate strategy
3. Initialize with strategy
4. Dev uses cost strategy
5. Prod uses quality strategy

### Preference-Based Configuration
1. Get user preferences from storage
2. Configure quality preference
3. Initialize with preferences
4. System selects models accordingly
5. User gets preferred experience

## 🚨 Common Pitfalls

### Don't
- Initialize provider multiple times
- Use wrong tier for user
- Skip API key validation
- Ignore tier changes
- Use invalid model IDs

### Do
- Initialize once at startup
- Match tier to user subscription
- Update config when tier changes
- Validate configuration
- Use appropriate strategies
- Handle initialization errors

---

**Last Updated**: 2025-01-08
**See Also**: [AI_GUIDELINES.md](../../AI_GUIDELINES.md)
