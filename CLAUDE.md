# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pibiweb is a Frappe/ERPNext custom application that provides web functionality for pibiCo. It is part of a larger bench installation (`erpnext-pibico`) that includes multiple pibiCo custom apps (pibiaid, pibiaihub, pibicard, pibitools, etc.) running alongside ERPNext v15 and Frappe Framework v15.

## Development Environment

### Bench Structure
- **Bench root**: `/home/erpnext/erpnext-pibico/`
- **App location**: `/home/erpnext/erpnext-pibico/apps/pibiweb/`
- **Bench executable**: `/home/erpnext/fp15-env/bin/bench`
- **Python environment**: Virtual environment at `/home/erpnext/fp15-env/`

### Common Commands

All commands should be run from the bench root directory (`/home/erpnext/erpnext-pibico/`).

**Development server**:
```bash
cd /home/erpnext/erpnext-pibico
/home/erpnext/fp15-env/bin/bench start
```

**Install/reinstall app**:
```bash
cd /home/erpnext/erpnext-pibico
/home/erpnext/fp15-env/bin/bench --site [site-name] install-app pibiweb
```

**Migrate after code changes**:
```bash
cd /home/erpnext/erpnext-pibico
/home/erpnext/fp15-env/bin/bench --site [site-name] migrate
```

**Clear cache**:
```bash
cd /home/erpnext/erpnext-pibico
/home/erpnext/fp15-env/bin/bench --site [site-name] clear-cache
```

**Build assets**:
```bash
cd /home/erpnext/erpnext-pibico
/home/erpnext/fp15-env/bin/bench build
```

**Console access**:
```bash
cd /home/erpnext/erpnext-pibico
/home/erpnext/fp15-env/bin/bench --site [site-name] console
```

**Translation management**:
```bash
# Extract translatable strings from code
cd /home/erpnext/erpnext-pibico
/home/erpnext/fp15-env/bin/bench --site [site-name] build-message-files

# Update translations
cd /home/erpnext/erpnext-pibico
/home/erpnext/fp15-env/bin/bench --site [site-name] update-translations
```

## Architecture

### Application Structure

```
pibiweb/
├── hooks.py              # Frappe hooks configuration
├── __init__.py           # Version definition
├── modules.txt           # Module list (single module: "Pibiweb")
├── patches.txt           # Database migration patches
├── pibiweb/              # Python module for API endpoints
│   ├── api.py            # Whitelisted API methods
│   └── __init__.py
├── public/               # Static assets
│   ├── css/              # Stylesheets
│   ├── js/               # JavaScript files (scripts.js)
│   ├── images/           # Image assets
│   └── docs/             # PDF documentation
├── templates/            # Jinja templates
│   ├── emails/           # Email templates
│   ├── includes/         # Template includes
│   └── pages/            # Page templates
├── translations/         # Multi-language CSV translation files
├── fixtures/             # Data fixtures
│   └── web_page.json     # Web Page doctype fixtures
└── www/                  # Web pages served at root
    └── xmas.html/py      # Example web page with context
```

### Key Patterns

**Web Pages in www/**:
- HTML files in `pibiweb/www/` are served at the site root
- Corresponding `.py` files provide context via `get_context(context)` function
- Example: `www/xmas.html` is served at `/xmas`, with context from `www/xmas.py`
- Set `context.no_cache = 1` to disable caching
- Language support via `frappe.local.lang` and URL parameter `_lang`

**API Endpoints**:
- Define whitelisted methods in `pibiweb/pibiweb/api.py`
- Use `@frappe.whitelist(allow_guest=True)` for public endpoints
- Access via `/api/method/pibiweb.pibiweb.api.method_name`
- Example: `send_contact_email()` handles contact form submissions

**Hooks Configuration**:
- All Frappe hooks are in `hooks.py`
- Fixtures defined for Web Page doctype (module filter: "Pibiweb")
- Currently most hooks are commented out (unused)

**Translations**:
- CSV format: `source,translation,context`
- Located in `pibiweb/translations/[lang_code].csv`
- Spanish (es.csv) is the primary translation
- Many language files are present but may be empty or auto-generated
- Use `_("String")` in Python/Jinja templates for translatable strings

**Static Assets**:
- CSS: `pibiweb/public/css/styles.css`
- JS: `pibiweb/public/js/scripts.js`
- Images: `pibiweb/public/images/`
- Assets accessible at `/assets/pibiweb/[type]/[filename]`

### Frappe Framework Integration

This is a Frappe v15 application. Key concepts:

- **DocTypes**: Not present in this app (web-focused, not business logic)
- **Web Pages**: Stored as fixtures in `fixtures/web_page.json`
- **Hooks**: Configured in `hooks.py` following Frappe conventions
- **Context**: Use `get_context()` in `.py` files to pass data to templates
- **API**: Use `frappe.whitelist()` decorator for API endpoints
- **Queue**: Use `frappe.enqueue()` for background jobs (see contact email handler)

### Multi-tenancy

The bench hosts multiple sites:
- `demo.pibico.es` - Demo site with full app suite
- `erp.espib.co` - Production ERP site
- `time.espib.co` - Time tracking site (pibitime only)

When working with bench commands, specify the target site with `--site [site-name]` or use `--site all` for all sites.

## Build System

- Uses `flit_core` as build backend (specified in `pyproject.toml`)
- No frontend build tools (Webpack/npm) - relies on Frappe's asset bundling
- Version defined in `pibiweb/__init__.py` as `__version__ = "0.0.1"`

## Working with This App

1. **Make code changes** in the appropriate directory (Python in `pibiweb/`, templates in `templates/`, etc.)
2. **Clear cache** if changing Python code or templates
3. **Build assets** if changing CSS/JS files
4. **Migrate** if database schema changes (not common for this app)
5. **Test** on appropriate site using bench console or web interface

## Common Pitfalls

- Always work from bench root directory for bench commands
- Use full path to bench executable: `/home/erpnext/fp15-env/bin/bench`
- Changes to `hooks.py` require bench restart
- Web page changes may need cache clear to see updates
- API endpoints must be whitelisted with `@frappe.whitelist()` decorator
