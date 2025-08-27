// Test script for room inquiry API
const axios = require('axios');

async function testRoomInquiry() {
  const roomInquiryData = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone_number: "+1 123-456-7890",
    guest_count: 2,
    message: "Looking forward to staying at this beautiful hotel!",
    inquiry_type: "room",
    room_id: "room123",
    hotel_id: "hotel456",
    room_name: "Deluxe Ocean View",
    hotel_name: "Sunset Resort Maldives",
    base_price_per_night: 250,
    meal_plan: "Half Board",
    market: "Europe",
    check_in: "2025-09-15T00:00:00.000Z",
    check_out: "2025-09-18T00:00:00.000Z"
  };

  try {
    console.log('Testing room inquiry API...');
    console.log('Sending data:', JSON.stringify(roomInquiryData, null, 2));

    const response = await axios.post('http://localhost:5001/api/inquiries', roomInquiryData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Room inquiry submitted successfully!');
    console.log('Response:', response.data);

  } catch (error) {
    console.error('❌ Error submitting room inquiry:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Run the test
testRoomInquiry();
