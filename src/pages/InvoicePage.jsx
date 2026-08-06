import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import orderService from '../services/orderService.js';
import { Printer, Download, ArrowLeft, ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react';

export const InvoicePage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        if (id) {
          const numericId = parseInt(id, 10);
          if (!isNaN(numericId)) {
            const data = await orderService.getOrderById(numericId);
            setOrder(data);
          } else {
            const data = await orderService.getOrderByOrderNumber(id);
            setOrder(data);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px' }}>
        <Loader2 size={40} className="spinner" style={{ color: 'var(--color-gold)', margin: '0 auto 15px auto' }} />
        <p style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-emerald)' }}>Generating Official Aurelia Invoice...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2>Invoice Not Found</h2>
        <Link to="/orders" className="btn btn-gold" style={{ marginTop: '20px' }}>Back to Orders</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 20px', maxWidth: '850px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }} className="no-print">
        <Link to="/orders" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-gold)', textDecoration: 'none', fontWeight: 600 }}>
          <ArrowLeft size={18} /> Back to My Orders
        </Link>
        <button className="btn btn-gold" onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Printer size={18} /> Print Official Invoice
        </button>
      </div>

      <div className="invoice-receipt-card" style={{
        backgroundColor: '#FFF',
        border: '1px solid var(--color-gold-light)',
        borderRadius: '12px',
        padding: '50px 40px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--color-gold)', paddingBottom: '25px', marginBottom: '30px' }}>
          <div>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 700, letterSpacing: '4px', color: 'var(--color-emerald)' }}>
              AURELIA
            </span>
            <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--color-gold)', margin: '2px 0 0 0' }}>
              Maison de Haute Joaillerie
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-gray)', marginTop: '8px' }}>
              740 Fifth Avenue, New York, NY 10019
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-emerald)', margin: 0 }}>OFFICIAL INVOICE</h2>
            <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-gold)', marginTop: '4px' }}>
              #{order.orderNumber}
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-gray)', margin: '2px 0 0 0' }}>
              Date: {new Date(order.createdAt || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '35px' }}>
          <div>
            <h4 style={{ fontSize: '0.8rem', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>BILLED TO</h4>
            <p style={{ fontWeight: 700, margin: 0, color: 'var(--color-emerald)' }}>Aurelia VIP Privilege Member</p>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-dark-gray)', margin: '4px 0 0 0' }}>{order.shippingAddress.street}</p>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-dark-gray)', margin: 0 }}>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-dark-gray)', margin: 0 }}>{order.shippingAddress.country}</p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.8rem', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>FULFILLMENT DETAILS</h4>
            <p style={{ fontSize: '0.9rem', margin: 0 }}><strong>Status:</strong> <span style={{ color: 'var(--color-emerald)', fontWeight: 700 }}>{order.status}</span></p>
            <p style={{ fontSize: '0.9rem', margin: '4px 0 0 0' }}><strong>Delivery:</strong> Fully Insured Express Air Courier</p>
            <p style={{ fontSize: '0.9rem', margin: '4px 0 0 0' }}><strong>Authentication:</strong> Included (Gemological Certificate)</p>
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--color-cream)', borderBottom: '1px solid #E5E7EB', textTransform: 'uppercase', fontSize: '0.8rem', color: 'var(--color-emerald)' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>Item Description</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Qty</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Unit Price</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items && order.items.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #F3F4F6', fontSize: '0.95rem' }}>
                <td style={{ padding: '14px 12px' }}>
                  <strong>{item.product?.name || 'Jewellery Piece'}</strong>
                  {item.selectedSize && <div style={{ fontSize: '0.8rem', color: 'var(--color-gray)' }}>Size: {item.selectedSize}</div>}
                </td>
                <td style={{ padding: '14px 12px', textAlign: 'center' }}>{item.quantity}</td>
                <td style={{ padding: '14px 12px', textAlign: 'right' }}>${item.priceAtPurchase?.toLocaleString()}</td>
                <td style={{ padding: '14px 12px', textAlign: 'right', fontWeight: 700 }}>
                  ${(item.priceAtPurchase * item.quantity).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '35px' }}>
          <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.95rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Subtotal:</span>
              <span>${order.totalAmount?.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Express Delivery:</span>
              <span>COMPLIMENTARY</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-emerald)', borderTop: '2px solid var(--color-gold)', paddingTop: '10px' }}>
              <span>Total Paid:</span>
              <span>${order.totalAmount?.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '20px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-gray)' }}>
          <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--color-emerald)', fontWeight: 600, marginBottom: '4px' }}>
            <ShieldCheck size={16} color="var(--color-gold)" /> Certificate of Authenticity & Lifetime Craftsmanship Guarantee Included
          </p>
          <p>Thank you for acquiring your fine jewellery piece from Maison Aurelia.</p>
        </div>
      </div>
    </div>
  );
};
