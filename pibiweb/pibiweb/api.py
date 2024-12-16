# In api.py or a custom module
import frappe
from frappe import _

@frappe.whitelist(allow_guest=True)
def send_contact_email(**args):
    try:
        # Extract data from args
        name = args.get('name')
        email = args.get('email')
        subject = args.get('subject')
        message = args.get('message')

        if not all([name, email, subject, message]):
            frappe.throw(_('All fields are required'))

        # Prepare email content
        email_text = f"""
        [Email pibiCo Contact]: New message from website contact form<br><br>
        <strong>Name:</strong> {name}<br>
        <strong>Email:</strong> {email}<br>
        <strong>Subject:</strong> {subject}<br><br>
        <strong>Message:</strong><br>
        {message}
        """

        # Email arguments
        email_args = {
            'recipients': ['proyectos@pibico.es'],  # Replace with your email
            'sender': None,
            'subject': f"Website Contact: {subject}",
            'message': frappe.utils.cstr(email_text),
            'header': [_('pibiCo Website Contact Information'), 'blue'],
            'delayed': False,
            'retry': 3
        }

        # Send email using frappe.sendmail through queue
        frappe.enqueue(
            method=frappe.sendmail,
            queue='short',
            timeout=300,
            now=True,
            **email_args
        )

        return {'success': True, 'message': _('Message sent successfully')}

    except Exception as e:
        frappe.log_error(f"Contact Form Error: {str(e)}", "Contact Form")
        return {'success': False, 'message': _('Error sending message. Please try again.')}