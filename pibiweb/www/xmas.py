import frappe

def get_context(context):
	"""Context for xmas page - with language support"""
	# Disable cache to allow language switching
	context.no_cache = 1
	context.show_sidebar = False

	# Get language from URL parameter
	lang = frappe.form_dict.get('_lang', 'en')
	frappe.local.lang = lang

	# Pass language to template context
	context.lang = lang

	return context
