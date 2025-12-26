// utils/sendSMS.js
const axios = require("axios");

const sendSMS = async (phone, message) => {
  try {
    await axios.post(
      "https://www.fast2sms.com/dev/bulkV2",
      {
        route: "q",
        message: message,
        language: "english",
        numbers: phone,
      },
      {
        headers: {
          authorization: process.env.FAST2SMS_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`✅ SMS sent to ${phone}`);
  } catch (err) {
    console.error("❌ SMS failed", err.message);
  }
};

module.exports = sendSMS;
