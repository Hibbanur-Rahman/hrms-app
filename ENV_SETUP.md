# Environment Variables Setup

This project uses environment variables for configuration. Follow these steps to set up your environment:

## 1. Create Environment File

Create a `.env` file in the root directory of your project with the following variables:

```env
# API Configuration
API_URL=https://your-api-url.com/api
MAP_API_KEY=your-google-maps-api-key

# Environment
NODE_ENV=development
```

## 2. Environment Variables

### Required Variables

- `API_URL`: Your backend API base URL
- `MAP_API_KEY`: Google Maps API key (if using maps functionality)

### Optional Variables

- `NODE_ENV`: Environment name (development, production, test)

## 3. Usage in Code

### Import Environment Variables

```typescript
import { API_URL, MAP_API_KEY } from '@env';
```

### Use the ENV Configuration Object

```typescript
import { ENV } from './src/config/env';

// Access environment variables
const apiUrl = ENV.API_URL;
const isDevelopment = ENV.IS_DEVELOPMENT;
```

### Validate Environment Variables

```typescript
import { validateEnv } from './src/config/env';

// Call this in your app initialization
validateEnv();
```

## 4. Security Notes

- The `.env` file is already added to `.gitignore` to prevent committing sensitive data
- Never commit your actual API keys or sensitive URLs to version control
- Use different environment files for different environments (development, staging, production)

## 5. Environment-Specific Files

You can create environment-specific files:
- `.env.development` - for development environment
- `.env.production` - for production environment
- `.env.local` - for local overrides (highest priority)

## 6. Troubleshooting

If environment variables are not loading:

1. Make sure the `.env` file is in the root directory
2. Restart the Metro bundler: `npx react-native start --reset-cache`
3. Rebuild your app: `npx react-native run-android` or `npx react-native run-ios`
4. Check that the variable names match exactly (case-sensitive)

## 7. Example Configuration

```env
# Development
API_URL=https://dev-api.hrms.mithilastack.com/api
MAP_API_KEY=dev-google-maps-key
NODE_ENV=development

# Production
API_URL=https://api.hrms.mithilastack.com/api
MAP_API_KEY=prod-google-maps-key
NODE_ENV=production
```
