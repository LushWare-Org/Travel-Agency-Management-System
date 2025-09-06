# Environment Configuration

This project uses environment variables for configuration. Follow these steps to set up your environment:

## Development Setup

1. Copy the example file:
   ```bash
   cp .env.development.example .env.development
   ```

2. Update the values in `.env.development` for your local development environment.

## Production Setup

1. Copy the example file:
   ```bash
   cp .env.production.example .env.production
   ```

2. Update the values in `.env.production` for your production environment.

## Available Environment Variables

- `VITE_API_BASE_URL`: The base URL for API requests
  - Development: `http://localhost:5001/api`
  - Production: `https://api.islekeyholidays.com/api`

## Important Notes

- Never commit actual `.env` files to the repository
- Use the `.env.*.example` files as templates
- Environment files are automatically ignored by git (see `.gitignore`)
