import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


async def send_email(subject, body, store_owner, receiver):
  subject = "Test Email"
  body = "This is a test email sent from FastAPI."

  msg = MIMEMultipart()
  await store_owner.user.fetch()
  msg['From'] = store_owner.user.email # here email is a attribute of User Document
  msg['To'] = receiver
  msg['Subject'] = subject

  msg.attach(MIMEText(body, 'plain'))

  # Replace with your SMTP server config
  smtp_server = "smtp.gmail.com"
  smtp_port = 587
  email_user = "your_email@gmail.com"  # I am giving sender and receiver then why do i need this
  email_password = "your_email_password"

  try:
    with smtplib.SMTP(smtp_server, smtp_port) as server:
      server.starttls()
      server.login(email_user, email_password)
      server.sendmail(sender, receiver, msg.as_string())
      print("Email sent successfully.")
  except Exception as e:
    print(f"Failed to send email: {e}")