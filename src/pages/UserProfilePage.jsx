import React, { useEffect, useState } from 'react';
import userService from '../services/userService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { User, MapPin, Phone, Mail, ShieldCheck, Plus, Trash2, CheckCircle2, Loader2 } from 'lucide-react';

export const UserProfilePage = () => {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [isAddAddrOpen, setIsAddAddrOpen] = useState(false);
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('United States');

  const loadData = async () => {
    try {
      setLoading(true);
      const prof = await userService.getProfile();
      const addrs = await userService.getSavedAddresses();
      setProfile(prof);
      setFullName(prof.fullName);
      setPhone(prof.phone || '');
      setAddresses(addrs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setIsUpdating(true);
      setSuccessMsg('');
      const updated = await userService.updateProfile(fullName, phone);
      setProfile(updated);
      setSuccessMsg('Profile updated successfully!');
    } catch (err) {
      alert('Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    const updated = await userService.saveAddress({
      street,
      city,
      state,
      postalCode,
      country
    });
    setAddresses(updated);
    setIsAddAddrOpen(false);
    setStreet('');
    setCity('');
    setState('');
    setPostalCode('');
  };

  const handleDeleteAddress = async (id) => {
    if (id) {
      const updated = await userService.deleteAddress(id);
      setAddresses(updated);
    }
  };

  return (
    <div className="container" style={{ padding: '60px 20px', minHeight: '75vh', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', color: 'var(--color-emerald)', marginBottom: '30px' }}>
        VIP Client Profile & Addresses
      </h1>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Loader2 size={40} className="spinner" style={{ color: 'var(--color-gold)', margin: '0 auto 15px auto' }} />
          <p style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-emerald)' }}>Loading VIP Credentials...</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }} className="admin-two-col">
          <div style={{ backgroundColor: '#FFF', padding: '30px', borderRadius: '12px', border: '1px solid #E5E7EB', height: 'fit-content' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--color-emerald)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <User size={20} color="var(--color-gold)" /> Personal Details
            </h3>

            {successMsg && (
              <div style={{ backgroundColor: '#D1FAE5', color: '#065F46', padding: '12px', borderRadius: '8px', marginBottom: '15px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} /> {successMsg}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '5px' }}>Full Name</label>
                <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="form-control-input" />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '5px' }}>Email Address</label>
                <input type="email" disabled value={profile?.email || ''} className="form-control-input" style={{ backgroundColor: '#F3F4F6' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '5px' }}>Phone Number</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="form-control-input" placeholder="+1 (212) 555-0142" />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '5px' }}>Privilege Level</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-gold)', fontWeight: 700, fontSize: '0.9rem' }}>
                  <ShieldCheck size={18} /> {profile?.role === 'ROLE_ADMIN' ? 'Master Executive Admin' : 'Aurelia VIP Privilege Client'}
                </div>
              </div>

              <button type="submit" disabled={isUpdating} className="btn btn-gold" style={{ marginTop: '10px' }}>
                {isUpdating ? 'Saving Changes...' : 'Update Details'}
              </button>
            </form>
          </div>

          <div style={{ backgroundColor: '#FFF', padding: '30px', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--color-emerald)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={20} color="var(--color-gold)" /> Delivery Addresses
              </h3>
              <button className="btn btn-outline" onClick={() => setIsAddAddrOpen(true)} style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Plus size={14} /> Add
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {addresses.map((addr) => (
                <div key={addr.id} style={{ padding: '15px', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: 'var(--color-cream)', position: 'relative' }}>
                  <p style={{ fontWeight: 700, margin: '0 0 4px 0', fontSize: '0.95rem' }}>{addr.street}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-gray)', margin: 0 }}>
                    {addr.city}, {addr.state} {addr.postalCode}, {addr.country}
                  </p>
                  <button
                    onClick={() => handleDeleteAddress(addr.id)}
                    style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', cursor: 'pointer', color: '#DC2626' }}
                    title="Delete Address"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {isAddAddrOpen && (
        <div className="auth-modal-overlay" onClick={() => setIsAddAddrOpen(false)}>
          <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--color-emerald)', marginBottom: '15px' }}>
              Add New Address
            </h3>
            <form onSubmit={handleAddAddress} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input type="text" required placeholder="Street Address" value={street} onChange={(e) => setStreet(e.target.value)} className="form-control-input" />
              <input type="text" required placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} className="form-control-input" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <input type="text" required placeholder="State" value={state} onChange={(e) => setState(e.target.value)} className="form-control-input" />
                <input type="text" required placeholder="Postal Code" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className="form-control-input" />
              </div>
              <input type="text" required placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} className="form-control-input" />

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsAddAddrOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-gold">Save Address</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
