const ConfirmationStep = ({ bookingData, hotelName, navigate }) => {
  return (
    <div className="text-center py-12">
      <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Booking Request Submitted!</h2>
      <p className="text-gray-600 max-w-md mx-auto mb-8">
        Your booking request for {hotelName} has been successfully submitted. You will receive a
        confirmation email soon.
      </p>
      <div className="bg-indigo-50 rounded-lg p-6 max-w-md mx-auto mb-8">
        <h3 className="text-lg font-semibold text-indigo-800 mb-2">What's Next?</h3>
        <p className="text-sm text-indigo-700">
          Our team will review your booking request and send you a detailed confirmation within 24
          hours. You'll receive updates via email at {bookingData.clientEmail}.
        </p>
      </div>
      <button
        onClick={() => navigate("/search")}
        className="bg-[#075375] text-white px-8 py-3 rounded-lg hover:bg-[#0A435C] transition-colors font-medium"
      >
        Return to Search
      </button>
    </div>
  )
}

export default ConfirmationStep
