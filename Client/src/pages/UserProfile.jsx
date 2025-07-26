import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../Components/Footer';
import {
  User as UserIcon,
  CreditCard as InvoiceIcon,
  Download as DownloadIcon,
} from 'lucide-react';

function TabPanel({ children, value, index }) {
  return value === index ? <div className="p-4 md:p-6">{children}</div> : null;
}

export default function UserProfile() {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);

  // Dialog & alerts
  const [invoiceDialog, setInvoiceDialog] = useState(false);
  const [successAlert, setSuccessAlert] = useState('');
  const [errorAlert, setErrorAlert] = useState('');

  // Data
  const [userData, setUserData] = useState(null);
  const [agencyData, setAgencyData] = useState(null);
  const [payments, setPayments] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Fetch user, agency & payments on mount
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErrorAlert('');
        const [u, a, p] = await Promise.all([
          axios.get('/users/me'),
          axios.get('/agency'),
          axios.get('/payments/my'),
        ]);
        setUserData(u.data);
        
        // Find the matching agency profile
        const my = a.data.find(a1 => {
          if (a1.user === u.data._id) return true;
          if (a1.user && a1.user._id === u.data._id) return true;
          if (a1.user === u.data.userId) return true;
          return false;
        });

        if (!my) {
          console.warn('No matching agency profile found for user:', u.data._id);
        } else {
          console.log('Found matching agency profile:', my);
        }
        
        setAgencyData(my);
        setPayments(p.data);
      } catch (err) {
        console.error(err);
        setErrorAlert('Failed to load data');
        navigate('/login', { replace: true });
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  // Helpers
  const showSuccess = msg => {
    setSuccessAlert(msg);
    setTimeout(() => setSuccessAlert(''), 3000);
  };
  const showError = msg => {
    setErrorAlert(msg);
    setTimeout(() => setErrorAlert(''), 3000);
  };

  // ── Invoice View & Download ────────────────────────────────────
  const openInvoice = async invoice => {
    try {
      const res = await axios.get(`/payments/${invoice.id}`);
      setSelectedInvoice(res.data);
      setInvoiceDialog(true);
    } catch (err) {
      console.error(err);
      showError('Failed to load invoice');
    }
  };
  const closeInvoice = () => {
    setSelectedInvoice(null);
    setInvoiceDialog(false);
  };
  const downloadInvoice = async id => {
    try {
      const res = await axios.get(`/payments/${id}/invoice`, {
        responseType: 'blob'
      });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      showSuccess('Invoice downloaded');
    } catch (err) {
      console.error(err);
      showError('Download failed');
    }
  };

  if (loading) {
    return <div className="flex-1 flex items-center justify-center">Loading…</div>;
  }

  if (!userData || !agencyData) {
    return <div className="flex-1 flex items-center justify-center">Error loading data</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-3xl md:max-w-5xl mx-auto px-4 md:p-6 space-y-4 md:space-y-6">
          {/* Alerts */}
          {successAlert && <div className="p-3 md:p-4 bg-green-100 text-green-800 rounded text-xs md:text-sm">{successAlert}</div>}
          {errorAlert  && <div className="p-3 md:p-4 bg-red-100   text-red-800   rounded text-xs md:text-sm">{errorAlert}</div>}

          {/* Profile Card */}
          <div className="bg-white p-4 md:p-6 rounded-xl shadow flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <UserIcon className="w-10 h-10 md:w-12 md:h-12 text-indigo-600" />
            <div>
              <p className="text-indigo-600 text-sm md:text-base">{agencyData.agencyName}</p>
              <p className="text-gray-600 text-xs md:text-sm">{userData.email}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow">
            <div className="flex border-b">
              {['Profile', 'Payments'].map((label, i) => (
                <button
                  key={i}
                  onClick={() => setTabValue(i)}
                  className={`flex-1 py-2 md:py-3 text-center text-xs md:text-base ${
                    tabValue === i
                      ? 'border-b-4 border-indigo-600 text-indigo-600'
                      : 'text-gray-600 hover:text-indigo-500'
                  }`}
                >{label}</button>
              ))}
            </div>

            {/* ── PROFILE ───────────────────────────────────── */}
            <TabPanel value={tabValue} index={0}>
              <div className="bg-white rounded-2xl shadow-lg p-4 md:p-8 space-y-4 md:space-y-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* User Information */}
                <div className="col-span-2 border-b border-gray-200 pb-3 md:pb-4">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800">User Information</h3>
                </div>

                <div className="p-3 md:p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wide">Email</h4>
                  <p className="mt-1 text-sm md:text-base text-gray-900">{userData.email || '—'}</p>
                </div>

                {/* Agency Information */}
                <div className="col-span-2 mt-4 md:mt-6 border-b border-gray-200 pb-3 md:pb-4">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800">Agency Information</h3>
                </div>

                <div className="p-3 md:p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wide">Agency Name</h4>
                  <p className="mt-1 text-sm md:text-base text-gray-900">{agencyData.agencyName || '—'}</p>
                </div>
                <div className="p-3 md:p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wide">Username</h4>
                  <p className="mt-1 text-sm md:text-base text-gray-900">{agencyData.username || '—'}</p>
                </div>
                <div className="p-3 md:p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wide">Contact Person</h4>
                  <p className="mt-1 text-sm md:text-base text-gray-900">{agencyData.contactPerson || '—'}</p>
                </div>
                <div className="p-3 md:p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wide">Billing Email</h4>
                  <p className="mt-1 text-sm md:text-base text-gray-900">{agencyData.billingEmail || '—'}</p>
                </div>
                <div className="p-3 md:p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wide">Phone Number</h4>
                  <p className="mt-1 text-sm md:text-base text-gray-900">{agencyData.phoneNumber || '—'}</p>
                </div>
                <div className="p-3 md:p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wide">Phone Number2</h4>
                  <p className="mt-1 text-sm md:text-base text-gray-900">{agencyData.phoneNumber2 || '—'}</p>
                </div>

                <div className="col-span-2 p-3 md:p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wide">Address</h4>
                  <p className="mt-1 text-sm md:text-base text-gray-900 space-y-1">
                    {agencyData.address?.street ? (
                      <>
                        {agencyData.address.street}<br />
                        {agencyData.address.city}{agencyData.address.zipCode ? `, ${agencyData.address.zipCode}` : ''}<br />
                        {agencyData.address.state}{agencyData.address.country ? `, ${agencyData.address.country}` : ''}
                      </>
                    ) : '—'}
                  </p>
                </div>

                <div className="col-span-2 p-3 md:p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wide">Remarks</h4>
                  <p className="mt-1 text-sm md:text-base text-gray-900">{agencyData.remarks || '—'}</p>
                </div>
              </div>
            </TabPanel>

            {/* ── PAYMENTS ─────────────────────────────────── */}
            <TabPanel value={tabValue} index={1}>
              <div className="bg-white rounded-xl shadow overflow-hidden">
                {/* Desktop Table */}
                <table className="min-w-full hidden md:table bg-white">
                  <thead className="bg-gray-100">
                    <tr>
                      {['Invoice', 'Booking', 'Date', 'Amount', 'Status', ''].map(h => (
                        <th className="p-3 text-left text-xs font-semibold" key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map(p => (
                      <tr key={p._id} className="border-b hover:bg-gray-50">
                        <td className="p-3 text-sm">{p._id}</td>
                        <td className="p-3 text-sm">{p.booking.bookingReference}</td>
                        <td className="p-3 text-sm">{new Date(p.createdAt).toLocaleDateString()}</td>
                        <td className="p-3 text-sm">${p.amount.toFixed(2)}</td>
                        <td className="p-3 text-sm">{p.status}</td>
                        <td className="p-3 text-sm space-x-2">
                          <button onClick={() => openInvoice(p)}>
                            <InvoiceIcon className="inline w-5 h-5 text-indigo-600" />
                          </button>
                          {p.status !== 'Pending' && (
                            <button onClick={() => downloadInvoice(p._id)}>
                              <DownloadIcon className="inline w-5 h-5 text-green-600" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {!payments.length && (
                      <tr><td colSpan="6" className="p-4 text-center text-gray-500">No payments found</td></tr>
                    )}
                  </tbody>
                </table>

                {/* Mobile Card Layout */}
                <div className="md:hidden space-y-4 p-4">
                  {payments.map(p => (
                    <div key={p._id} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                      <div className="space-y-2 text-xs">
                        <div><strong>Invoice:</strong> {p._id}</div>
                        <div><strong>Booking:</strong> {p.booking.bookingReference}</div>
                        <div><strong>Date:</strong> {new Date(p.createdAt).toLocaleDateString()}</div>
                        <div><strong>Amount:</strong> ${p.amount.toFixed(2)}</div>
                        <div><strong>Status:</strong> {p.status}</div>
                      </div>
                      <div className="flex space-x-2 mt-3">
                        <button
                          onClick={() => openInvoice(p)}
                          className="flex-1 p-2 bg-indigo-600 text-white rounded-md text-xs"
                        >
                          View Invoice
                        </button>
                        {p.status !== 'Pending' && (
                          <button
                            onClick={() => downloadInvoice(p._id)}
                            className="flex-1 p-2 bg-green-600 text-white rounded-md text-xs"
                          >
                            Download
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {!payments.length && (
                    <div className="p-4 text-center text-gray-500 text-xs">No payments found</div>
                  )}
                </div>
              </div>
            </TabPanel>
          </div>
        </div>

        {/* Invoice Modal */}
        {invoiceDialog && selectedInvoice && (
          <div className="fixed inset-0 bg-black bg-opacity-50 overflow-auto p-4 flex items-center justify-center">
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-xl w-full h-full md:w-full md:max-w-2xl mx-auto space-y-3 md:space-y-4">
              <h4 className="font-semibold text-lg md:text-xl">Invoice #{selectedInvoice._id}</h4>
              <p className="text-xs md:text-sm"><strong>Booking:</strong> {selectedInvoice.booking.bookingReference}</p>
              <p className="text-xs md:text-sm"><strong>Amount:</strong> ${selectedInvoice.amount.toFixed(2)}</p>
              <p className="text-xs md:text-sm"><strong>Date:</strong> {new Date(selectedInvoice.createdAt).toLocaleDateString()}</p>
              <div className="flex flex-col md:flex-row md:justify-end space-y-2 md:space-y-0 md:space-x-2">
                <button
                  onClick={closeInvoice}
                  className="w-full md:w-auto px-4 py-2 text-gray-600 text-xs md:text-sm rounded-md border border-gray-300"
                >
                  Close
                </button>
                <button
                  onClick={() => downloadInvoice(selectedInvoice._id)}
                  className="w-full md:w-auto px-4 py-2 bg-green-600 text-white rounded-md text-xs md:text-sm"
                >
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
}