"""The contact form sent to an address written in the code. It now uses the site's own
Contact Us Settings > Forward To Email; copy the old address there once if it is empty."""

import frappe

PREVIOUS_RECIPIENT = "proyectos@pibico.es"


def execute():
    if not frappe.db.get_single_value("Contact Us Settings", "forward_to_email"):
        frappe.db.set_single_value("Contact Us Settings", "forward_to_email", PREVIOUS_RECIPIENT)
