require('dotenv').config();
const mongoose = require('mongoose');
const Hotel = require('./models/Hotel');
const Room = require('./models/Room');

async function createHotelWithRooms() {
  try {
    // Connect to MongoDB
    const MONGO_URI = process.env.MONGO_URI;
    await mongoose.connect(MONGO_URI, {
      dbName: 'tourism-website',
    });
    console.log("MongoDB connected");

    // Create hotel
    const hotelData = {
      name: 'Paradise Resort Maldives',
      location: 'North Malé Atoll, Maldives',
      starRating: 5,
      description: 'Luxurious overwater resort with stunning ocean views and world-class amenities.',
      descriptionShort: '5-star luxury resort in the Maldives',
      contactDetails: {
        phone: '+960-123-4567',
        email: 'info@paradiseresort.mv',
        website: 'www.paradiseresort.mv'
      },
      amenities: ['WiFi', 'Spa', 'Restaurant', 'Bar', 'Pool', 'Beach Access', 'Water Sports'],
      mealPlans: [
        {
          planName: 'Bed & Breakfast',
          description: 'Continental breakfast included',
          price: 0
        },
        {
          planName: 'Half Board',
          description: 'Breakfast and dinner included',
          price: 150
        },
        {
          planName: 'Full Board',
          description: 'All meals included',
          price: 300
        }
      ],
      dinningOptions: [
        {
          optionName: 'Ocean View Restaurant',
          description: 'Fine dining with ocean views',
          image: '',
          menu: 'International and local cuisine'
        }
      ],
      gallery: []
    };

    const hotel = new Hotel(hotelData);
    await hotel.save();
    console.log('Hotel created:', hotel.name);

    // Define date range for availability
    const startDate = new Date('2025-10-04');
    const endDate = new Date('2025-10-30');

    // Room types and data
    const roomsData = [
      {
        roomName: 'Deluxe Beach Villa',
        roomType: 'Beach Villa',
        description: 'Spacious beachfront villa with private beach access',
        size: 85,
        bedType: 'King Size',
        maxOccupancy: { adults: 2, children: 2 },
        amenities: ['Air Conditioning', 'Mini Bar', 'Safe', 'TV', 'Private Beach'],
        basePrice: 450
      },
      {
        roomName: 'Overwater Bungalow',
        roomType: 'Overwater Villa',
        description: 'Luxurious overwater bungalow with glass floor',
        size: 95,
        bedType: 'King Size',
        maxOccupancy: { adults: 2, children: 1 },
        amenities: ['Air Conditioning', 'Mini Bar', 'Safe', 'TV', 'Glass Floor', 'Direct Water Access'],
        basePrice: 650
      },
      {
        roomName: 'Presidential Suite',
        roomType: 'Suite',
        description: 'Exclusive presidential suite with panoramic views',
        size: 150,
        bedType: 'King Size',
        maxOccupancy: { adults: 4, children: 2 },
        amenities: ['Air Conditioning', 'Mini Bar', 'Safe', 'TV', 'Jacuzzi', 'Private Pool', 'Butler Service'],
        basePrice: 1200
      },
      {
        roomName: 'Garden Villa',
        roomType: 'Garden Villa',
        description: 'Peaceful garden villa surrounded by tropical vegetation',
        size: 70,
        bedType: 'Queen Size',
        maxOccupancy: { adults: 2, children: 2 },
        amenities: ['Air Conditioning', 'Mini Bar', 'Safe', 'TV', 'Garden View'],
        basePrice: 380
      },
      {
        roomName: 'Family Villa',
        roomType: 'Family Villa',
        description: 'Perfect for families with connecting rooms',
        size: 110,
        bedType: 'King Size + Twin',
        maxOccupancy: { adults: 4, children: 4 },
        amenities: ['Air Conditioning', 'Mini Bar', 'Safe', 'TV', 'Connecting Rooms', 'Kitchenette'],
        basePrice: 550
      }
    ];

    // Create rooms for the hotel
    for (let i = 0; i < roomsData.length; i++) {
      const roomInfo = roomsData[i];
      
      const roomData = {
        hotel: hotel._id,
        roomName: roomInfo.roomName,
        roomType: roomInfo.roomType,
        description: roomInfo.description,
        size: roomInfo.size,
        bedType: roomInfo.bedType,
        maxOccupancy: roomInfo.maxOccupancy,
        amenities: roomInfo.amenities,
        availabilityCalendar: [
          {
            startDate: startDate,
            endDate: endDate
          }
        ],
        gallery: [],
        prices: [
          {
            market: 'Standard',
            price: roomInfo.basePrice
          }
        ],
        pricePeriods: [
          {
            startDate: startDate,
            endDate: endDate,
            price: roomInfo.basePrice
          }
        ],
        transportations: [
          {
            type: 'arrival',
            method: 'Seaplane Transfer'
          },
          {
            type: 'departure',
            method: 'Seaplane Transfer'
          }
        ]
      };

      const room = new Room(roomData);
      await room.save();
      console.log(`Room created: ${room.roomName} - $${roomInfo.basePrice}/night`);
    }

    console.log(`\nSuccessfully created hotel "${hotel.name}" with ${roomsData.length} rooms`);
    console.log(`All rooms available from ${startDate.toDateString()} to ${endDate.toDateString()}`);

  } catch (error) {
    console.error('Error creating hotel and rooms:', error);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

// Run the script
createHotelWithRooms();
