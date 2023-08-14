from django import template
import locale

register = template.Library()


@register.filter
def clp(value):
    try:
        locale.setlocale(locale.LC_ALL, 'es_CL.utf8')
        return locale.format_string("%d", value, grouping=True)
    except Exception as e:
        return value
