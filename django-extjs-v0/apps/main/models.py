
#
# here are some simple models for testing purpose
#

from django.db import models

LIST_TYPES = [
    ('OWNER','Owner')
    ,('RENTER','Renter')
    ,('GUEST','Guest')
    ,('TESTER','Tester')

]
GENDER_CHOICES = (
        ('M', 'Male'),
        ('F', 'Female'),
    )
    
class Car(models.Model):
    brand = models.CharField(max_length=50, verbose_name="Car brand", help_text="Fill the car brand")
    model = models.CharField(max_length=50, verbose_name="Car model", help_text="Fill the car model")
    
    def __unicode__(self):
        return u'%s %s' % (self.brand, self.model)
        
class Customer(models.Model):
    
    date = models.DateField(auto_now = True, verbose_name="Date modified")
    datetime = models.DateTimeField(auto_now = True, verbose_name="DateTime modified")
    
    #last_seen = models.DateField(verbose_name="Last Date customer went in store", help_text="This is mandatory !", blank=True, null=True)
    last_datetime = models.DateTimeField(verbose_name="dateTimeTest", blank=True, null=True)
    #last_call_hour = models.TimeField(verbose_name="Last Hour customer was reacheable by phone", blank = True, null = True)
    
    gender = models.CharField(max_length=10, choices = GENDER_CHOICES)
    name = models.CharField(max_length=50)
    email = models.EmailField()
    ctype = models.CharField(max_length=10, choices = LIST_TYPES, verbose_name="Customer type", help_text="This is mandatory !")
    car = models.ForeignKey(Car, blank=True, null=True, verbose_name="Customer car if any")
    
    is_vip = models.BooleanField(default = False)
    
    balance = models.FloatField(verbose_name='Customer balance', default = 0)