const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Generates a PDF quote for a booking
 * @param {Object} booking - The booking object
 * @param {Object} agent - The agent object
 * @param {number} profitMargin - The profit margin percentage
 * @param {string} marginType - The type of margin (e.g., 'percentage')
 * @returns {Promise<string>} - Path to the generated PDF file
 */
async function generateCustomerQuote(booking = {}, agent = {}, profitMargin = 0, marginType = 'percentage') {
  return new Promise((resolve, reject) => {
    const COLORS = {
      primary: '#1E40AF',
      primaryLight: '#3B82F6',
      secondary: '#F8FAFC',
      accent: '#10B981',
      warning: '#F59E0B',
      background: '#FFFFFF',
      surface: '#F1F5F9',
      text: {
        primary: '#1F2937',
        secondary: '#6B7280',
        light: '#9CA3AF',
        white: '#FFFFFF'
      },
      border: '#000000', 
      success: '#059669'
    };

    // Colors for Price and Arrival Instructions
    const SECONDARY_COLORS = {
      BRAND_BLUE: '#054B99',
      BRAND_BLUE_LIGHT: '#2D7DD2',
      LIGHT_BLUE: '#EDF6FF',
      LIGHT_YELLOW: '#FFFDE7',
      TEXT_DARK: '#333333',
      TEXT_LIGHT: '#666666',
      BORDER_LIGHT: '#000000', 
      BG_GRAY: '#F8F9FA'
    };

    // Create PDF with metadata and margins
    const doc = new PDFDocument({
      size: 'A4',
      margin: 6,
      bufferPages: true,
      info: {
        Title: `Customer Quote - ${(booking.bookingReference || booking._id || 'N/A')}`,
        Author: 'Yomaldives Holidays',
        Subject: 'Customer Quote',
        Keywords: 'maldives, travel, quote, pricing'
      }
    });

    // Create tmp directory 
    const tmpDir = path.join(__dirname, '../tmp');
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }

    const outputPath = path.join(tmpDir, `quote-${booking._id || 'unknown'}.pdf`);
    const writeStream = fs.createWriteStream(outputPath);
    doc.pipe(writeStream);

    // Helper functions
    const formatDate = (iso) => {
      return new Date(iso).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }) || 'N/A';
    };

    const formatCompactDate = (iso) => {
      return new Date(iso).toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }) || 'N/A';
    };

    // Calculate nights 
    const nights = booking.nights ||
      (booking.checkIn && booking.checkOut
        ? Math.ceil((new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24))
        : 'TBD');

    const addShadow = (x, y, width, height, radius = 0) => {
      doc.save()
         .fillColor('#000000', 0.1)
         .roundedRect(x + 2, y + 2, width, height, radius)
         .fill()
         .restore();
    };

    const createCard = (x, y, width, height, title, content) => {
      addShadow(x, y, width, height, 8);
      doc.roundedRect(x, y, width, height, 8)
         .fillAndStroke(COLORS.background, COLORS.border)
         .strokeColor(COLORS.border)
         .lineWidth(1.5);
      doc.roundedRect(x, y, width, 35, 8)
         .fill(COLORS.primary);
      doc.fillColor(COLORS.text.white)
         .fontSize(14)
         .font('Helvetica-Bold')
         .text(title, x + 15, y + 12, { width: width - 30 });
      doc.fillColor(COLORS.text.primary)
         .fontSize(10)
         .font('Helvetica')
         .text(content, x + 15, y + 45, {
           width: width - 30,
           lineGap: 6,
           height: height - 50
         });
    };

    // HEADER
    const headerHeight = 80;
    doc.rect(0, 0, doc.page.width, headerHeight)
       .fill(COLORS.border);
    const logoPath = path.join(__dirname, '../../Client/public/Logo.png');
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 40, 15, { width: 55 });
    }
    doc.fillColor(COLORS.text.white)
       .fontSize(20)
       .font('Helvetica-Bold')
       .text('Yomaldives', 105, 30)
       .fontSize(10)
       .font('Helvetica')
       .text('Maldives Wholesale Experts', 105, 54);
    doc.fillColor('white')
   .fontSize(8)
   .text('WhatsApp: +960 9385050', doc.page.width - 240, 40, {
     align: 'right',
     width: 230
   })
   .text('Email: reservations@yomaldives.travel', doc.page.width - 240, 50, {
     align: 'right',
     width: 230
   });

    // QUOTE TITLE SECTION
    const titleY = headerHeight + 12;
    addShadow(40, titleY, doc.page.width - 80, 35, 8);
    doc.roundedRect(40, titleY, doc.page.width - 80, 35, 8)
       .fillAndStroke(COLORS.accent, COLORS.border)
       .strokeColor(COLORS.border)
       .lineWidth(1.5);
    doc.fillColor(COLORS.text.white)
       .fontSize(16)
       .font('Helvetica-Bold')
       .text('CUSTOMER QUOTE', 0, titleY + 10, {
         align: 'center',
         width: doc.page.width
       });

    // CONFIRMATION DETAILS
    const confirmBoxY = titleY + 50;
    const createdDate = booking.createdAt ? formatDate(booking.createdAt) : formatDate(new Date());
    doc.roundedRect(40, confirmBoxY, doc.page.width - 80, 30, 6)
       .fillAndStroke(COLORS.surface, COLORS.border)
       .strokeColor(COLORS.border)
       .lineWidth(1.5);
    doc.fillColor(COLORS.text.primary)
       .fontSize(10)
       .font('Helvetica-Bold')
       .text(`Confirmation No: ${booking.bookingReference || booking._id || 'N/A'}`, 50, confirmBoxY + 10)
       .font('Helvetica')
       .text(`Date: ${createdDate}`, doc.page.width - 190, confirmBoxY + 10);

    // GREETING
    const clientName = booking.clientDetails?.name || booking.name || booking.tour || 'Valued Client';
    const greetingY = confirmBoxY + 45;
    doc.fontSize(11)
       .font('Helvetica')
       .fillColor(COLORS.text.primary)
       .text(`Dear ${clientName},`, 40, greetingY);
    doc.fontSize(10)
       .font('Helvetica')
       .fillColor(COLORS.text.secondary)
       .text('Thank you for choosing Yomaldives Holidays. We are pleased to confirm your reservation:', 40, greetingY + 20, {
         width: doc.page.width - 80,
         lineGap: 5
       });

    // AGENT INFORMATION TABLE 
    const agentTableTop = greetingY + 40;
    const agentColWidths = [30, 120, 100, 150, 100];
    const agentColStarts = [40, 70, 190, 290, 440];
    addShadow(40, agentTableTop, doc.page.width - 80, 30, 8);
    doc.rect(40, agentTableTop, doc.page.width - 80, 30)
       .fill(COLORS.primary)
       .strokeColor(COLORS.border)
       .lineWidth(1.5)
       .stroke();
    doc.fillColor(COLORS.text.white)
       .fontSize(9)
       .font('Helvetica-Bold');
    const headers = ['NO', 'Agent Name', 'Agency', 'Email', 'Contact Number'];
    headers.forEach((header, i) => {
      doc.text(header, agentColStarts[i], agentTableTop + 10, {
        width: agentColWidths[i],
        align: 'center'
      });
    });
    doc.strokeColor(COLORS.border)
       .lineWidth(1.5)
       .rect(40, agentTableTop, doc.page.width - 80, 30)
       .stroke();
    agentColStarts.slice(1).forEach(col => {
      doc.moveTo(col, agentTableTop)
         .lineTo(col, agentTableTop + 30)
         .stroke();
    });
    doc.font('Helvetica').fillColor(COLORS.text.primary);
    let currentAgentY = agentTableTop + 30;
    const agentRowHeight = 30;
    const agencyProfile = booking.user?.agencyProfile;
    const agents = [{
      name: agencyProfile?.username || agent.name || 'N/A',
      agency: agencyProfile?.agencyName || agent.agency || 'Independent Agent',
      email: booking.user?.email || agent.email || 'N/A',
      contact: agencyProfile?.phoneNumber || agencyProfile?.mobilePhone || agencyProfile?.phoneNumber2 || agent.phone || '+960 9385050'
    }];
    agents.forEach((agent, index) => {
      if (index % 2 === 0) {
        doc.fillColor(COLORS.secondary)
           .rect(40, currentAgentY, doc.page.width - 80, agentRowHeight)
           .fill();
      }
      doc.strokeColor(COLORS.border)
         .lineWidth(1.5)
         .rect(40, currentAgentY, doc.page.width - 80, agentRowHeight)
         .stroke();
      agentColStarts.slice(1).forEach(col => {
        doc.moveTo(col, currentAgentY)
           .lineTo(col, currentAgentY + agentRowHeight)
           .stroke();
      });
      doc.fillColor(COLORS.text.primary)
         .fontSize(9);
      const texts = [
        (index + 1).toString(),
        agent.name,
        agent.agency,
        agent.email,
        agent.contact
      ];
      texts.forEach((text, i) => {
        doc.text(text || 'N/A', agentColStarts[i], currentAgentY + 10, {
          width: agentColWidths[i],
          align: 'center'
        });
      });
      currentAgentY += agentRowHeight;
    });

    // --- Client Details Table  ---
    const isHotelBooking = !booking.tour;
    let clientColWidths, clientColStarts, clientHeaders;
    if (isHotelBooking) {
      clientColWidths = [30, 120, 150, 120, 100];
      clientColStarts = [40, 70, 190, 340, 460];
      clientHeaders = ['NO', 'Client Name', 'Email', 'Contact Number', 'Company'];
    } else {
      clientColWidths = [30, 150, 200, 120];
      clientColStarts = [40, 70, 220, 420];
      clientHeaders = ['NO', 'Client Name', 'Email', 'Contact Number'];
    }    const clientTableTop = currentAgentY + 15;
    const clientRowHeight = 30;
    // Header row
    addShadow(40, clientTableTop, doc.page.width - 80, clientRowHeight, 8);
    doc.rect(40, clientTableTop, doc.page.width - 80, clientRowHeight)
       .fill(COLORS.primary);
    // Draw outer border
    doc.strokeColor(COLORS.border)
       .lineWidth(1.5)
       .rect(40, clientTableTop, doc.page.width - 80, clientRowHeight)
       .stroke();
    clientColStarts.slice(1).forEach(col => {
      doc.moveTo(col, clientTableTop)
         .lineTo(col, clientTableTop + clientRowHeight)
         .stroke();
    });
    doc.fillColor(COLORS.text.white)
      .fontSize(9)
      .font('Helvetica-Bold');
    clientHeaders.forEach((header, i) => {
      doc.text(header, clientColStarts[i], clientTableTop + 10, {
        width: clientColWidths[i],
        align: 'center'
      });
    });    // Data row
    const clientRowY = clientTableTop + clientRowHeight;
    addShadow(40, clientRowY, doc.page.width - 80, clientRowHeight, 8);
    // Fill row background
    doc.rect(40, clientRowY, doc.page.width - 80, clientRowHeight)
       .fill(COLORS.secondary);
    doc.strokeColor(COLORS.border)
       .lineWidth(1.5)
       .rect(40, clientRowY, doc.page.width - 80, clientRowHeight)
       .stroke();
    clientColStarts.slice(1).forEach(col => {
      doc.moveTo(col, clientRowY)
         .lineTo(col, clientRowY + clientRowHeight)
         .stroke();
    });
    doc.fillColor(COLORS.text.primary)
      .fontSize(9)
      .font('Helvetica');
    // Fetch client details as in Bookings.jsx 
    let client = {};
    if (booking.clientDetails && (booking.clientDetails.name || booking.clientDetails.email || booking.clientDetails.phone || booking.clientDetails.mobile || booking.clientDetails.phoneNumber || booking.clientDetails.phone_number || booking.clientDetails.contactNumber || booking.clientDetails.contact_number || booking.clientDetails.companyName)) {
      client = booking.clientDetails;
    } else if (booking.contact && (booking.contact.name || booking.contact.email || booking.contact.phone || booking.contact.mobile || booking.contact.phoneNumber || booking.contact.phone_number || booking.contact.contactNumber || booking.contact.contact_number || booking.contact.companyName)) {
      client = booking.contact;
    } else if (booking.name || booking.email || booking.phone || booking.mobile || booking.phoneNumber || booking.phone_number || booking.contactNumber || booking.contact_number || booking.companyName) {
      client = {
        name: booking.name || 'N/A',
        email: booking.email || 'N/A',
        phone: booking.phone || booking.mobile || booking.phoneNumber || booking.phone_number || booking.contactNumber || booking.contact_number || 'N/A',
        companyName: booking.companyName || 'N/A'
      };
    } else {
      client = { name: 'N/A', email: 'N/A', phone: 'N/A', companyName: 'N/A' };
    }
    const clientPhone = client.phone || client.mobile || client.phoneNumber || client.phone_number || client.contactNumber || client.contact_number || 'N/A';
    let clientData;
    if (isHotelBooking) {
      clientData = [
        '1',
        client.name || 'N/A',
        client.email || 'N/A',
        clientPhone,
        client.companyName || 'N/A'
      ];
    } else {
      clientData = [
        '1',
        client.name || 'N/A',
        client.email || 'N/A',
        clientPhone
      ];
    }
    clientData.forEach((text, i) => {
      doc.text(text, clientColStarts[i], clientRowY + 10, {
        width: clientColWidths[i],
        align: 'center'
      });
    });
    let detailsY = clientRowY + clientRowHeight + 10;

    // --- Booking Details Cards ---
    const cardWidth = (doc.page.width - 100) / 2;
    const cardSpacing = 20;
    if (booking.tour) {
      const tourContent = [
        `Tour: ${booking.tour || 'Custom Tour Package'}`,
        `Travel Date: ${booking.travel_date ? formatCompactDate(booking.travel_date) : 'TBD'}`,
        `Duration: ${booking.selected_nights_key || nights || 'TBD'} Nights`
      ].join('\n');
      createCard(40, detailsY, cardWidth, 120, 'Tour Details', tourContent);
      const specificsContent = [
        `Travelers: ${booking.traveller_count || 1} Person(s)`,
        `Food: ${booking.selected_food_category || 'Standard'}`,
        `Package: ${booking.selected_nights_option || 'Standard'}`
      ].join('\n');
      createCard(40 + cardWidth + cardSpacing, detailsY, cardWidth, 120, 'Tour Specifics', specificsContent);
      // Only show Special Requirements card if there is content
      if (booking.message || booking.special_requirements) {
        createCard(
          40,
          detailsY + 130,
          doc.page.width - 80,
          80,
          'Special Requirements',
          booking.message || booking.special_requirements
        );
      }
    } else {
      // Stay Information (left)
      const stayContent = [
        `Hotel: ${booking?.hotel?.name || 'N/A'}`,
        `Room: ${booking?.room?.roomName || booking?.room?.name || 'N/A'}`,
        `Meal Plan: ${booking.mealPlan || 'Half Board'}`
      ].join('\n');
      createCard(40, detailsY, cardWidth, 120, 'Stay Information', stayContent);
      // Dates (right)
      let guestsText = `${Number(booking.adults) || 0} Adult${Number(booking.adults) === 1 ? '' : 's'}`;
      let childrenCount = 0;
      let childrenAges = '';
      if (Array.isArray(booking.children)) {
        childrenCount = booking.children.length;
        const ages = booking.children.map(c => (typeof c === 'object' && c && c.age ? c.age : null)).filter(age => age !== null);
        if (ages.length === childrenCount && childrenCount > 0) {
          childrenAges = ages.join(', ');
        }
      } else if (typeof booking.children === 'number') {
        childrenCount = booking.children;
      } else if (typeof booking.children === 'object' && booking.children !== null) {
        childrenCount = 1;
        if (booking.children.age) {
          childrenAges = booking.children.age;
        }
      }
      if (childrenCount > 0) {
        guestsText += `, ${childrenCount} Child${childrenCount === 1 ? '' : 'ren'}`;
        if (childrenAges) {
          guestsText += ` (Ages: ${childrenAges})`;
        }
      } else {
        guestsText += ', 0 Children';
      }
      const travelContent = [
        `Check-in: ${booking.checkIn ? formatCompactDate(booking.checkIn) : 'TBD'}`,
        `Check-out: ${booking.checkOut ? formatCompactDate(booking.checkOut) : 'TBD'}`,
        `Duration: ${nights} Nights`,
        `Guests: ${guestsText}`
      ].join('\n');
      createCard(40 + cardWidth + cardSpacing, detailsY, cardWidth, 120, 'Dates', travelContent);
      // Booking Information (left, below Stay Information)
      const bookingInfoContent = [
        `Quote No: ${booking.bookingReference || 'BK-1747712641583'}`,
        `Status: Confirmed`,
        `Package: ${booking.packageName || 'Standard Package'}`
      ].join('\n');
      createCard(40, detailsY + 130, cardWidth, 100, 'Booking Information', bookingInfoContent);
      // Transportation Methods 
      let transportationsText = 'Not Specified';
      if (Array.isArray(booking.transportations) && booking.transportations.length > 0) {
        transportationsText = booking.transportations.map(t => {
          let type = t.type;
          if (typeof type === 'string') {
            if (type.toLowerCase() === 'arrival') type = 'Arrival';
            else if (type.toLowerCase() === 'departure') type = 'Departure';
            else type = type.charAt(0).toUpperCase() + type.slice(1);
          }
          return `${type}: ${t.method}`;
        }).join('\n');
      }
      createCard(40 + cardWidth + cardSpacing, detailsY + 130, cardWidth, 100, 'Transportation Methods', transportationsText);
    }

    // PRICE SECTION
    const priceY = detailsY + (booking.tour ? (booking.message || booking.special_requirements ? 220 : 140) : 240);
    const priceBoxHeight = 60;
    doc.roundedRect(40, priceY, doc.page.width - 80, priceBoxHeight)
       .fillAndStroke('white', SECONDARY_COLORS.BORDER_LIGHT)
       .strokeColor(COLORS.border)
       .lineWidth(1.5);
    doc.rect(40, priceY, doc.page.width - 80, 30, 8)
       .fill(SECONDARY_COLORS.BRAND_BLUE);
    doc.fillColor('white')
       .fontSize(14)
       .font('Helvetica-Bold')
       .text('PRICE', 50, priceY + 10);   
    const basePrice = booking.final_price || booking.priceBreakdown?.total || 0;
    const total = parseFloat(basePrice) * (1 + (parseFloat(profitMargin) / 100));    
    doc.font('Helvetica-Bold')
       .fillColor(SECONDARY_COLORS.BRAND_BLUE)
       .fontSize(11)
       .text('Total Price:', 50, priceY + 36)
       .text(`$${total.toFixed(2)}`, doc.page.width - 150, priceY + 36, { align: 'center' });

    // ARRIVAL INSTRUCTIONS BOX
    const arrivalY = priceY + priceBoxHeight + 10;
    doc.roundedRect(40, arrivalY, doc.page.width - 80, 40)
       .fillAndStroke(SECONDARY_COLORS.LIGHT_YELLOW, SECONDARY_COLORS.BORDER_LIGHT)
       .strokeColor(COLORS.border)
       .lineWidth(1.5);
    doc.fillColor(SECONDARY_COLORS.TEXT_DARK)
       .fontSize(9)
       .font('Helvetica')
       .text(
         'Upon arrival, please look for the "Yomaldives" name board at the airport. If you don\'t find our representative, please contact us immediately or seek assistance from the information counter.',
         50, arrivalY + 8, { width: doc.page.width - 100 }
       );

    // SIGNATURE
    const signatureY = arrivalY + 52;
    doc.fontSize(10)
       .font('Helvetica-Bold')
       .fillColor(COLORS.text.primary)
       .text('Thanks, and regards,', 40, signatureY)
       .fontSize(12)
       .fillColor(COLORS.primary)
       .text('Sales Team', 40, signatureY + 20);
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 40, signatureY + 35, { width: 35 });
    }
    doc.fontSize(9)
       .font('Helvetica')
       .fillColor(COLORS.primary)
       .text('WhatsApp: +960 9385050', 40, signatureY + 80)
       .text('Email: reservations@yomaldives.travel', 40, signatureY + 90);

    // Finalize the PDF
    doc.end();
    writeStream.on('finish', () => resolve(outputPath));
    writeStream.on('error', reject);
  });
}

module.exports = { generateCustomerQuote };