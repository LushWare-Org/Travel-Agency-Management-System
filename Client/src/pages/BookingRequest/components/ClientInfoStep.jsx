import { countries } from "../../../assets/nationalities"

const ClientInfoStep = ({
  bookingData,
  handleChange,
  errors,
  passengerDetails,
  handlePassengerChange,
  handleChildPassengerChange,
  roomConfigs
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Guest Information</h2>
      <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-lg mb-8">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-[#005E84]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-indigo-800">
              Please ensure all guest information is accurate. Changes cannot be made after booking.
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Guest Name *</label>
            <input
              type="text"
              name="clientName"
              value={bookingData.clientName}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${
                errors.clientName ? "border-red-300" : "border-gray-300"
              } rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm`}
            />
            {errors.clientName && <p className="mt-1 text-xs text-red-600">{errors.clientName}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Guest Email *</label>
            <input
              type="email"
              name="clientEmail"
              value={bookingData.clientEmail}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${
                errors.clientEmail ? "border-red-300" : "border-gray-300"
              } rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm`}
            />
            {errors.clientEmail && <p className="mt-1 text-xs text-red-600">{errors.clientEmail}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Guest Phone *</label>
            <input
              type="text"
              name="clientPhone"
              value={bookingData.clientPhone}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${
                errors.clientPhone ? "border-red-300" : "border-gray-300"
              } rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm`}
            />
            {errors.clientPhone && <p className="mt-1 text-xs text-red-600">{errors.clientPhone}</p>}
          </div>
        </div>
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests</label>
          <textarea
            name="specialRequests"
            value={bookingData.specialRequests}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#005E84] focus:border-[#005E84] text-sm"
            placeholder="Enter any special requests or preferences..."
          />
        </div>
      </div>
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Guests Details</h3>

        {passengerDetails.map((room, roomIdx) => (
          <div key={`room-${roomIdx}`} className="mb-8 p-6 border border-gray-200 rounded-lg bg-gray-50">
            <h4 className="text-xl font-semibold text-[#0A435C] mb-4">Room {room.roomNumber}</h4>

            {/* Adult Guests for this room */}
            <div className="mb-6">
              <h5 className="font-medium text-[#0A435C] mb-3">Adult Guests ({room.adults.length})</h5>
              {room.adults.map((_, adultIdx) => (
                <div key={`adult-${roomIdx}-${adultIdx}`} className="mb-8 p-4 border border-gray-200 rounded-lg bg-white">
                  <h5 className="font-medium text-gray-700 mb-2">Adult {adultIdx + 1}</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={passengerDetails[roomIdx]?.adults[adultIdx]?.name || ''}
                        onChange={e => handlePassengerChange(roomIdx, adultIdx, "name", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Passport Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={passengerDetails[roomIdx]?.adults[adultIdx]?.passport || ''}
                        onChange={e => handlePassengerChange(roomIdx, adultIdx, "passport", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={passengerDetails[roomIdx]?.adults[adultIdx]?.country || ''}
                        onChange={e => handlePassengerChange(roomIdx, adultIdx, "country", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        required
                      >
                        <option value="">Select country</option>
                        {countries.map((c, i) => (
                          <option key={i} value={c.name}>{c.flag} {c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Arrival Flight Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={passengerDetails[roomIdx]?.adults[adultIdx]?.arrivalFlightNumber || ''}
                        onChange={e => handlePassengerChange(roomIdx, adultIdx, "arrivalFlightNumber", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Arrival Time <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="time"
                        value={passengerDetails[roomIdx]?.adults[adultIdx]?.arrivalTime || ''}
                        onChange={e => handlePassengerChange(roomIdx, adultIdx, "arrivalTime", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Departure Flight Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={passengerDetails[roomIdx]?.adults[adultIdx]?.departureFlightNumber || ''}
                        onChange={e => handlePassengerChange(roomIdx, adultIdx, "departureFlightNumber", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Departure Time <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="time"
                        value={passengerDetails[roomIdx]?.adults[adultIdx]?.departureTime || ''}
                        onChange={e => handlePassengerChange(roomIdx, adultIdx, "departureTime", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Child Guests for this room */}
            {room.children.length > 0 && (
              <div className="mb-6">
                <h5 className="font-medium text-[#0A435C] mb-3">Child Guests ({room.children.length})</h5>
                {room.children.map((_, childIdx) => {
                  return (
                    <div key={`child-${roomIdx}-${childIdx}`} className="mb-8 p-4 border border-gray-200 rounded-lg bg-indigo-50">
                      <h5 className="font-medium text-gray-700 mb-2 flex items-center">Child {childIdx + 1}
                        <span className="ml-3 text-xs font-semibold text-indigo-700 bg-indigo-100 px-2 py-1 rounded-full">
                          Age: {roomConfigs[roomIdx]?.childrenAges[childIdx] ? `${roomConfigs[roomIdx].childrenAges[childIdx]} ${roomConfigs[roomIdx].childrenAges[childIdx] === 1 ? 'year' : 'years'}` : 'N/A'}
                        </span>
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={passengerDetails[roomIdx]?.children[childIdx]?.name || ''}
                            onChange={e => handleChildPassengerChange(roomIdx, childIdx, "name", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Passport Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={passengerDetails[roomIdx]?.children[childIdx]?.passport || ''}
                            onChange={e => handleChildPassengerChange(roomIdx, childIdx, "passport", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Country <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={passengerDetails[roomIdx]?.children[childIdx]?.country || ''}
                            onChange={e => handleChildPassengerChange(roomIdx, childIdx, "country", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            required
                          >
                            <option value="">Select country</option>
                            {countries.map((c, i) => (
                              <option key={i} value={c.name}>{c.flag} {c.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Arrival Flight Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={passengerDetails[roomIdx]?.children[childIdx]?.arrivalFlightNumber || ''}
                            onChange={e => handleChildPassengerChange(roomIdx, childIdx, "arrivalFlightNumber", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Arrival Time <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="time"
                            value={passengerDetails[roomIdx]?.children[childIdx]?.arrivalTime || ''}
                            onChange={e => handleChildPassengerChange(roomIdx, childIdx, "arrivalTime", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Departure Flight Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={passengerDetails[roomIdx]?.children[childIdx]?.departureFlightNumber || ''}
                            onChange={e => handleChildPassengerChange(roomIdx, childIdx, "departureFlightNumber", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Departure Time <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="time"
                            value={passengerDetails[roomIdx]?.children[childIdx]?.departureTime || ''}
                            onChange={e => handleChildPassengerChange(roomIdx, childIdx, "departureTime", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ClientInfoStep
