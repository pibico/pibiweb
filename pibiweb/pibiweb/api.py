# Copyright (c) 2026, pibiCo and contributors
# For license information, please see license.txt
"""Contact form of the public website."""

import frappe
from frappe import _
from frappe.rate_limiter import rate_limit
from frappe.utils import escape_html, validate_email_address

SUBJECTS = {
    "future-ready": "Future-Ready Systems",
    "rnd": "Research & Development",
    "domotics": "Domotics",
    "other": "Other",
}
MAX_NAME = 140
MAX_MESSAGE = 5000


# Guest by design: it is the contact form of the public website. Limited per request
# IP, with a hidden honeypot field, and everything the visitor writes is escaped.
@frappe.whitelist(allow_guest=True, methods=["POST"])
@rate_limit(limit=5, seconds=3600)
def send_contact_email(name=None, email=None, subject=None, message=None, website=None, **kwargs):
    if website:
        # the hidden field is only filled by bots: answer as if it had been sent
        return {"success": True, "message": _("Message sent successfully")}

    name = (name or "").strip()
    email = (email or "").strip()
    message = (message or "").strip()
    if not (name and email and subject and message):
        frappe.throw(_("All fields are required"))
    if subject not in SUBJECTS:
        frappe.throw(_("Choose a topic"))
    if len(name) > MAX_NAME or len(message) > MAX_MESSAGE:
        frappe.throw(_("The message is too long"))
    if not validate_email_address(email):
        frappe.throw(_("Enter a valid email address"))

    recipient = frappe.db.get_single_value("Contact Us Settings", "forward_to_email")
    if not recipient:
        frappe.log_error("Contact Us Settings has no Forward To Email", "Contact Form")
        return {"success": False, "message": _("Error sending message. Please try again.")}

    body = (
        f"[Email pibiCo Contact]: New message from website contact form<br><br>"
        f"<strong>Name:</strong> {escape_html(name)}<br>"
        f"<strong>Email:</strong> {escape_html(email)}<br>"
        f"<strong>Subject:</strong> {escape_html(SUBJECTS[subject])}<br><br>"
        f"<strong>Message:</strong><br>{escape_html(message).replace(chr(10), '<br>')}"
    )
    frappe.sendmail(
        recipients=[recipient],
        reply_to=email,
        subject=f"Website Contact: {SUBJECTS[subject]}",
        message=body,
        header=[_("pibiCo Website Contact Information"), "blue"],
    )
    return {"success": True, "message": _("Message sent successfully")}
