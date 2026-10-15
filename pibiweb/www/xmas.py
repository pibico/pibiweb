import frappe

def get_context(context):
	"""Context for xmas page - with language support"""
	# Disable cache to allow language switching
	context.no_cache = 1
	context.show_sidebar = False

	# Language from the URL parameter, only if it is an enabled language of the site
	lang = frappe.form_dict.get('_lang') or 'en'
	if not frappe.db.exists('Language', {'name': lang, 'enabled': 1}):
		lang = 'en'
	frappe.local.lang = lang

	# Pass language to template context
	context.lang = lang

	return context
