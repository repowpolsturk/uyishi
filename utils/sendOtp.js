const nodemailer = require('nodemailer');
const sendOtp = async (email, otp) => {
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'your-email@gmail.com',
            pass: 'your-email-password'
        }
    });
    let mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'OTP tasdiqlash',
        text: `Sizning OTP kodingiz: ${otp}`
    };
    await transporter.sendMail(mailOptions);
};
module.exports = sendOtp;