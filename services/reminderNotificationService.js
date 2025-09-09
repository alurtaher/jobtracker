// const cron = require("node-cron");
// const Reminder = require("../models/Reminder");
// const User = require("../models/User");
// const sendEmail = require("../utils/sendEmail");
// const { Op } = require("sequelize");

// function toIST(date) {
//   return new Date(date.getTime() + (5.5 * 60 * 60 * 1000));
// }

// console.log("Date = ", new Date())
// console.log("Changed Date = ", toIST(new Date()))

// const reminderNotificationJob = () => {
//   // Schedule to run every hour at minute 0
//   cron.schedule("*/1 * * * *", async () => {
//     try {
//       const now = toIST(new Date());
//       const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

//       // Find reminders where reminderDate is within next hour and not yet notified
//       const reminders = await Reminder.findAll({
//         where: {
//           notified: false,
//           reminderDate: {
//             [Op.between]: [now, oneHourLater],
//           },
//         },
//         include: [{ model: User, attributes: ["email", "name"] }],
//       });


//       for (const reminder of reminders) {
//         const user = reminder.User;
//         if (!user?.email) continue;

//         const subject = `Reminder: Follow up on your job application`;
//         const htmlContent = `<p>Hi ${user.name || "there"},</p>
//           <p>This is a reminder for your job application:</p>
//           <p><strong>${reminder.message || "No message provided"}</strong></p>
//           <p>Scheduled for: ${reminder.reminderDate.toLocaleString()}</p>
//           <p>Regards,<br/>Job Tracker Team</p>`;

//         await sendEmail(user.email, subject, htmlContent);

//         // Mark reminder as notified
//         reminder.notified = true;
//         await reminder.save();
//       }
//     } catch (error) {
//       console.error("Reminder notification job error:", error);
//     }
//   });
// };

// module.exports = reminderNotificationJob;

const cron = require("node-cron");
const Reminder = require("../models/Reminder");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const { Op } = require("sequelize");

// function toIST(date) {
//   return new Date(date.getTime() + (5.5 * 60 * 60 * 1000));
// }

console.log("Date = ", new Date())
// console.log("Changed Date = ", toIST(new Date()))

const reminderNotificationJob = () => {
  // Schedule to run every hour at minute 0
  cron.schedule("*/1 * * * *", async () => {
    try {
      const now = new Date();
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

      // Find reminders where reminderDate is within next hour and not yet notified
      const reminders = await Reminder.findAll({
        where: {
          notified: false,
          reminderDate: {
            [Op.between]: [now, oneHourLater],
          },
        },
        include: [{ model: User, attributes: ["email", "name"] }],
      });


      for (const reminder of reminders) {
        const user = reminder.User;
        if (!user?.email) continue;

        const subject = `Reminder: Follow up on your job application`;
        const htmlContent = `<p>Hi ${user.name || "there"},</p>
          <p>This is a reminder for your job application:</p>
          <p><strong>${reminder.message || "No message provided"}</strong></p>
          <p>Scheduled for: ${reminder.reminderDate.toLocaleString()}</p>
          <p>Regards,<br/>Job Tracker Team</p>`;

        await sendEmail(user.email, subject, htmlContent);

        // Mark reminder as notified
        reminder.notified = true;
        await reminder.save();
      }
    } catch (error) {
      console.error("Reminder notification job error:", error);
    }
  });
};

module.exports = reminderNotificationJob;