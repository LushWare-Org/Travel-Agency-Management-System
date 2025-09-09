import { useState } from 'react';

const defaultMarkets = [
  'India',
  'China',
  'Middle East',
  'South East Asia',
  'Asia',
  'Europe',
  'Russia & CIS',
];

const transportationOptions = [
  {
    type: 'arrival',
    methods: ['Speedboat Transfer', 'Seaplane Transfer', 'Private Transfer', 'Shared Transfer', 'Domestic Flight']
  },
  {
    type: 'departure',
    methods: ['Speedboat Transfer', 'Seaplane Transfer', 'Private Transfer', 'Shared Transfer', 'Domestic Flight']
  }
];

export const useRoomForm = (customMarkets, setCustomMarkets) => {
  const [form, setForm] = useState({
    hotelId: '',
    roomName: '',
    roomType: '',
    description: '',
    size: '',
    bedType: '',
    maxAdults: '',
    maxChildren: '',
    amenities: [],
    amenityInput: '',
    basePrice: '',
    availabilityCalendar: [],
    availStart: null,
    availEnd: null,
    gallery: [],
    prices: [],
    priceMarketInput: '',
    priceValueInput: '',
    pricePeriods: [],
    pricePeriodStart: null,
    pricePeriodEnd: null,
    pricePeriodValue: '',
    transportations: [],
    newTransportType: '',
    newTransportMethod: '',
    newMarketInput: '',
  });

  const markets = [...defaultMarkets, ...customMarkets];

  const resetForm = () => setForm({
    hotelId: '',
    roomName: '',
    roomType: '',
    description: '',
    size: '',
    bedType: '',
    maxAdults: '',
    maxChildren: '',
    amenities: [],
    amenityInput: '',
    basePrice: '',
    availabilityCalendar: [],
    availStart: null,
    availEnd: null,
    gallery: [],
    prices: [],
    priceMarketInput: '',
    priceValueInput: '',
    pricePeriods: [],
    pricePeriodStart: null,
    pricePeriodEnd: null,
    pricePeriodValue: '',
    transportations: [],
    newTransportType: '',
    newTransportMethod: '',
    newMarketInput: '',
  });

  const populateForm = (room) => {
    if (room) {
      setForm({
        hotelId: room.hotel?._id || room.hotel || '',
        roomName: room.roomName || '',
        roomType: room.roomType || '',
        description: room.description || '',
        size: room.size || '',
        bedType: room.bedType || '',
        maxAdults: room.maxOccupancy?.adults || '',
        maxChildren: room.maxOccupancy?.children || '',
        amenities: room.amenities || [],
        amenityInput: '',
        basePrice: room.basePrice || '',
        availabilityCalendar: (room.availabilityCalendar || []).map(r => ({
          startDate: new Date(r.startDate),
          endDate: new Date(r.endDate)
        })),
        availStart: null,
        availEnd: null,
        gallery: room.gallery || [],
        prices: (room.prices || []).map(p => ({
          market: p.market || '',
          price: p.price || 0
        })),
        priceMarketInput: '',
        priceValueInput: '',
        pricePeriods: (room.pricePeriods || []).map(p => ({
          startDate: new Date(p.startDate),
          endDate: new Date(p.endDate),
          price: p.price || 0
        })),
        pricePeriodStart: null,
        pricePeriodEnd: null,
        pricePeriodValue: '',
        transportations: room.transportations || [],
        newTransportType: '',
        newTransportMethod: '',
        newMarketInput: '',
      });
    } else {
      resetForm();
    }
  };

  const addAvailability = () => {
    if (form.availStart && form.availEnd) {
      setForm(f => ({
        ...f,
        availabilityCalendar: [...f.availabilityCalendar, { startDate: f.availStart, endDate: f.availEnd }],
        availStart: null,
        availEnd: null
      }));
    }
  };

  const removeAvailability = (idx) => {
    setForm(f => ({
      ...f,
      availabilityCalendar: f.availabilityCalendar.filter((_, i) => i !== idx)
    }));
  };

  const addPriceEntry = () => {
    if (form.priceMarketInput && form.priceValueInput) {
      const marketName = form.priceMarketInput.trim();
      const price = Number(form.priceValueInput);
      if (marketName && !isNaN(price)) {
        const existingIndex = form.prices.findIndex(p => p.market === marketName);
        if (existingIndex >= 0) {
          const updatedPrices = [...form.prices];
          updatedPrices[existingIndex] = { market: marketName, price };
          setForm(f => ({
            ...f,
            prices: updatedPrices,
            priceMarketInput: '',
            priceValueInput: ''
          }));
        } else {
          setForm(f => ({
            ...f,
            prices: [...f.prices, { market: marketName, price }],
            priceMarketInput: '',
            priceValueInput: ''
          }));
        }
      }
    }
  };

  const addPricePeriod = () => {
    if (form.pricePeriodStart && form.pricePeriodEnd && form.pricePeriodValue) {
      setForm(f => ({
        ...f,
        pricePeriods: [
          ...f.pricePeriods,
          {
            startDate: f.pricePeriodStart,
            endDate: f.pricePeriodEnd,
            price: Number(form.pricePeriodValue)
          },
        ],
        pricePeriodStart: null,
        pricePeriodEnd: null,
        pricePeriodValue: ''
      }));
    }
  };

  const removePricePeriod = (idx) => {
    setForm(f => ({
      ...f,
      pricePeriods: f.pricePeriods.filter((_, i) => i !== idx)
    }));
  };

  const addTransportation = () => {
    if (form.newTransportType && form.newTransportMethod) {
      setForm(f => ({
        ...f,
        transportations: [
          ...f.transportations,
          { type: f.newTransportType, method: f.newTransportMethod }
        ],
        newTransportType: '',
        newTransportMethod: ''
      }));
    }
  };

  const removeTransportation = (idx) => {
    setForm(f => ({
      ...f,
      transportations: f.transportations.filter((_, i) => i !== idx)
    }));
  };

  const addCustomMarket = () => {
    const newMarket = form.newMarketInput.trim();
    if (newMarket && !markets.includes(newMarket)) {
      setCustomMarkets(prev => [...prev, newMarket]);
      setForm(f => ({ ...f, newMarketInput: '' }));
    }
  };

  const removeCustomMarket = (idx) => {
    setCustomMarkets(prev => prev.filter((_, i) => i !== idx));
    setForm(f => ({
      ...f,
      prices: f.prices.filter(p => p.market !== customMarkets[idx])
    }));
  };

  const handleChange = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
  };

  return {
    form,
    setForm,
    markets,
    transportationOptions,
    resetForm,
    populateForm,
    addAvailability,
    removeAvailability,
    addPriceEntry,
    addPricePeriod,
    removePricePeriod,
    addTransportation,
    removeTransportation,
    addCustomMarket,
    removeCustomMarket,
    handleChange,
  };
};
