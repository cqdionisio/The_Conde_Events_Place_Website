# server/: inquiry email sender

`google-apps-script/Code.gs` is the free mailer for the website's Inquire / Book form. It is **not** uploaded with the website. You paste it into Google Apps Script (https://script.google.com), where it runs in your own Google account and emails inquiries to your Gmail.

**Full step-by-step instructions are in the main `README.md`, Step 4.**

Quick reference:

| I want to... | Do this |
|---|---|
| Change the inbox that receives inquiries | Edit `OWNER_EMAIL` in the script, then **Deploy > Manage deployments > edit > New version > Deploy**. The website does not need to change. |
| Change the email subject | Edit `SUBJECT_TEMPLATE`, then deploy a new version |
| Test that sending works | Choose `sendTestEmail` in the toolbar and click Run |
| Connect the website | Paste the Web app URL (ends in `/exec`) into `js/config.js` > `form.endpoint` |
| See errors | Apps Script editor > **Executions** |

Free limit (Google, may change): 100 email recipients per day for a normal Gmail account. Each inquiry uses 1.
