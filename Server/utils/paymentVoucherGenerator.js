const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Generates a professional payment voucher PDF after payment is confirmed
 * @param {Object} booking - The booking object
 * @param {Object} hotel - The hotel object
 * @param {Object} paymentDetails - Payment confirmation details
 * @returns {Promise<string>} - Path to the generated PDF file
 */
async function generatePaymentVoucher(booking, hotel, paymentDetails = {}) {
  return new Promise((resolve, reject) => {
    try {
      const BRAND_BLUE = '#1a365d';
      const SUCCESS_GREEN = '#0EA448';
      const TEXT_DARK = '#1a202c';
      const TEXT_GRAY = '#4a5568';
      const BORDER_COLOR = '#e2e8f0';
      const LIGHT_GRAY = '#f7fafc';
      const LIGHT_GREEN = '#dcfce7';
      const BACKGROUND_WHITE = '#ffffff';
      const HEADER_BLACK = '#000000';

      const doc = new PDFDocument({
        size: [595, 842], 
        margin: 10,
        info: {
          Title: `Payment Voucher - ${booking.bookingReference}`,
          Author: 'Yomaldives Holidays',
          Subject: 'Payment Confirmation Voucher',
          Keywords: 'maldives, travel, payment, voucher, confirmation, paid'
        }
      });

      // Create uploads directory
      const uploadsDir = path.join(__dirname, '../../Uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const outputPath = path.join(uploadsDir, `payment-voucher-${booking._id}.pdf`);
      const writeStream = fs.createWriteStream(outputPath);
      doc.pipe(writeStream);

      // Helper function to format dates
      const formatDate = (iso) => {
        try {
          return new Date(iso).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          });
        } catch (err) {
          console.warn('Error formatting date:', err.message);
          return 'N/A';
        }
      };

      const formatDateTime = (iso) => {
        try {
          return new Date(iso).toLocaleString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
        } catch (err) {
          console.warn('Error formatting datetime:', err.message);
          return 'N/A';
        }
      };

      const todayDate = new Date();
      const voucherDate = paymentDetails.paidDate ? formatDateTime(paymentDetails.paidDate) : formatDateTime(todayDate);

      // HEADER SECTION
      doc.rect(0, 0, doc.page.width, 70)
         .fillAndStroke(HEADER_BLACK, BORDER_COLOR);

      try {
        const logoPath = path.join(__dirname, '../../Client/public/Logo.png');
        if (fs.existsSync(logoPath)) {
          doc.image(logoPath, 25, 20, { width: 40 });
        }
      } catch (err) {
        console.warn('Error adding logo:', err.message);
      }

      // Header text
      doc.fillColor('#ffffff')
         .fontSize(18)
         .font('Helvetica-Bold')
         .text('Yomaldives', 75, 22)
         .fontSize(10)
         .font('Helvetica')
         .text('Maldives Wholesale Experts', 75, 42);

      // Contact info
      doc.fillColor('#ffffff')
         .fontSize(9)
         .text('WhatsApp: +960 9385050', doc.page.width - 200, 28, {
           align: 'right',
           width: 180
         })
         .text('Email: accounts@yomaldives.travel', doc.page.width - 200, 42, {
           align: 'right',
           width: 180
         });

      // PAYMENT VOUCHER
      const titleBoxY = 80;
      doc.rect(20, titleBoxY, 555, 40)
         .fillAndStroke(BRAND_BLUE, BORDER_COLOR);
         
      doc.fillColor('#ffffff')
         .fontSize(18)
         .font('Helvetica-Bold')
         .text('PAYMENT VOUCHER', 25, titleBoxY + 12, {
           align: 'center',
           width: 555
         });

      // Payment confirmation message
      const confirmBoxY = titleBoxY + 50;
      doc.rect(20, confirmBoxY, 555, 35)
         .fillAndStroke(LIGHT_GREEN, BORDER_COLOR);
         
      doc.fillColor(SUCCESS_GREEN)
         .fontSize(14)
         .font('Helvetica-Bold')
         .text('PAYMENT SUCCESSFULLY RECEIVED', 25, confirmBoxY + 12, {
           align: 'center',
           width: 555
         });

      // Agent details and voucher info section
      let agentName = 'N/A';
      let agentEmail = 'N/A';
      if (booking.user && booking.user.agencyProfile) {
        agentName = booking.user.agencyProfile.username || booking.user.name || 'Agent';
        agentEmail = booking.user.agencyProfile.billingEmail || booking.user.email || 'N/A';
      } else if (booking.agentName) {
        agentName = booking.agentName;
        agentEmail = booking.agentEmail || booking.clientDetails?.email || 'N/A';
      } else if (booking.clientDetails) {
        agentEmail = booking.clientDetails.email || 'N/A';
      }

      const detailsBoxY = confirmBoxY + 45;
      const detailsBoxHeight = 90;

      // Left column - Payment From
      doc.rect(20, detailsBoxY, 275, detailsBoxHeight)
         .fillAndStroke(BACKGROUND_WHITE, BORDER_COLOR);
      
      doc.rect(20, detailsBoxY, 275, 25)
         .fillAndStroke(LIGHT_GRAY, BORDER_COLOR);
         
      doc.fillColor(TEXT_DARK)
         .fontSize(12)
         .font('Helvetica-Bold')
         .text('PAYMENT FROM:', 30, detailsBoxY + 8);

      doc.fontSize(10)
         .font('Helvetica')
         .fillColor(TEXT_DARK)
         .text(`Agent: ${agentName}`, 30, detailsBoxY + 35)
         .text(`Email: ${agentEmail}`, 30, detailsBoxY + 50)
         .text(`Hotel: ${hotel?.name || 'N/A'}`, 30, detailsBoxY + 65);

      // Right column - Voucher Details
      doc.rect(300, detailsBoxY, 275, detailsBoxHeight)
         .fillAndStroke(BACKGROUND_WHITE, BORDER_COLOR);
         
      doc.rect(300, detailsBoxY, 275, 25)
         .fillAndStroke(LIGHT_GRAY, BORDER_COLOR);
         
      doc.fillColor(TEXT_DARK)
         .fontSize(12)
         .font('Helvetica-Bold')
         .text('VOUCHER DETAILS:', 310, detailsBoxY + 8);

      doc.fontSize(10)
         .font('Helvetica')
         .fillColor(TEXT_DARK)
         .text(`Voucher No: PV-${booking.bookingReference || 'N/A'}`, 310, detailsBoxY + 35)
         .text(`Payment Date: ${voucherDate}`, 310, detailsBoxY + 50)
         .text(`Status: PAID`, 310, detailsBoxY + 65);

      // PAYMENT SUMMARY TABLE
      let currentY = detailsBoxY + detailsBoxHeight + 20;
      const tableStartY = currentY;
      const rowHeight = 25;
      const headerHeight = 30;
      
      doc.rect(20, currentY, 555, headerHeight)
         .fillAndStroke(BRAND_BLUE, BORDER_COLOR);
      
      doc.fillColor('#ffffff')
         .fontSize(12)
         .font('Helvetica-Bold')
         .text('PAYMENT SUMMARY', 30, currentY + 9, { width: 280 })
         .text('DETAILS', 320, currentY + 9, { width: 150, align: 'center' })
         .text('AMOUNT', 480, currentY + 9, { width: 85, align: 'center' });

      currentY += headerHeight;

      // Extract payment breakdown data
      const pb = booking.priceBreakdown || {};
      const nights = pb.nights || booking.nights || 1;
      const rooms = pb.rooms || booking.rooms || 1;
      const basePricePerNight = pb.basePricePerNight || pb.basePrice || 0;
      const roomTotal = pb.roomTotal || (basePricePerNight * nights * rooms);
      const mealPlan = pb.mealPlan || null;
      const marketSurcharge = pb.marketSurcharge || null;
      const discounts = pb.discounts || [];

      // Helper function to draw table row
      const drawTableRow = (description, details, amount, isTotal = false, bgColor = BACKGROUND_WHITE) => {
        const thisRowHeight = isTotal ? 35 : rowHeight;
        
        doc.rect(20, currentY, 555, thisRowHeight)
           .fillAndStroke(bgColor, BORDER_COLOR);
           
        doc.moveTo(310, currentY).lineTo(310, currentY + thisRowHeight).stroke(BORDER_COLOR);
        doc.moveTo(470, currentY).lineTo(470, currentY + thisRowHeight).stroke(BORDER_COLOR);
        
        const fontSize = isTotal ? 12 : 10;
        const fontWeight = isTotal ? 'Helvetica-Bold' : 'Helvetica';
        const textColor = isTotal ? SUCCESS_GREEN : TEXT_DARK;
        
        doc.fillColor(textColor)
           .fontSize(fontSize)
           .font(fontWeight)
           .text(description, 30, currentY + (thisRowHeight - fontSize) / 2, { width: 270 })
           .text(details, 320, currentY + (thisRowHeight - fontSize) / 2, { width: 140, align: 'center' })
           .text(amount, 480, currentY + (thisRowHeight - fontSize) / 2, { width: 85, align: 'center' });
           
        currentY += thisRowHeight;
      };

      // Room charges
      drawTableRow(
        `Room Charges ($${basePricePerNight.toFixed(2)}/night)`,
        `${nights} nights × ${rooms} rooms`,
        `$${roomTotal.toFixed(2)}`
      );

      const totalAdults = Number(booking.adults) || 0;
      const totalChildren = Array.isArray(booking.children) ? booking.children.length : 0;
      const totalGuests = totalAdults + totalChildren;

      // Meal plan
      if (mealPlan && mealPlan.total > 0) {
        const mealPersons = totalGuests > 0 ? totalGuests : 1;
        const mealTotal = mealPlan.total || 0;
        const mealPricePerPerson = mealPlan.price || (mealTotal / (mealPersons * nights));
        
        drawTableRow(
          `Meal Plan (${mealPlan.type}) ($${mealPricePerPerson.toFixed(2)}/person/night)`,
          `${nights} nights × ${mealPersons} persons`,
          `$${mealTotal.toFixed(2)}`
        );
      }

      // Market surcharge
      if (marketSurcharge && marketSurcharge.total > 0) {
        const msTotal = marketSurcharge.total || 0;
        const msPrice = marketSurcharge.price || msTotal;
        
        drawTableRow(
          `Market Surcharge (${marketSurcharge.type}) ($${msPrice.toFixed(2)})`,
          `(${marketSurcharge.type} × ${nights} nights × ${rooms} rooms)`,
          `$${msTotal.toFixed(2)}`
        );
      }

      // Discounts
      let discountTotal = 0;
      if (discounts && discounts.length > 0) {
        discounts.forEach((discount) => {
          const discountValue = parseFloat(discount.value) || 0;
          discountTotal += discountValue;
          let desc = discount.description || discount.type || 'General';
          // If percentage, append percentage value
          if (discount.type && discount.type.toLowerCase().includes('percent')) {
            let base = (roomTotal || 0);
            if (mealPlan && mealPlan.total) base += mealPlan.total;
            if (marketSurcharge && marketSurcharge.total) base += marketSurcharge.total;
            let percent = '';
            if (base > 0) {
              percent = Math.round((discountValue / base) * 100);
              desc += ` (${percent}%)`;
            }
          }
          drawTableRow(
            `Discount`,
            desc,
            `-$${discountValue.toFixed(2)}`
          );
        });
      }

      // Calculate total
      const totalAmount = roomTotal + 
                         (mealPlan ? (mealPlan.total || 0) : 0) + 
                         (marketSurcharge ? (marketSurcharge.total || 0) : 0) - 
                         discountTotal;
      currentY += 5;
      
      // Total paid
      drawTableRow(
        'TOTAL AMOUNT PAID',
        'Successfully Received',
        `$${totalAmount.toFixed(2)}`,
        true,
        LIGHT_GREEN
      );

      // BOOKING DETAILS SECTION
      currentY += 25;
      const bookingDetailsHeight = 120;
      
      doc.rect(20, currentY, 555, bookingDetailsHeight)
         .fillAndStroke(BACKGROUND_WHITE, BORDER_COLOR);

      doc.rect(20, currentY, 555, 25)
         .fillAndStroke(BRAND_BLUE, BORDER_COLOR);
         
      doc.fillColor('#ffffff')
         .fontSize(12)
         .font('Helvetica-Bold')
         .text('BOOKING DETAILS', 30, currentY + 8);

      // Booking information
      doc.fillColor(TEXT_DARK)
         .fontSize(10)
         .font('Helvetica-Bold')
         .text('Booking Reference:', 30, currentY + 35)
         .text('Check-in Date:', 30, currentY + 50)
         .text('Check-out Date:', 30, currentY + 65)
         .text('Hotel:', 30, currentY + 80)
         .text('Room Type:', 30, currentY + 95);

      doc.font('Helvetica')
         .text(booking.bookingReference || 'N/A', 150, currentY + 35)
         .text(formatDate(booking.checkIn), 150, currentY + 50)
         .text(formatDate(booking.checkOut), 150, currentY + 65)
         .text(hotel?.name || 'N/A', 150, currentY + 80)
         .text(booking.room?.roomType || 'N/A', 150, currentY + 95);

      // Right column
      doc.font('Helvetica-Bold')
         .text('Nights:', 320, currentY + 35)
         .text('Rooms:', 320, currentY + 50)
         .text('Meal Plan:', 320, currentY + 65)
         .text('Package:', 320, currentY + 80)
         .text('Guests:', 320, currentY + 95);

      doc.font('Helvetica')
         .text(`${nights}`, 380, currentY + 35)
         .text(`${rooms}`, 380, currentY + 50)
         .text(booking.mealPlan || 'N/A', 380, currentY + 65)
         .text(booking.packageName || 'N/A', 380, currentY + 80)
         .text(`${totalGuests > 0 ? totalGuests : 1}`, 380, currentY + 95);

      // PAYMENT METHOD SECTION
      currentY += bookingDetailsHeight + 15;
      if (paymentDetails.method || paymentDetails.reference || paymentDetails.notes) {
        const paymentMethodHeight = 80;
        
        doc.rect(20, currentY, 555, paymentMethodHeight)
           .fillAndStroke(BACKGROUND_WHITE, BORDER_COLOR);

        doc.rect(20, currentY, 555, 25)
           .fillAndStroke(LIGHT_GRAY, BORDER_COLOR);
           
        doc.fillColor(TEXT_DARK)
           .fontSize(12)
           .font('Helvetica-Bold')
           .text('PAYMENT METHOD', 30, currentY + 8);

        let paymentY = currentY + 35;
        if (paymentDetails.method) {
          doc.fontSize(10)
             .font('Helvetica-Bold')
             .text('Payment Method:', 30, paymentY)
             .font('Helvetica')
             .text(paymentDetails.method, 150, paymentY);
          paymentY += 15;
        }

        if (paymentDetails.reference) {
          doc.font('Helvetica-Bold')
             .text('Reference:', 30, paymentY)
             .font('Helvetica')
             .text(paymentDetails.reference, 150, paymentY);
          paymentY += 15;
        }

        if (paymentDetails.notes) {
          doc.font('Helvetica-Bold')
             .text('Notes:', 30, paymentY)
             .font('Helvetica')
             .text(paymentDetails.notes, 150, paymentY, { width: 395 });
        }

        currentY += paymentMethodHeight + 15;
      }

      // THANK YOU MESSAGE
      const thankYouHeight = 60;
      doc.rect(20, currentY, 555, thankYouHeight)
         .fillAndStroke(LIGHT_GREEN, BORDER_COLOR);

      doc.fillColor(SUCCESS_GREEN)
         .fontSize(14)
         .font('Helvetica-Bold')
         .text('Thank you for your payment!', 30, currentY + 15, {
           align: 'center',
           width: 555
         });

      doc.fillColor(TEXT_DARK)
         .fontSize(10)
         .font('Helvetica')
         .text('Your booking is now confirmed and fully paid. We look forward to serving you.', 30, currentY + 35, {
           align: 'center',
           width: 555
         });

      // SIGNATURE SECTION
      currentY += thankYouHeight + 20;
      
      doc.fontSize(10)
         .font('Helvetica-Bold')
         .fillColor(TEXT_DARK)
         .text('Best regards,', 20, currentY)
         .text('Accounts Team', 20, currentY + 14);

      try {
        const logoPath = path.join(__dirname, '../../Client/public/Logo.png');
        if (fs.existsSync(logoPath)) {
          doc.image(logoPath, 20, currentY + 28, { width: 25 });
        }
      } catch (err) {
        console.warn('Error adding signature logo:', err.message);
      }

      doc.fontSize(9)
         .font('Helvetica')
         .fillColor(BRAND_BLUE)
         .text('WhatsApp: +960 9385050', 20, currentY + 56)
         .text('Email: accounts@yomaldives.travel', 20, currentY + 68);

      // FOOTER NOTE
      doc.fillColor(TEXT_GRAY)
         .fontSize(8)
         .font('Helvetica')
         .text('This document serves as confirmation of payment received. Please keep it for your records.', 20, currentY + 85, {
           align: 'center',
           width: 555
         });
      doc.end();

      writeStream.on('finish', () => resolve(outputPath));
      writeStream.on('error', reject);

    } catch (error) {
      reject(error);
    }
  });
}

module.exports = { generatePaymentVoucher };