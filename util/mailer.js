const sgMail = require("@sendgrid/mail");

const { sendGridApiKey } = require("../config");

sgMail.setApiKey(sendGridApiKey);

const verifyEmail = (to, token) => {
  sgMail.send({
    to: to,
    from: "ruhankhan25@gmail.com",
    subject: "Verify your email",
    html: `
            <div style=" border: 1px solid #000;
                width: 250px;
                text-align: center;
                padding: 1rem;">
              <h1 style=" margin: 0;
                padding-bottom: 1rem;">Thank you for Registration</h1>
              <p style=" margin: 0;
                padding-bottom: 1rem;">Please verify you account by using below code</p>
              <p style="display: inline-block;
                margin: 0;
                padding: 0.5rem 1rem;
                background-color: #ccc;
                border-radius: 10px;">${token}</p>
            </div>
          `
  });
};

module.exports = { verifyEmail };
