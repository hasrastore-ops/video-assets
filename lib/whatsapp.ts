export function generateWhatsAppLink(phoneNumber: string, message: string) {
  const cleanNumber = phoneNumber.replace(/[^\d]/g, '');
  const formattedNumber = cleanNumber.startsWith('60') ? cleanNumber : `60${cleanNumber}`;
  
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${formattedNumber}?text=${encodedMessage}`;
}