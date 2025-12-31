from django.apps import AppConfig


class LoansConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'loans'
    # label = 'loans_app'

    def ready(self):
        import loans.signals


