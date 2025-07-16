const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Generates a PDF voucher for a booking
 * @param {Object} booking - The booking object
 * @param {Object} hotel - The hotel object
 * @returns {Promise<string>} - Path to the generated PDF file
 */
async function generateBookingVoucher(booking, hotel) {
  return new Promise((resolve, reject) => {
    try {
      const BRAND_BLUE = '#1a365d';
      const LIGHT_YELLOW = '#FFFDE7';
      const TEXT_DARK = '#333333';
      const TEXT_SECONDARY = '#4a5568';
      const BORDER_BLACK = '#000000';
      const SUCCESS_GREEN = '#38a169'; 
      const WARNING_YELLOW = '#ecc94b';
      const LIGHT_BLUE = '#e6f3ff';
      const BACKGROUND_WHITE = '#ffffff';
      const DARK = '#000000';

      // Create a new PDF document with better metadata
      const doc = new PDFDocument({
        size: [595, 842], // A4 size
        margin: 10,
        info: {
          Title: `Yomaldives Booking Confirmation - ${booking.bookingReference}`,
          Author: 'Yomaldives Holidays',
          Subject: 'Booking Confirmation',
          Keywords: 'maldives, travel, booking, confirmation'
        }
      });

      // Create uploads directory if it doesn't exist
      const uploadsDir = path.join(__dirname, '../../Uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      // Set up the output file path
      const outputPath = path.join(uploadsDir, `booking-confirmation-${booking._id}.pdf`);
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

      // Calculate nights if not provided
      const nights = booking.nights || 
        (booking.checkIn && booking.checkOut 
          ? Math.ceil((new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24)) 
          : 1);

      // HEADER
      doc.rect(0, 0, doc.page.width, 60)
         .fillAndStroke(DARK, BORDER_BLACK);

      try {
        const logoPath = path.join(__dirname, '../../Client/public/Logo.png');
        if (fs.existsSync(logoPath)) {
          doc.image(logoPath, 25, 15, { width: 35 });
        }
      } catch (err) {
        console.warn('Error adding logo:', err.message);
      }

      // Header text
      doc.fillColor('white')
         .fontSize(16)
         .font('Helvetica-Bold')
         .text('Yomaldives', 70, 18)
         .fontSize(9)
         .font('Helvetica')
         .text('Maldives Wholesale Experts', 70, 36);

      // Contact info
      doc.fillColor('white')
         .fontSize(8)
         .text('WhatsApp: +960 9385050', doc.page.width - 240, 25, {
           align: 'right',
           width: 230
         })
         .text('Email: reservations@yomaldives.travel', doc.page.width - 240, 35, {
           align: 'right',
           width: 230
         });

      // Voucher title
      const titleBoxY = 70;
      doc.rect(20, titleBoxY, 555, 40)
         .fillAndStroke(BRAND_BLUE, BORDER_BLACK);
      doc.fillColor('#ffffff')
         .fontSize(18)
         .font('Helvetica-Bold')
         .text('BOOKING CONFIRMATION', 25, titleBoxY + 12, {
           align: 'center',
           width: 555
         });

      // DATE AND GREETING SECTION
      let currentY = titleBoxY + 50; 
      const todayDate = new Date().toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      let clientName = booking.clientDetails?.name || 'Valued Partner';
      doc.fillColor(TEXT_SECONDARY)
         .fontSize(10)
         .font('Helvetica')
         .text(`Date: ${todayDate}`, 380, currentY, { width: 175, align: 'right' });
      currentY += 18; 
      doc.fillColor(TEXT_DARK)
         .fontSize(12)
         .font('Helvetica-Bold')
         .text(`Dear ${clientName},`, 20, currentY);
      currentY += 20; 
      // Thank you message
      doc.fillColor(TEXT_DARK)
         .fontSize(11)
         .font('Helvetica')
         .text('Thank you for choosing Yomaldives Holidays. We are delighted to confirm your reservation details as outlined below:',
               20, currentY, { width: 555, lineGap: 1 });
      currentY += 35; 

      // PASSENGER DETAILS TABLE
      const tableHeaderHeight = 35;
      const tableRowHeight = 25;
      const colWidths = [35, 110, 70, 60, 70, 60, 70, 80];
      const colStarts = [20];
      for (let i = 1; i < colWidths.length; i++) {
        colStarts[i] = colStarts[i - 1] + colWidths[i - 1];
      }
      const cellVCenter = (y, h, fontSize = 10) => y + (h - fontSize) / 2 - 2;

      // Table Header
      for (let i = 0; i < colWidths.length; i++) {
        doc.rect(colStarts[i], currentY, colWidths[i], tableHeaderHeight)
           .fillAndStroke(BRAND_BLUE, BORDER_BLACK);
      }
      doc.fillColor('white')
         .font('Helvetica-Bold')
         .fontSize(10);
      ['#', 'Guest Name', 'Passport Number', 'Country', 'Arrival Flight', 'Arrival Time', 'Departure Flight', 'Departure Time'].forEach((header, i) => {
        doc.fillColor('white')
           .text(header, colStarts[i], cellVCenter(currentY, tableHeaderHeight, 10), {
             width: colWidths[i], align: 'center', valign: 'center'
           });
      });

      // Table Rows
      currentY += tableHeaderHeight;
      if (booking.passengerDetails && booking.passengerDetails.length > 0) {
        booking.passengerDetails.forEach((passenger, index) => {
          const rowY = currentY + (index * tableRowHeight);
          for (let i = 0; i < colWidths.length; i++) {
            let bgColor = BACKGROUND_WHITE;
            if (i === 1 || i === 2 || i === 3) bgColor = '#BCD7F6';
            if (i === 4 || i === 5) bgColor = '#9EF7B5';
            if (i === 6 || i === 7) bgColor = '#FFEF9C';
            doc.rect(colStarts[i], rowY, colWidths[i], tableRowHeight)
               .fillAndStroke(bgColor, BORDER_BLACK);
          }
          const rowData = [
            `${index + 1}`,
            passenger.name || 'N/A',
            passenger.passport || 'N/A',
            passenger.country || 'N/A',
            passenger.arrivalFlightNumber || 'N/A',
            passenger.arrivalTime || 'N/A',
            passenger.departureFlightNumber || 'N/A',
            passenger.departureTime || 'N/A'
          ];
          rowData.forEach((text, i) => {
            let displayText = text;
            if (displayText.length > 22 && i !== 0) displayText = displayText.slice(0, 19) + '...';
            doc.fillColor(TEXT_DARK)
               .font('Helvetica')
               .fontSize(10)
               .text(displayText, colStarts[i], cellVCenter(rowY, tableRowHeight, 10), {
                 width: colWidths[i], align: 'center', valign: 'center', ellipsis: true
               });
          });
        });
        currentY += booking.passengerDetails.length * tableRowHeight + 6;
      } else {
        doc.fillColor(TEXT_DARK)
           .font('Helvetica')
           .fontSize(10)
           .text('No passenger details available.', 25, currentY + 6);
        currentY += tableRowHeight + 4;
      }

      currentY += 5; 

      // DETAILS TABLE
      const detailsRows = [
        ['Arrival date', formatDate(booking.checkIn)],
        ['Departure date', formatDate(booking.checkOut)],
        ['Hotel Name / Confirmation num.', `${hotel?.name || 'N/A'} (${booking.bookingReference})`],
        ['Room Type', booking.room?.roomType || 'N/A'],
        ['Number of Nights', `${nights} Nights`],
        // Children row if children exist
        ...(Array.isArray(booking.children) && booking.children.length > 0
          ? [[
              'Children',
              `${booking.children.length} children (${booking.children.map(child => `${child.age} Age`).join(', ')})`
            ]]
          : []),
        ['Meal Plan', booking.mealPlan || 'N/A'],
        [
          'Airport transfer',
          (Array.isArray(booking.transportations) && booking.transportations.length > 0)
            ? booking.transportations.map((t) => {
                const type = t.type ? t.type.charAt(0).toUpperCase() + t.type.slice(1) : 'N/A';
                const method = t.method || 'N/A';
                return `${type}: ${method}`;
              }).join('\n')
            : 'N/A'
        ],
        ['Package Name', booking.packageName || 'N/A'],
        [
          'Inclusive(s)',
          (() => {
            const inclusives = [
              'Meal Plan as Above',
              `${nights} Nights Stay in above Mentioned Rooms`
            ];
            if (Array.isArray(booking.transportations) && booking.transportations.length > 0) {
              booking.transportations.forEach((t) => {
                const type = t.type ? t.type.charAt(0).toUpperCase() + t.type.slice(1) : 'N/A';
                const method = t.method || 'N/A';
                inclusives.push(`${type} Airport Transfer by ${method}`);
              });
            } else {
              inclusives.push('Airport Transfer: N/A');
            }
            inclusives.push('All the Taxes');
            return inclusives.map(i => `• ${i}`).join('\n');
          })()
        ]
      ];
      const tableX = 20;
      const tableY = currentY;
      const tableWidth = 555;
      const col1Width = 180;
      const col2Width = tableWidth - col1Width;
      const rowHeights = detailsRows.map(([label, value]) => {
        let lines = 1;
        if (typeof value === 'string' && value.includes('\n')) {
          lines = value.split('\n').length;
        }
        return 16 * lines + 10; 
      });
      const tableHeight = rowHeights.reduce((a, b) => a + b, 0);
      doc.save().strokeColor(BORDER_BLACK)
         .rect(tableX, tableY, tableWidth, tableHeight)
         .stroke();
      let yCursor = tableY;
      for (let i = 0; i < detailsRows.length; i++) {
        if (i > 0) {
          doc.moveTo(tableX, yCursor)
             .lineTo(tableX + tableWidth, yCursor)
             .stroke();
        }
        yCursor += rowHeights[i];
      }
      doc.moveTo(tableX + col1Width, tableY)
         .lineTo(tableX + col1Width, tableY + tableHeight)
         .stroke();
      yCursor = tableY;
      for (let i = 0; i < detailsRows.length; i++) {
        const bgColor = i % 2 === 0 ? BACKGROUND_WHITE : '#f8fafc';
        doc.save().fillColor(bgColor).rect(tableX, yCursor, tableWidth, rowHeights[i]).fill().restore();
        doc.save().fillColor(LIGHT_BLUE).rect(tableX, yCursor, col1Width, rowHeights[i]).fill().restore();
        doc.rect(tableX, yCursor, tableWidth, rowHeights[i]).stroke(BORDER_BLACK);
        doc.moveTo(tableX + col1Width, yCursor)
           .lineTo(tableX + col1Width, yCursor + rowHeights[i])
           .stroke();
        yCursor += rowHeights[i];
      }
      // Fill table content
      yCursor = tableY;
      for (let i = 0; i < detailsRows.length; i++) {
        const [label, value] = detailsRows[i];
        doc.font('Helvetica-Bold').fontSize(10).fillColor(TEXT_DARK)
           .text(label, tableX + 10, yCursor + 8, { width: col1Width - 20, align: 'left' });
        doc.font('Helvetica').fontSize(10).fillColor(TEXT_DARK);
        if (typeof value === 'string' && value.includes('\n')) {
          const lines = value.split('\n');
          lines.forEach((line, idx) => {
            doc.text(line, tableX + col1Width + 10, yCursor + 8 + idx * 16, { width: col2Width - 20, align: 'left' });
          });
        } else {
          doc.text(value, tableX + col1Width + 10, yCursor + 8, { width: col2Width - 20, align: 'left' });
        }
        yCursor += rowHeights[i];
      }
      currentY = tableY + tableHeight + 8; 

      // ARRIVAL INSTRUCTIONS
      const instructionsHeight = 32; 
      doc.rect(20, currentY, 555, instructionsHeight)
         .fillAndStroke('#fff8e1', '#ffa726');
      doc.fillColor(TEXT_DARK)
         .fontSize(10)
         .font('Helvetica')
         .text('Upon arrival at Velana International Airport, please look for our representative holding a "Yomaldives" placard. If you cannot locate our representative, please contact the information desk or call our emergency contact number.',
               30, currentY + 8, { width: 525, lineGap: 0 });
      currentY += instructionsHeight + 10;

      // FOOTER
      doc.fontSize(10)
         .font('Helvetica-Bold')
         .fillColor(TEXT_DARK)
         .text('Thanks, and regards,', 20, currentY)
         .text('Accounts Team', 20, currentY + 14);
      try {
        const logoPath = path.join(__dirname, '../../Client/public/Logo.png');
        if (fs.existsSync(logoPath)) {
          doc.image(logoPath, 20, currentY + 28, { width: 28 });
        }
      } catch (err) {
        console.warn('Error adding signature logo:', err.message);
      }
      doc.fontSize(9)
         .font('Helvetica')
         .fillColor(BRAND_BLUE)
         .text('WhatsApp: +960 9385050', 20, currentY + 58)
         .text('Email: accounts@yomaldives.travel', 20, currentY + 68);
      doc.end();

      writeStream.on('finish', () => resolve(outputPath));
      writeStream.on('error', reject);

    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Generates a professional payment invoice PDF
 * @param {Object} booking - The booking object
 * @param {Object} hotel - The hotel object
 * @returns {Promise<string>} - Path to the generated PDF file
 */
async function generatePaymentInvoice(booking, hotel) {
  return new Promise((resolve, reject) => {
    try {
      const BRAND_BLUE = '#1a365d';
      const TEXT_DARK = '#1a202c';
      const TEXT_GRAY = '#4a5568';
      const BORDER_COLOR = '#e2e8f0';
      const LIGHT_GRAY = '#f7fafc';
      const BACKGROUND_WHITE = '#ffffff';
      const HEADER_BLACK = '#000000';

      const doc = new PDFDocument({
        size: [595, 842], 
        margin: 10,
        info: {
          Title: `Professional Invoice - ${booking.bookingReference}`,
          Author: 'Yomaldives Holidays',
          Subject: 'Payment Invoice',
          Keywords: 'maldives, travel, invoice, payment, professional'
        }
      });

      // Create uploads directory
      const uploadsDir = path.join(__dirname, '../../Uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const outputPath = path.join(uploadsDir, `professional-invoice-${booking._id}.pdf`);
      const writeStream = fs.createWriteStream(outputPath);
      doc.pipe(writeStream);

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

      const createdDate = booking.createdAt ? formatDate(booking.createdAt) : formatDate(new Date());

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

      const titleBoxY = 80;
      doc.rect(20, titleBoxY, 555, 35)
         .fillAndStroke(BRAND_BLUE, BORDER_COLOR);
         
      doc.fillColor('#ffffff')
         .fontSize(16)
         .font('Helvetica-Bold')
         .text('PAYMENT INVOICE', 25, titleBoxY + 12, {
           align: 'center',
           width: 555
         });

      // Agent details and invoice info section 
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

      const invoiceBoxY = titleBoxY + 45;
      const invoiceBoxHeight = 80;

      // Left column - Bill To
      doc.rect(20, invoiceBoxY, 275, invoiceBoxHeight)
         .fillAndStroke(BACKGROUND_WHITE, BORDER_COLOR);
      
      doc.rect(20, invoiceBoxY, 275, 25)
         .fillAndStroke(LIGHT_GRAY, BORDER_COLOR);
         
      doc.fillColor(TEXT_DARK)
         .fontSize(12)
         .font('Helvetica-Bold')
         .text('BILL TO:', 30, invoiceBoxY + 8);

      doc.fontSize(10)
         .font('Helvetica')
         .fillColor(TEXT_DARK)
         .text(`Agent: ${agentName}`, 30, invoiceBoxY + 35)
         .text(`Email: ${agentEmail}`, 30, invoiceBoxY + 50)
         .text(`Hotel: ${hotel?.name || 'N/A'}`, 30, invoiceBoxY + 65);

      // Right column - Invoice Details
      doc.rect(300, invoiceBoxY, 275, invoiceBoxHeight)
         .fillAndStroke(BACKGROUND_WHITE, BORDER_COLOR);
         
      doc.rect(300, invoiceBoxY, 275, 25)
         .fillAndStroke(LIGHT_GRAY, BORDER_COLOR);
         
      doc.fillColor(TEXT_DARK)
         .fontSize(12)
         .font('Helvetica-Bold')
         .text('INVOICE DETAILS:', 310, invoiceBoxY + 8);

      doc.fontSize(10)
         .font('Helvetica')
         .fillColor(TEXT_DARK)
         .text(`Invoice No: ${booking.bookingReference || 'N/A'}`, 310, invoiceBoxY + 35)
         .text(`Date: ${createdDate}`, 310, invoiceBoxY + 50)
         .text(`Due Date: ${formatDate(new Date(Date.now() + 7*24*60*60*1000))}`, 310, invoiceBoxY + 65);

      // BILLING DETAILS
      let currentY = invoiceBoxY + invoiceBoxHeight + 15;
      const rowHeight = 25;
      const headerHeight = 30;
      
      doc.rect(20, currentY, 555, headerHeight)
         .fillAndStroke(BRAND_BLUE, BORDER_COLOR);
      
      doc.fillColor('#ffffff')
         .fontSize(12)
         .font('Helvetica-Bold')
         .text('DESCRIPTION', 30, currentY + 9, { width: 280 })
         .text('CALCULATION', 320, currentY + 9, { width: 150, align: 'center' })
         .text('AMOUNT', 480, currentY + 9, { width: 85, align: 'center' });

      currentY += headerHeight;

      // Extract breakdown data
      const pb = booking.priceBreakdown || {};
      const nights = pb.nights || booking.nights || 1;
      const rooms = pb.rooms || booking.rooms || 1;
      const basePricePerNight = pb.basePricePerNight || pb.basePrice || 0;
      const roomTotal = pb.roomTotal || (basePricePerNight * nights * rooms);
      const mealPlan = pb.mealPlan || null;
      const marketSurcharge = pb.marketSurcharge || null;
      const discounts = pb.discounts || [];

      // Helper function to draw table row
      const drawTableRow = (description, calculation, amount, isSubtotal = false, bgColor = BACKGROUND_WHITE) => {
        const thisRowHeight = isSubtotal ? 30 : rowHeight;
        
        doc.rect(20, currentY, 555, thisRowHeight)
           .fillAndStroke(bgColor, BORDER_COLOR);
           
        // Draw vertical lines
        doc.moveTo(310, currentY).lineTo(310, currentY + thisRowHeight).stroke(BORDER_COLOR);
        doc.moveTo(470, currentY).lineTo(470, currentY + thisRowHeight).stroke(BORDER_COLOR);
        
        const fontSize = isSubtotal ? 11 : 10;
        const fontWeight = isSubtotal ? 'Helvetica-Bold' : 'Helvetica';
        const textColor = isSubtotal ? BRAND_BLUE : TEXT_DARK;
        
        doc.fillColor(textColor)
           .fontSize(fontSize)
           .font(fontWeight)
           .text(description, 30, currentY + (thisRowHeight - fontSize) / 2, { width: 270 })
           .text(calculation, 320, currentY + (thisRowHeight - fontSize) / 2, { width: 140, align: 'center' })
           .text(amount, 480, currentY + (thisRowHeight - fontSize) / 2, { width: 85, align: 'center' });
           
        currentY += thisRowHeight;
      };

      // Room charges
      drawTableRow(
        'Base Room Price (per night)',
        `$${basePricePerNight.toFixed(2)}`,
        '-'
      );
      drawTableRow(
        'Nights',
        `${nights}`,
        '-'
      );
      drawTableRow(
        'Rooms',
        `${rooms}`,
        '-'
      );
      
      drawTableRow(
        `Room Total (${basePricePerNight.toFixed(2)} × ${nights} nights × ${rooms} rooms)`,
        `${basePricePerNight.toFixed(2)} × ${nights} × ${rooms}`,
        `$${roomTotal.toFixed(2)}`
      );

      // Meal plan
      if (mealPlan && mealPlan.total > 0) {
        let price = 0;
        if (typeof mealPlan.price === 'number') price = mealPlan.price;
        else if (typeof mealPlan.price === 'string') price = parseFloat(mealPlan.price) || 0;
        let mealTotalAdults = Number(booking.adults) || 0;
        let mealTotalChildren = Array.isArray(booking.children) ? booking.children.length : 0;
        let mealPersons = mealTotalAdults + mealTotalChildren;
        if (!mealPersons && (mealPlan.persons || pb.persons || booking.persons)) {
          mealPersons = Number(mealPlan.persons || pb.persons || booking.persons) || 1;
        }
        const mealPlanTotal = price * mealPersons * nights;
        drawTableRow(
          `Meal Plan (${mealPlan.type} × ${nights} nights × ${mealPersons} guests)`,
          `${price.toFixed(2)} × ${nights} × ${mealPersons}`,
          `$${mealPlanTotal.toFixed(2)}`
        );
      }

      // Market surcharge
      if (marketSurcharge && marketSurcharge.total > 0) {
        const msTotal = marketSurcharge.total || 0;
        const msPerNightRoom = nights && rooms ? (msTotal / (nights * rooms)) : msTotal;
        
        drawTableRow(
          `Market Surcharge (${marketSurcharge.type} × ${nights} nights × ${rooms} rooms)`,
          `${msPerNightRoom.toFixed(2)} × ${nights} × ${rooms}`,
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
            `Discount (${desc})`,
            '-',
            `-$${discountValue.toFixed(2)}`
          );
        });
      }

      // Subtotal
      const subtotal = roomTotal + 
                      (mealPlan ? (mealPlan.total || 0) : 0) + 
                      (marketSurcharge ? (marketSurcharge.total || 0) : 0) - 
                      discountTotal;

      currentY += 5;
      
      // Total due 
      drawTableRow(
        'TOTAL DUE',
        '-',
        `$${subtotal.toFixed(2)}`,
        true,
        LIGHT_GRAY
      );

      currentY += 20; 
      const paymentBoxHeight = 80;
      
      doc.rect(20, currentY, 555, paymentBoxHeight)
         .fillAndStroke(BACKGROUND_WHITE, BORDER_COLOR);

      doc.rect(20, currentY, 555, 25)
         .fillAndStroke(BRAND_BLUE, BORDER_COLOR);
         
      doc.fillColor('#ffffff')
         .fontSize(12)
         .font('Helvetica-Bold')
         .text('PAYMENT INSTRUCTIONS', 30, currentY + 8);

      doc.fillColor(TEXT_DARK)
         .fontSize(10)
         .font('Helvetica')
         .text('• Payment is due within 7 days from the invoice date', 30, currentY + 35)
         .text('• Bank transfer details will be provided separately', 30, currentY + 50)
         .text('• Please include the invoice number as payment reference', 30, currentY + 65);

      // SIGNATURE SECTION
      currentY += paymentBoxHeight + 20; 
      
      doc.fontSize(10)
         .font('Helvetica-Bold')
         .fillColor(TEXT_DARK)
         .text('Thanks, and regards,', 20, currentY)
         .text('Accounts Team', 20, currentY + 14);

      try {
        const logoPath = path.join(__dirname, '../../Client/public/Logo.png');
        if (fs.existsSync(logoPath)) {
          doc.image(logoPath, 20, currentY + 30, { width: 30 });
        }
      } catch (err) {
        console.warn('Error adding signature logo:', err.message);
      }

      doc.fontSize(9)
         .font('Helvetica')
         .fillColor(BRAND_BLUE)
         .text('WhatsApp: +960 9385050', 20, currentY + 68)
         .text('Email: accounts@yomaldives.travel', 20, currentY + 80);
      doc.end();

      writeStream.on('finish', () => resolve(outputPath));
      writeStream.on('error', reject);

    } catch (error) {
      reject(error);
    }
  });
}

module.exports = { generateBookingVoucher, generatePaymentInvoice };