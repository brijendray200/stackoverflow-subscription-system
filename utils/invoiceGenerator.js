const generateInvoiceHTML = (user, payment, plan) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f48024 0%, #d97316 100%); color: white; padding: 30px; text-align: center; border-radius: 10px; }
        .invoice-details { background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 5px; }
        .invoice-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .invoice-table th, .invoice-table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        .invoice-table th { background: #f48024; color: white; }
        .total { font-size: 1.5em; font-weight: bold; text-align: right; margin: 20px 0; }
        .footer { text-align: center; color: #666; margin-top: 40px; padding-top: 20px; border-top: 2px solid #ddd; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🎉 Payment Successful!</h1>
        <p>Thank you for subscribing to ${plan.name}</p>
      </div>

      <div class="invoice-details">
        <h2>Invoice Details</h2>
        <p><strong>Invoice Number:</strong> ${payment.invoiceNumber}</p>
        <p><strong>Date:</strong> ${new Date(payment.createdAt).toLocaleDateString('en-IN', { 
          year: 'numeric', month: 'long', day: 'numeric' 
        })}</p>
        <p><strong>Transaction ID:</strong> ${payment.transactionId}</p>
        <p><strong>Payment Gateway:</strong> ${payment.gateway.toUpperCase()}</p>
      </div>

      <div class="invoice-details">
        <h2>Customer Information</h2>
        <p><strong>Name:</strong> ${user.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
      </div>

      <table class="invoice-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Duration</th>
            <th>Questions/Day</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${plan.name}</td>
            <td>${plan.duration} days</td>
            <td>${plan.questionsPerDay === Infinity ? 'Unlimited' : plan.questionsPerDay}</td>
            <td>₹${payment.amount}</td>
          </tr>
        </tbody>
      </table>

      <div class="total">
        Total Paid: ₹${payment.amount}
      </div>

      <div class="invoice-details">
        <h2>Subscription Details</h2>
        <p><strong>Plan Active Until:</strong> ${new Date(user.planExpiry).toLocaleDateString('en-IN', { 
          year: 'numeric', month: 'long', day: 'numeric' 
        })}</p>
        <p><strong>Daily Question Limit:</strong> ${plan.questionsPerDay === Infinity ? 'Unlimited' : plan.questionsPerDay} questions</p>
        <p>You can now start posting questions according to your plan limits!</p>
      </div>

      <div class="footer">
        <p>Thank you for your business!</p>
        <p style="font-size: 12px; color: #999;">
          This is an automated invoice. For any queries, please contact support.
        </p>
      </div>
    </body>
    </html>
  `;
};

module.exports = { generateInvoiceHTML };
