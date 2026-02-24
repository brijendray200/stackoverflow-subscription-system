const checkPaymentTime = (req, res, next) => {
  const now = new Date();
  
  // Convert to IST (UTC+5:30)
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istTime = new Date(now.getTime() + istOffset);
  
  const hours = istTime.getUTCHours();
  
  // Allow payments only between 10 AM and 11 AM IST
  if (hours >= 10 && hours < 11) {
    next();
  } else {
    res.status(403).json({ 
      error: 'Payment window closed',
      message: 'Payments are only allowed between 10:00 AM and 11:00 AM IST',
      currentTimeIST: istTime.toISOString()
    });
  }
};

module.exports = checkPaymentTime;
