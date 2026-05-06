from django.db import migrations, models
import django.db.models.deletion

class Migration(migrations.Migration):
    initial = True
    dependencies = [('users', '0001_initial')]
    operations = [migrations.CreateModel(name='Payment', fields=[
        ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
        ('razorpay_order_id', models.CharField(max_length=120, unique=True)), ('razorpay_payment_id', models.CharField(blank=True, max_length=120)),
        ('amount', models.IntegerField()), ('status', models.CharField(choices=[('created', 'created'), ('paid', 'paid'), ('failed', 'failed')], default='created', max_length=20)),
        ('metadata', models.JSONField(default=dict)), ('created_at', models.DateTimeField(auto_now_add=True)),
        ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.user')),
    ])]
