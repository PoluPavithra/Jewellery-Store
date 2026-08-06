import React from 'react';

export const ProductSkeleton = () => {
  return (
    <div style={{
      backgroundColor: '#FFF',
      borderRadius: '12px',
      border: '1px solid #E5E7EB',
      overflow: 'hidden',
      padding: '15px'
    }}>
      <div style={{
        width: '100%',
        height: '240px',
        backgroundColor: '#E5E7EB',
        borderRadius: '8px',
        animation: 'pulse 1.5s infinite ease-in-out'
      }} />
      <div style={{ marginTop: '15px', height: '18px', backgroundColor: '#E5E7EB', width: '70%', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }} />
      <div style={{ marginTop: '10px', height: '14px', backgroundColor: '#E5E7EB', width: '40%', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }} />
      <div style={{ marginTop: '15px', height: '22px', backgroundColor: '#E5E7EB', width: '30%', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }} />
    </div>
  );
};
