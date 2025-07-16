# B2B Property Booking System - Server

This is the backend server for the B2B Property Booking System.

## Environment Variables

Create a `.env` file in the root of the server directory with the following variables:

```
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGO_URI=mongodb+srv://yourusername:yourpassword@cluster.mongodb.net/

# JWT Configuration
JWT_SECRET=your_jwt_secret_here

# Email Configuration (for Nodemailer)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-email-password
ADMIN_EMAIL=admin@example.com
ADMIN_URL=http://localhost:3000/admin

# Twilio Configuration (if using)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_NUMBER=+14155238886
ADMIN_WHATSAPP_NUMBER=+1234567890
```

## Email Notifications

The system uses Nodemailer to send email notifications in the following scenarios:

1. When a new user registers
2. When a new booking is created
3. When a contact form is submitted

### SMTP Configuration

For email functionality to work properly, you need to configure the following environment variables:

- `SMTP_HOST`: Your SMTP server host (e.g., smtp.gmail.com)
- `SMTP_PORT`: Your SMTP server port (typically 587 for TLS or 465 for SSL)
- `SMTP_USER`: Your email address
- `SMTP_PASS`: Your email password or app password (for Gmail, you'll need to create an app password)
- `ADMIN_EMAIL`: The email address where admin notifications will be sent

## Installation and Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with the required variables
4. Start the development server:
   ```
   npm run dev
   ```

## API Routes

- `/api/auth` - Authentication routes
- `/api/users` - User management
- `/api/agency` - Agency profile management
- `/api/hotels` - Hotel management
- `/api/rooms` - Room management
- `/api/bookings` - Booking management
- `/api/discounts` - Discount management
- `/api/contacts` - Contact form submissions
- `/api/payments` - Payment processing 