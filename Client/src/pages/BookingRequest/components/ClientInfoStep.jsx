import { countries } from "../../../assets/nationalities"

const ClientInfoStep = ({
  bookingData,
  handleChange,
  errors,
  passengerDetails,
  handlePassengerChange,
  childPassengerDetails,
  handleChildPassengerChange,
  bookingData: { adults, children, childrenAges }
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

        {/* Adult Guests */}
        <div className="mb-6">
          <h4 className="font-medium text-[#0A435C] mb-3">Adult Guests</h4>
          {[...Array(adults)].map((_, idx) => (
            <div key={`adult-${idx}`} className="mb-8 p-4 border border-gray-200 rounded-lg bg-[#E7E9E5]">
              <h4 className="font-medium text-gray-700 mb-2">Adult {idx + 1}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={passengerDetails[idx]?.name || ''}
                    onChange={e => handlePassengerChange(idx, "name", e.target.value)}
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
                    value={passengerDetails[idx]?.passport || ''}
                    onChange={e => handlePassengerChange(idx, "passport", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={passengerDetails[idx]?.country || ''}
                    onChange={e => handlePassengerChange(idx, "country", e.target.value)}
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
                    value={passengerDetails[idx]?.arrivalFlightNumber || ''}
                    onChange={e => handlePassengerChange(idx, "arrivalFlightNumber", e.target.value)}
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
                    value={passengerDetails[idx]?.arrivalTime || ''}
                    onChange={e => handlePassengerChange(idx, "arrivalTime", e.target.value)}
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
                    value={passengerDetails[idx]?.departureFlightNumber || ''}
                    onChange={e => handlePassengerChange(idx, "departureFlightNumber", e.target.value)}
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
                    value={passengerDetails[idx]?.departureTime || ''}
                    onChange={e => handlePassengerChange(idx, "departureTime", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    required
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Child Guests */}
        {children > 0 && (
          <div className="mb-6">
            <h4 className="font-medium text-[#0A435C] mb-3">Child Guests</h4>
            {[...Array(children)].map((_, idx) => (
              <div key={`child-${idx}`} className="mb-8 p-4 border border-gray-200 rounded-lg bg-indigo-50">
                <h4 className="font-medium text-gray-700 mb-2 flex items-center">Child {idx + 1}
                  <span className="ml-3 text-xs font-semibold text-indigo-700 bg-indigo-100 px-2 py-1 rounded-full">
                    Age: {childrenAges?.[idx] ? `${childrenAges[idx]} ${childrenAges[idx] === 1 ? 'year' : 'years'}` : 'N/A'}
                  </span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={childPassengerDetails[idx]?.name || ''}
                      onChange={e => handleChildPassengerChange(idx, "name", e.target.value)}
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
                      value={childPassengerDetails[idx]?.passport || ''}
                      onChange={e => handleChildPassengerChange(idx, "passport", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={childPassengerDetails[idx]?.country || ''}
                      onChange={e => handleChildPassengerChange(idx, "country", e.target.value)}
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
                      value={childPassengerDetails[idx]?.arrivalFlightNumber || ''}
                      onChange={e => handleChildPassengerChange(idx, "arrivalFlightNumber", e.target.value)}
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
                      value={childPassengerDetails[idx]?.arrivalTime || ''}
                      onChange={e => handleChildPassengerChange(idx, "arrivalTime", e.target.value)}
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
                      value={childPassengerDetails[idx]?.departureFlightNumber || ''}
                      onChange={e => handleChildPassengerChange(idx, "departureFlightNumber", e.target.value)}
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
                      value={childPassengerDetails[idx]?.departureTime || ''}
                      onChange={e => handleChildPassengerChange(idx, "departureTime", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ClientInfoStep
