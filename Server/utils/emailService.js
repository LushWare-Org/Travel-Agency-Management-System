const { generateBookingVoucher, generatePaymentInvoice } = require('./bookingPdfGenerator');
const { generatePaymentVoucher } = require('./paymentVoucherGenerator');
const nodemailer = require('nodemailer');
const twilio = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Email templates
const templates = {
  agentApproval: (userEmail) => ({
    from: process.env.SMTP_USER,
    to: userEmail,
    subject: 'Your Account Has Been Approved',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1976d2; text-align: center;">Welcome to Our Platform!</h1>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
          <p>Dear User,</p>
          <p>We are pleased to inform you that your account has been approved and you are now an agent on our platform.</p>
          <p>You can now log in and start using all the features available to agents, including:</p>
          <ul>
            <li>Managing your agency profile</li>
            <li>Viewing and managing bookings</li>
            <li>Accessing exclusive agent features</li>
          </ul>
          <p>If you have any questions, please don't hesitate to contact our support team.</p>
          <p style="margin-top: 30px;">Best regards,<br>The Team</p>
        </div>
      </div>
    `
  })
};

// Email sending functions
const sendEmail = async (template, userEmail) => {
  try {
    const mailOptions = templates[template](userEmail);
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};
/**
 * Send notification to admin when a new user registers
 * @param {Object} userData - The user data
 * @param {Object} agencyData - The agency profile data
 * @returns {Promise} - The result of sending the email
 */
const sendNewUserNotification = async (userData, agencyData) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'shaliniavindya@gmail.com';
    
    return await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: adminEmail,
      subject: `New User Registration: ${agencyData.agencyName}`,
      text:
        `A new user has registered on the platform:\n\n` +
        `Agency Name: ${agencyData.agencyName}\n` +
        `Contact Person: ${agencyData.contactPerson}\n` +
        `Email: ${userData.email}\n` +
        `Phone: ${agencyData.phoneNumber || 'N/A'}\n` +
        `Mobile: ${agencyData.mobilePhone || 'N/A'}\n` +
        `Address: ${agencyData.address.street}, ${agencyData.address.city}, ${agencyData.address.country}\n\n` +
        `Registration Time: ${new Date().toISOString()}\n\n` +
        `Please review this registration in the admin panel.`,
      html:
        `<h2>🆕 New User Registration</h2>` +
        `<p><strong>Agency Name:</strong> ${agencyData.agencyName}</p>` +
        `<p><strong>Contact Person:</strong> ${agencyData.contactPerson}</p>` +
        `<p><strong>Email:</strong> ${userData.email}</p>` +
        `<p><strong>Phone:</strong> ${agencyData.phoneNumber || 'N/A'}</p>` +
        `<p><strong>Mobile:</strong> ${agencyData.mobilePhone || 'N/A'}</p>` +
        `<p><strong>Address:</strong> ${agencyData.address.street}, ${agencyData.address.city}, ${agencyData.address.country}</p>` +
        `<p><strong>Registration Time:</strong> ${new Date().toISOString()}</p>` +
        `<p style="margin-top: 20px;"><a href="${process.env.ADMIN_URL || 'http://localhost:5001/admin'}" style="background-color: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px;">Review in Admin Panel</a></p>`
    });
  } catch (error) {
    console.error('Error sending new user notification email:', error);
    return { error: true, message: error.message };
  }
};

/**
 * Send notification for a new contact form submission
 * @param {Object} contactData - The contact form data
 * @returns {Promise} - The result of sending the notifications
 */
const sendContactFormNotification = async (contactData) => {
  try {
    const { name, email, phone, subject, message, submittedAt } = contactData;
    const adminEmail = process.env.ADMIN_EMAIL || 'shaliniavindya@gmail.com';

    // Send WhatsApp notification
    let twilioResponse;
    try {
      twilioResponse = await twilio.messages.create({
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
        to: `whatsapp:${process.env.ADMIN_WHATSAPP_NUMBER}`,
        body: `📩 *New Contact Submission*\n*Name:* ${name}\n*Email:* ${email}\n*Phone:* ${phone || 'N/A'}\n*Subject:* ${subject}\n*Message:* ${message}`,
      });
    } catch (twilioError) {
      console.error('Twilio error:', twilioError.message, twilioError.code);
      // Continue with email even if WhatsApp fails
    }
    // Send email notification
    const emailResult = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: adminEmail,
      cc: email,
      subject: `New Contact Form: ${subject}`,
      text:
        `You have a new contact form submission:\n\n` +
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        `Phone: ${phone || 'N/A'}\n` +
        `Subject: ${subject}\n\n` +
        `Message:\n${message}\n\n` +
        `Submitted At: ${submittedAt.toISOString()}`,
      html:
        `<h2>📩 New Contact Submission</h2>` +
        `<p><strong>Name:</strong> ${name}</p>` +
        `<p><strong>Email:</strong> ${email}</p>` +
        `<p><strong>Phone:</strong> ${phone || 'N/A'}</p>` +
        `<p><strong>Subject:</strong> ${subject}</p>` +
        `<p><strong>Message:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>` +
        `<p><em>Submitted At: ${submittedAt.toISOString()}</em></p>`,
    });
    
    return { 
      emailSent: true, 
      whatsappSent: !!twilioResponse,
      twilioSid: twilioResponse?.sid
    };
  } catch (error) {
    console.error('Error sending contact form notification:', error);
    return { error: true, message: error.message };
  }
};

/**
 * Send a response email to a contact form submission
 * @param {Object} contactData - The contact form data
 * @param {string} response - The response message
 * @returns {Promise} - The result of sending the email
 */
const sendContactFormResponse = async (contactData, response) => {
  try {
    const { name, email, subject } = contactData;
    
    return await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: `Re: ${subject}`,
      text: `Hi ${name},\n\n${response}\n\n– Support Team`,
      html: `<p>Hi ${name},</p><p>${response.replace(/\n/g,'<br/>')}</p><p>– Support Team</p>`
    });
  } catch (error) {
    console.error('Error sending contact form response:', error);
    return { error: true, message: error.message };
  }
};

/**
 * Send notification for a new booking
 * @param {Object} bookingData - The booking data
 * @returns {Promise} - The result of sending the notifications
 */
const sendBookingNotification = async (bookingData) => {
  console.log('sendBookingNotification bookingData:', JSON.stringify(bookingData, null, 2));
  try {
    const { 
      bookingReference, 
      hotel, 
      room, 
      checkIn, 
      checkOut, 
      numberOfGuests, 
      totalPrice, 
      createdAt 
    } = bookingData;

    const hotelName = hotel?.name || (typeof hotel === 'string' ? hotel : 'N/A');
   const roomName = room?.roomName || room?.name || (typeof room === 'string' ? room : 'N/A');
    const guests = (typeof bookingData.adults !== 'undefined' || typeof bookingData.children !== 'undefined')
      ? `${bookingData.adults || 0} Adult(s)${bookingData.children ? `, ${bookingData.children.length || 0} Child(ren)` : ''}`
      : (typeof numberOfGuests !== 'undefined' && numberOfGuests !== null ? numberOfGuests : 'N/A');
    const price = bookingData.priceBreakdown?.total ?? totalPrice ?? 'N/A';
    const checkInDate = checkIn ? new Date(checkIn).toLocaleDateString() : 'N/A';
    const checkOutDate = checkOut ? new Date(checkOut).toLocaleDateString() : 'N/A';
    const createdDate = createdAt || new Date().toISOString();

    const adminEmail = process.env.ADMIN_EMAIL || 'shaliniavindya@gmail.com';

    let twilioResponse;
    try {
      twilioResponse = await twilio.messages.create({
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
        to: `whatsapp:${process.env.ADMIN_WHATSAPP_NUMBER}`,
        body: `🏨 *New Bookings Alert*\n*Reference:* ${bookingReference}\n*Hotel:* ${hotelName}\n*Room:* ${roomName}\n*Check-in:* ${checkInDate}\n*Check-out:* ${checkOutDate}\n*Guests:* ${guests}\n*Total:* ${price}`,
      });
    } catch (twilioError) {
      console.error('Twilio error:', twilioError.message, twilioError.code);
      // Continue with email even if WhatsApp fails
    }
    
    // Send email notification
    const emailResult = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: adminEmail,
      subject: `New Booking Confirmation: ${bookingReference}`,
      text:
        `A new booking has been created:\n\n` +
        `Reference: ${bookingReference}\n` +
        `Hotel: ${hotelName}\n` +
        `Room: ${roomName}\n` +
        `Check-in: ${checkInDate}\n` +
        `Check-out: ${checkOutDate}\n` +
        `Guests: ${guests}\n` +
        `Total Price: ${price}\n\n` +
        `Created At: ${createdDate}`,
      html:
        `<h2>🏨 New Booking Confirmation</h2>` +
        `<p><strong>Reference:</strong> ${bookingReference}</p>` +
        `<p><strong>Hotel:</strong> ${hotelName}</p>` +
        `<p><strong>Room:</strong> ${roomName}</strong></p>` +
        `<p><strong>Check-in:</strong> ${checkInDate}</p>` +
        `<p><strong>Check-out:</strong> ${checkOutDate}</p>` +
        `<p><strong>Guests:</strong> ${guests}</p>` +
        `<p><strong>Total Price:</strong> ${price}</p>` +
        `<p><em>Created At: ${createdDate}</p></em>`
    });
    
    return { 
      emailSent: true, 
      whatsappSent: !!twilioResponse,
      twilioSid: twilioResponse?.sid
    };
  } catch (error) {
    console.error('Error sending booking notification:', error);
    return { error: true, message: error.message };
  }
};

async function sendBookingStatusUpdate(booking) {
  if (booking.status === 'Confirmed') {
    const confirmationSubject = `Booking Confirmation: ${booking.bookingReference}`;
    const confirmationMessage = `
      Dear ${booking.user?.agencyProfile?.username || booking.user?.name || 'Agent'},

      Your booking has been confirmed successfully. Please find attached the confirmation details including passenger information and booking specifics.

      Best regards,
      Yomaldives Booking Team
    `;

    let confirmationAttachments = [];
    try {
      const pdfPath = await generateBookingVoucher(booking, booking.hotel);
      confirmationAttachments.push({
        filename: `Booking-Confirmation-${booking._id}.pdf`,
        path: pdfPath,
        contentType: 'application/pdf'
      });
    } catch (error) {
      console.error('Error generating booking confirmation PDF:', error);
    }

    const confirmationMailOptions = {
      from: process.env.SMTP_USER,
      to: booking.user.email,
      subject: confirmationSubject,
      text: confirmationMessage,
      html: confirmationMessage.replace(/\n/g, '<br/>'),
      attachments: confirmationAttachments
    };

    // Prepare invoice payment email
    const invoiceSubject = `Payment Invoice: ${booking.bookingReference}`;
    const invoiceMessage = `
      Dear ${booking.user?.agencyProfile?.username || booking.user?.name || 'Agent'},

      Please find attached the payment invoice for your confirmed booking.

      Invoice Details:
      - Reference: ${booking.bookingReference}
      - Total Due: $${(booking.priceBreakdown?.total || booking.totalPrice || 0).toFixed(2)}
      - Payment Terms: Due within 7 days

      Best regards,
      Yomaldives Accounts Team
    `;

    let invoiceAttachments = [];
    try {
      const invoicePath = await generatePaymentInvoice(booking, booking.hotel);
      invoiceAttachments.push({
        filename: `Payment-Invoice-${booking._id}.pdf`,
        path: invoicePath,
        contentType: 'application/pdf'
      });
    } catch (error) {
      // Continue with email even if PDF generation fails
      console.error('Error generating payment invoice PDF:', error);
    }

    try {
      await transporter.sendMail(confirmationMailOptions);
      console.log(`Booking confirmation email sent to ${booking.user.email}`);
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: booking.user.email,
        subject: invoiceSubject,
        text: invoiceMessage,
        html: invoiceMessage.replace(/\n/g, '<br/>'),
        attachments: invoiceAttachments
      });
      console.log(`Payment invoice email sent to ${booking.user.email}`);
    } catch (error) {
      console.error('Error sending emails:', error);
      throw error;
    }
  }

  // Prepare payment voucher email
  if (booking.status === 'Paid') {
    const voucherSubject = `Payment Voucher: ${booking.bookingReference}`;
    const voucherMessage = `
      Dear ${booking.user?.agencyProfile?.username || booking.user?.name || 'Agent'},

      Thank you for your payment. Please find attached the payment voucher confirming receipt of your payment.

      Voucher Details:
      - Reference: ${booking.bookingReference}
      - Amount Paid: $${(booking.amountPaid || booking.totalPrice || 0).toFixed(2)}
      - Paid Date: ${booking.paidAt ? new Date(booking.paidAt).toLocaleDateString() : new Date().toLocaleDateString()}

      Best regards,
      Yomaldives Accounts Team
    `;

    let voucherAttachments = [];
    try {
      const voucherPath = await generatePaymentVoucher(booking, booking.hotel);
      voucherAttachments.push({
        filename: `Payment-Voucher-${booking._id}.pdf`,
        path: voucherPath,
        contentType: 'application/pdf'
      });
    } catch (error) {
      console.error('Error generating payment voucher PDF:', error);
    }

    try {
      // Send payment voucher email
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: booking.user.email,
        subject: voucherSubject,
        text: voucherMessage,
        html: voucherMessage.replace(/\n/g, '<br/>'),
        attachments: voucherAttachments
      });
      console.log(`Payment voucher email sent to ${booking.user.email}`);
    } catch (error) {
      console.error('Error sending payment voucher email:', error);
      throw error;
    }
  }
}

module.exports = {
  sendEmail,
  templates,
  sendNewUserNotification,
  sendContactFormNotification,
  sendContactFormResponse,
  sendBookingNotification,
  sendBookingStatusUpdate
}; 