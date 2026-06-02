const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
  const port = Number(process.env.EMAIL_PORT || 587);
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    ...(user && pass ? { auth: { user, pass } } : {})
  });
};

// Email templates
const templates = {
  verification: (data) => ({
    subject: 'Verify your Agri-Setu account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #4CAF50, #45a049); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">🌾 Agri-Setu</h1>
          <p style="color: white; margin: 10px 0 0 0;">Digital Bridge Between Farmers & Customers</p>
        </div>
        
        <div style="padding: 30px 20px;">
          <h2 style="color: #333; margin-bottom: 20px;">Welcome to Agri-Setu, ${data.name}!</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Thank you for joining Agri-Setu! We're excited to have you on board as we build a 
            direct connection between farmers and customers.
          </p>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
            To complete your registration and start using our platform, please verify your 
            email address by clicking the button below:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.verificationUrl}" 
               style="background: #4CAF50; color: white; padding: 15px 30px; text-decoration: none; 
                      border-radius: 5px; display: inline-block; font-weight: bold;">
              Verify Email Address
            </a>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            If the button doesn't work, you can also copy and paste this link into your browser:
          </p>
          
          <p style="color: #4CAF50; word-break: break-all; background: #f5f5f5; padding: 10px; 
                    border-radius: 5px; font-size: 14px;">
            ${data.verificationUrl}
          </p>
          
          <p style="color: #666; line-height: 1.6; margin-top: 30px;">
            This link will expire in 24 hours for security reasons.
          </p>
        </div>
        
        <div style="background: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #ddd;">
          <p style="color: #666; margin: 0; font-size: 14px;">
            If you didn't create an account with Agri-Setu, please ignore this email.
          </p>
          <p style="color: #666; margin: 10px 0 0 0; font-size: 14px;">
            © 2024 Agri-Setu. All rights reserved.
          </p>
        </div>
      </div>
    `
  }),

  passwordReset: (data) => ({
    subject: 'Reset your Agri-Setu password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #4CAF50, #45a049); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">🌾 Agri-Setu</h1>
          <p style="color: white; margin: 10px 0 0 0;">Digital Bridge Between Farmers & Customers</p>
        </div>
        
        <div style="padding: 30px 20px;">
          <h2 style="color: #333; margin-bottom: 20px;">Password Reset Request</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Hello ${data.name},
          </p>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            We received a request to reset your password for your Agri-Setu account. 
            If you made this request, click the button below to reset your password:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.resetUrl}" 
               style="background: #4CAF50; color: white; padding: 15px 30px; text-decoration: none; 
                      border-radius: 5px; display: inline-block; font-weight: bold;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            If the button doesn't work, you can also copy and paste this link into your browser:
          </p>
          
          <p style="color: #4CAF50; word-break: break-all; background: #f5f5f5; padding: 10px; 
                    border-radius: 5px; font-size: 14px;">
            ${data.resetUrl}
          </p>
          
          <p style="color: #666; line-height: 1.6; margin-top: 30px;">
            <strong>Important:</strong> This link will expire in 10 minutes for security reasons.
          </p>
          
          <p style="color: #666; line-height: 1.6;">
            If you didn't request a password reset, please ignore this email. Your password will remain unchanged.
          </p>
        </div>
        
        <div style="background: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #ddd;">
          <p style="color: #666; margin: 0; font-size: 14px;">
            For security reasons, never share this link with anyone.
          </p>
          <p style="color: #666; margin: 10px 0 0 0; font-size: 14px;">
            © 2024 Agri-Setu. All rights reserved.
          </p>
        </div>
      </div>
    `
  }),

  orderConfirmation: (data) => ({
    subject: `Order Confirmation - ${data.orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #4CAF50, #45a049); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">🌾 Agri-Setu</h1>
          <p style="color: white; margin: 10px 0 0 0;">Digital Bridge Between Farmers & Customers</p>
        </div>
        
        <div style="padding: 30px 20px;">
          <h2 style="color: #333; margin-bottom: 20px;">Order Confirmed!</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Hello ${data.customerName},
          </p>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Thank you for your order! We've received your order and it's being processed by our farmers.
          </p>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #333; margin: 0 0 15px 0;">Order Details</h3>
            <p style="color: #666; margin: 5px 0;"><strong>Order Number:</strong> ${data.orderNumber}</p>
            <p style="color: #666; margin: 5px 0;"><strong>Total Amount:</strong> ₹${data.totalAmount}</p>
            <p style="color: #666; margin: 5px 0;"><strong>Delivery Date:</strong> ${data.deliveryDate}</p>
            <p style="color: #666; margin: 5px 0;"><strong>Status:</strong> ${data.status}</p>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-top: 30px;">
            You'll receive another email when your order is ready for delivery.
          </p>
        </div>
        
        <div style="background: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #ddd;">
          <p style="color: #666; margin: 0; font-size: 14px;">
            © 2024 Agri-Setu. All rights reserved.
          </p>
        </div>
      </div>
    `
  })
};

// Send email function
const sendEmail = async ({ to, subject, template, data }) => {
  try {
    // If email credentials are not configured, skip sending gracefully
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('Email disabled: EMAIL_USER or EMAIL_PASS not set. Skipping send.');
      return { skipped: true };
    }

    const transporter = createTransporter();
    
    let emailContent;
    if (template && templates[template]) {
      emailContent = templates[template](data);
    } else {
      emailContent = { subject, html: data.html || data };
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@agri-setu.com',
      to,
      subject: emailContent.subject || subject,
      html: emailContent.html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

// Send bulk email function
const sendBulkEmail = async (emails) => {
  try {
    const transporter = createTransporter();
    const results = [];

    for (const emailData of emails) {
      try {
        const result = await sendEmail(emailData);
        results.push({ success: true, email: emailData.to, messageId: result.messageId });
      } catch (error) {
        results.push({ success: false, email: emailData.to, error: error.message });
      }
    }

    return results;
  } catch (error) {
    console.error('Bulk email sending failed:', error);
    throw error;
  }
};

module.exports = {
  sendEmail,
  sendBulkEmail,
  templates
};
