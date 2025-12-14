
Install Required Packages
```
npm install express sequelize cors
npm install mysql2           # for MySQL
npm install sqlite3          # for SQLite
npm install pg pg-hstore     # for PostgreSQL
```


## Use of mailServices

const mailService = require("./mailService");

async function sendAccessEmail(userEmail, dashboardLink) {
  const html = `
    <h3>Greetings!</h3>
    <p>You have been given access to the dashboard.</p>
    <p>Click below to access:</p>
    <a href="${dashboardLink}" style="color:blue;">${dashboardLink}</a>
    <br><br>
    <p>Thanks,<br>MQUAD Team</p>
  `;

  await mailService.sendMail({
    to: userEmail,
    subject: "MQUAD: Access to Dashboard",
    html,
  });
}

module.exports = sendAccessEmail;




## Support for Attachments (Optional)

await mailService.sendMail({
  to: "test@test.com",
  subject: "Report",
  html: "<p>Attached report</p>",
  attachments: [
    {
      filename: "report.pdf",
      path: "./exports/report.pdf",
    },
  ],
});



==========================================================================================


