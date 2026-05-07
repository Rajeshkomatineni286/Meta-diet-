from pathlib import Path
from datetime import timedelta
import environ

BASE_DIR = Path(__file__).resolve().parent.parent
env = environ.Env(
    DEBUG=(bool, False),
    ALLOWED_HOSTS=(list, ['localhost', '127.0.0.1']),
)
environ.Env.read_env(BASE_DIR / '.env')

SECRET_KEY = env('SECRET_KEY', default='unsafe-dev-key-change-me')
DEBUG = env('DEBUG')
ALLOWED_HOSTS = env('ALLOWED_HOSTS')

INSTALLED_APPS = [
    'django.contrib.admin', 'django.contrib.auth', 'django.contrib.contenttypes',
    'django.contrib.sessions', 'django.contrib.messages', 'django.contrib.staticfiles',
    'corsheaders', 'rest_framework', 'rest_framework_simplejwt.token_blacklist',
    'apps.authn', 'apps.users', 'apps.plans', 'apps.payments', 'apps.notifications', 'apps.analytics',
]
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
ROOT_URLCONF = 'config.urls'
WSGI_APPLICATION = 'config.wsgi.application'
ASGI_APPLICATION = 'config.asgi.application'

DATABASES = {'default': env.db('DATABASE_URL', default='postgres://meta:meta@db:5432/metadiet')}
AUTH_USER_MODEL = 'users.User'

REDIS_URL = env('REDIS_URL', default='redis://redis:6379/0')
CELERY_BROKER_URL = REDIS_URL
CELERY_RESULT_BACKEND = REDIS_URL
CELERY_TASK_TRACK_STARTED = True
CELERY_TASK_TIME_LIMIT = 120

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': ('rest_framework_simplejwt.authentication.JWTAuthentication',),
    'DEFAULT_PERMISSION_CLASSES': ('rest_framework.permissions.IsAuthenticated',),
    'DEFAULT_RENDERER_CLASSES': ('rest_framework.renderers.JSONRenderer',),
}
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=30),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=14),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'AUTH_HEADER_TYPES': ('Bearer',),
}

CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOWED_ORIGINS = env.list('CORS_ALLOWED_ORIGINS', default=['http://localhost:5173', 'https://metadiet-frontend.onrender.com'])
CSRF_TRUSTED_ORIGINS = env.list('CSRF_TRUSTED_ORIGINS', default=['https://metadiet-frontend.onrender.com'])

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = env('SMTP_HOST', default='smtp.gmail.com')
EMAIL_PORT = env.int('SMTP_PORT', default=587)
EMAIL_HOST_USER = env('SMTP_USER', default='')
EMAIL_HOST_PASSWORD = env('SMTP_PASSWORD', default='')
EMAIL_USE_TLS = True
DEFAULT_FROM_EMAIL = env('DEFAULT_FROM_EMAIL', default='noreply@metadiet.ai')

RAZORPAY_KEY_ID = env('RAZORPAY_KEY_ID', default='')
RAZORPAY_KEY_SECRET = env('RAZORPAY_KEY_SECRET', default='')
FRONTEND_URL = env('FRONTEND_URL', default='http://localhost:5173')

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

TEMPLATES = [{
    'BACKEND': 'django.template.backends.django.DjangoTemplates',
    'DIRS': [], 'APP_DIRS': True,
    'OPTIONS': {'context_processors': [
        'django.template.context_processors.request','django.contrib.auth.context_processors.auth','django.contrib.messages.context_processors.messages'
    ]},
}]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
