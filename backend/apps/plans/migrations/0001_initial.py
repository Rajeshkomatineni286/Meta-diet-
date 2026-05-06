from django.db import migrations, models
import django.db.models.deletion

class Migration(migrations.Migration):
    initial = True
    dependencies = [('users', '0001_initial')]
    operations = [migrations.CreateModel(name='Plan', fields=[
        ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
        ('diet_plan', models.JSONField(default=dict)), ('workout_plan', models.JSONField(default=dict)),
        ('calories', models.IntegerField()), ('protein_g', models.IntegerField()), ('fat_g', models.IntegerField()),
        ('created_at', models.DateTimeField(auto_now_add=True)), ('is_locked', models.BooleanField(default=True)),
        ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.user')),
    ])]
