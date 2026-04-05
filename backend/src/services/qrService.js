/**
 * QR Code Service
 * Generates UPI payment payload for QR codes.
 */
const qrService = {
  generateUPIPayload: (upiId, amount, name = 'Odoo POS Cafe') => {
    // Standard UPI URI format: upi://pay?pa=<upi_id>&pn=<name>&am=<amount>&cu=INR
    return `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR`;
  }
};

module.exports = qrService;
