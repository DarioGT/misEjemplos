# Create your views here.

from django.http import HttpResponse
from django.template import  Context
from django.template import  RequestContext
from django.template.loader import get_template 
from forms import *
from models import *
from tco.app_admin.security import *
from tco.app_admin.template_config import *   
from django.core.context_processors import csrf
from django.shortcuts import render_to_response
from django.http import HttpResponseRedirect, HttpResponse
from django.db import connection, transaction
from django.core import serializers

from tco.app_tco.models import *
import re


table_profil = 'app_scenario_profil_profil'
table_scenario = 'app_scenario_profil_scenario'
table_tco = 'app_tco_tco'

base_url = site_config('base_url')
base_profil_url =  base_url + 'profil_scenario'
    
def lst_profil(request,section):
   response = before_execute_view(request,section)
   if not response == True:
        return response
    
    
   template = get_template('pages/profil_scenario/profil_lst.html');
   
   sql = "SELECT * FROM "+table_profil+"  ORDER BY nomProfil "
   lst_profil = list(Profil.objects.raw(sql))
   
   index = 0
   for i in lst_profil:
        profil_id = lst_profil[index].id
        sql = "SELECT * FROM "+table_scenario+" WHERE profil_id = "+str(profil_id)+" ORDER BY nom "
        lst_childs = list(Scenario.objects.raw(sql))
        
        if lst_childs.count == 0:
            lst_profil[index].childs = []
        else:
            lst_profil[index].childs = lst_childs
        
        index = index + 1
   
   
   
   cfg = template_config(request)
   
   cfg.current_url = '/profil_scenario/'
   cfg.section = 'scenario_profil'
   
   variables = RequestContext( request, 
     {
        'username' : 'patrice',
        'cfg': cfg,
        'list':list,
        'lst_profil': lst_profil
     }                  
                    
   )
   
   output = template.render(variables);
   
   return HttpResponse(output)  
   
#
#  Vue pour creer un nouveau Profil
#
def add_profil(request,profil_id):
   section = 'profil'
    
   response = before_execute_view(request,section)
   if not response == True:
        return response
    
   template = get_template('pages/profil_scenario/profil_add.html');
   
   cfg = template_config(request)
   
   cfg.current_url = '/profil_scenario/'
   cfg.section = 'scenario_profil'
   success = 0
   
   base_url = site_config('base_url')
   
   if request.method == 'POST':
        if request.POST.get('action') == 'Annuler':
            return HttpResponseRedirect( base_profil_url )
        
        form = ProfilForm(request.POST)
        #form = UserCreationForm(request.POST)
        if form.is_valid():
            success = 1
            nom = form.cleaned_data['nomProfil']
            description = form.cleaned_data['description']
            nombreOccurence = form.cleaned_data['nombreOccurence']
            documentation = form.cleaned_data['documentation']
            
            profil = Profil()
            profil.nomProfil = nom
            profil.nombreOccurence = nombreOccurence
            profil.description = description
            profil.documentation = documentation 
            profil.save()
            
        else:
            success = 0
   else:
       form = ProfilForm()

   variables = RequestContext( request, 
     {
        'username' : 'patrice',
        'form' : form,
        'cfg': cfg,
        'success' : success        
     }               
   )
   
   output = template.render(variables)
   return HttpResponse(output)

#
#  Vue pour creer un nouveau TCO
#
def add_scenario(request,profil_id):
   section = 'scenario'
    
   response = before_execute_view(request,section)
   if not response == True:
        return response
    
   template = get_template('pages/profil_scenario/scenario_add.html');
   
   cfg = template_config(request)
   
   cfg.current_url = '/profil_scenario/'
   cfg.section = 'scenario_profil'
   success = 0
   
   base_url = site_config('base_url')
   
   scenarioType = ''
   
   if request.method == 'POST':
        if request.POST.get('action') == 'Annuler':
            return HttpResponseRedirect( base_profil_url )
        
        form = ScenarioForm(request.POST)
        #form = UserCreationForm(request.POST)
        if form.is_valid():
            
            scenarioType = request.REQUEST['scenarioType']
            
            success = 1
            nom = form.cleaned_data['nom']
            description = form.cleaned_data['description']
            #l_p = form.cleaned_data['libre_proprietaire']
            documentation = form.cleaned_data['documentation']
            nombreOccurence = form.cleaned_data['nombreOccurence']
            
            scenario = Scenario()
            scenario.nom = nom
            #scenario.libre_proprietaire = l_p
            scenario.description = description
            scenario.documentation = documentation 
            scenario.profil_id = profil_id
            scenario.nombreOccurence = nombreOccurence
            
            scenario.scenarioType = scenarioType
            
            scenario.save()
            
        else:
            success = 0
   else:
       form = ScenarioForm()

   variables = RequestContext( request, 
     {
        'username' : 'patrice',
        'form' : form,
        'cfg': cfg,
        'success' : success  ,
        'scenarioType': scenarioType        
     }               
   )
   
   output = template.render(variables)
   return HttpResponse(output)

#
#  Vue pour voir la liste des parametres pour un TCO
#                       
def lst_profil_scenario(request,tco_id,section):
   section = 'profil' 
    
   response = before_execute_view(request,section)
   if not response == True:
        return response
    
   template = get_template('pages/profil_scenario/profil_parametres_lst.html');
   
   lst_tco_parametres = Parametre.objects.filter(tco=tco_id)
   cfg = template_config(request)
   
   cfg.current_url = '/profil_scenario/'
   cfg.section = 'scenario_profil'

   variables = RequestContext(  request,
     {
        'lst_tco_parametres' : lst_tco_parametres,
        'cfg': cfg,
        'tco_id':tco_id
     }                  
                    
   )
   
   output = template.render(variables);
   return HttpResponse(output)  
   
   
#
#  Vue pour editer un TCO
#  
def edit_profil(request,profil_id):
   section = 'profil'
    
   response = before_execute_view(request,section)
   if not response == True:
        return response
    
   template = get_template('pages/profil_scenario/profil_edit.html');
   
   profil = Profil.objects.get(pk=profil_id)
   
   cfg = template_config(request)
   
   cfg.current_url = '/profil_scenario/'
   cfg.section = 'scenario_profil'
   success = 0
   
   base_url = site_config('base_url')
   
   if request.method == 'POST':
        if request.POST.get('action') == 'Annuler':
            return HttpResponseRedirect( base_profil_url )
       
        form = ProfilForm(request.POST)
        if form.is_valid():
            success = 1
            nom = form.cleaned_data['nomProfil']
            description = form.cleaned_data['description']
            nombreOccurence = form.cleaned_data['nombreOccurence']
            documentation = form.cleaned_data['documentation']
            
            #profil = Profil()
            profil.nomProfil = nom
            profil.nombreOccurence = nombreOccurence
            profil.description = description
            profil.documentation = documentation 
            profil.save()
            
        else:
            success = 0
   else:
        form = ProfilForm(instance=profil)

   variables = RequestContext( request, 
     {
        'username' : 'patrice',
        'form' : form,
        'cfg': cfg,
        'success' : success        
     }               
   )
   
   output = template.render(variables)
   return HttpResponse(output)   

#
#  Vue pour editer un TCO
#  
def edit_scenario(request,scenario_id):
   section = 'scenario'
    
   response = before_execute_view(request,section)
   if not response == True:
        return response
    
   template = get_template('pages/profil_scenario/scenario_edit.html');
   
   scenario = Scenario.objects.get(pk=scenario_id)
   
   scenarioType = scenario.scenarioType
   
   cfg = template_config(request)
   
   cfg.current_url = '/profil_scenario/'
   cfg.section = 'scenario_profil'
   success = 0
   
   base_url = site_config('base_url')
   
   if request.method == 'POST':
        if request.POST.get('action') == 'Annuler':
            return HttpResponseRedirect( base_profil_url )
       
        form = ScenarioForm(request.POST)
        if form.is_valid():
            
            scenarioType = request.REQUEST['scenarioType']
            
            success = 1
            nom = form.cleaned_data['nom']
            description = form.cleaned_data['description']
            nombreOccurence = form.cleaned_data['nombreOccurence']
            documentation = form.cleaned_data['documentation']
            
            scenario.nom = nom
            scenario.nombreOccurence = nombreOccurence
            scenario.description = description
            scenario.documentation = documentation 
            scenario.scenarioType = scenarioType
            scenario.save()
            
        else:
            success = 0
   else:
        form = ScenarioForm(instance=scenario)

   variables = RequestContext( request, 
     {
        'username' : 'patrice',
        'form' : form,
        'cfg': cfg,
        'success' : success,
        'scenarioType': scenarioType        
     }               
   )
   
   output = template.render(variables)
   return HttpResponse(output)   



#
#  Vue pour supprimer un TCO
#    
def delete_profil(request,profil_id,section):
   section = 'profil'
    
   response = before_execute_view(request,section)
   if not response == True:
        return response
    
   template = get_template('pages/profil_scenario/profil_delete.html');
   cfg = template_config(request)
   cfg.current_url = '/profil_scenario/'
   section = ''
   cfg.section = section
   success = 0
   
   base_url = site_config('base_url')
   debug = ''
   
   if request.method == 'POST':
       if request.POST.get('action') == 'Annuler':
            return HttpResponseRedirect( base_profil_url )
        
       deleteForm = DeleteForm( request.POST )
       
       if request.POST.get('action','') == 'delete':
           profil = Profil.objects.get(pk=profil_id)
           profil.delete()
           
           success = 1
       
   else:
        deleteForm = DeleteForm( { 'action':'delete','tco_id': profil_id }  )
       
   variables = RequestContext(request, 
     {
        'form' : deleteForm,
        'cfg': cfg,
        'profil_id': profil_id,
        'request':request,
     }                  
                    
   )
   
   output = template.render(variables);
   return HttpResponse(output)          
   
def delete_scenario(request,scenario_id,section):
   section = 'scenario'
    
   response = before_execute_view(request,section)
   if not response == True:
        return response
    
   template = get_template('pages/profil_scenario/scenario_delete.html');
   cfg = template_config(request)
   cfg.current_url = '/profil_scenario/'
   section = ''
   cfg.section = section
   success = 0
   
   base_url = site_config('base_url')
   debug = ''
   
   if request.method == 'POST':
       if request.POST.get('action') == 'Annuler':
            return HttpResponseRedirect( base_profil_url )
        
       deleteForm = DeleteForm( request.POST )
       
       if request.POST.get('action','') == 'delete':
           scenario = Scenario.objects.get(pk=scenario_id)
           scenario.delete()
           
           success = 1
       
   else:
        deleteForm = DeleteForm( { 'action':'delete','scenario_id': scenario_id }  )
       
   variables = RequestContext(request, 
     {
        'form' : deleteForm,
        'cfg': cfg,
        'scenario_id': scenario_id,
        'request':request,
     }                  
                    
   )
   
   output = template.render(variables);
   return HttpResponse(output)      

def lst_tco_build_list(lst_tco):
    index = 0
    for i in lst_tco:
        tco_id = lst_tco[index].id
        sql = "SELECT * FROM "+table_tco+" WHERE parent_tco_id = "+str(tco_id)+" ORDER BY niveau "
        lst_childs = list(Tco.objects.raw(sql))
        #lst_childs = list( Tco.objects.filter(parent_tco_id=tco_id) )
        
        if lst_childs.count == 0:
            lst_tco[index].childs = []
        else:
            lst_tco[index].childs = lst_tco_build_list( lst_childs )
        
        index = index + 1
        
    return lst_tco

   
def ajax_lst_tco_mesures(request,profil_id,scenario_id):
   section = 'mesure' 
    
   response = before_execute_view(request,section)
   if not response == True:
        return response
    
   template = get_template('pages/profil_scenario/ajax_mesures_tco_lst.html');
   cfg = template_config(request)
   cfg.current_url = '/profil_scenario/'
   cfg.section = 'scenario_profil'
   success = 0
   
   base_url = site_config('base_url')
   debug = ''
   
   sql = "SELECT * FROM "+table_tco+" WHERE parent_tco_id = -1 ORDER BY niveau "
   lst_tco = list(Tco.objects.raw(sql))
   tree_lst_tco = lst_tco_build_list(lst_tco)
   
   cfg.tree = tree_lst_tco
   cfg.scenario_id = scenario_id
   cfg.profil_id = profil_id
   
   variables = RequestContext( request, 
     {
        'username' : 'patrice',
        'lst_tco' : lst_tco,
        'cfg': cfg,
        'list':list,
         'scenario_id' : scenario_id,
         'profil_id' : profil_id,
        'tree_lst_tco':tree_lst_tco
     }                  
                    
   )
   
   output = template.render(variables);
   return HttpResponse(output)   

def ajax_lst_tco_mesures_parametre(request,profil_id,scenario_id,tco_id):
   section = 'tco'
   
   response = before_execute_view(request,section)
   if not response == True:
        return response
    
   template = get_template('pages/profil_scenario/ajax_mesures_tco_lst_parametres.html');
   
   lst_tco_parametres = Parametre.objects.filter(tco=tco_id)
   cfg = template_config(request)
   
   cfg.current_url = '/tco/'
   cfg.section = section

   variables = RequestContext(  request,
     {
        'lst_tco_parametres' : lst_tco_parametres,
        'cfg': cfg,
        'tco_id':tco_id
     }                  
                    
   )
   
   output = template.render(variables);
   return HttpResponse(output)  

def ajax_get_parametre_infos(request,parametreId):
    
   param = Parametre.objects.get(pk=parametreId)
    
   output = '''
                var parametre = {
                                 'year1':"%1%",
                                 'year2':"%2%",
                                 'year3':"%3%",
                                 'year4':"%4%",
                                 'year5':"%5%",
                                 'year6':"%6%",
                                 'year7':"%7%",
                                 'year8':"%8%",
                                 'year9':"%9%",
                                 'year10':"%10%",
                                 'year11':"%11%",
                                 'year12':"%12%",
                                 'year13':"%13%",
                                 'year14':"%14%",
                                 'year15':"%15%",
                                 'year16':"%16%",
                                 'year17':"%17%",
                                 'year18':"%18%",
                                 'year19':"%19%",
                                 'year20':"%20%"
                                 }
            '''
   
   output = output.replace('%1%',param.annee1)
   output = output.replace('%2%',param.annee2)
   output = output.replace('%3%',param.annee3)
   output = output.replace('%4%',param.annee4)
   output = output.replace('%5%',param.annee5)
   output = output.replace('%6%',param.annee6)
   output = output.replace('%7%',param.annee7)
   output = output.replace('%8%',param.annee8)
   output = output.replace('%9%',param.annee9)
   output = output.replace('%10%',param.annee10)
   output = output.replace('%11%',param.annee11)
   output = output.replace('%12%',param.annee12)
   output = output.replace('%13%',param.annee13)
   output = output.replace('%14%',param.annee14)
   output = output.replace('%15%',param.annee15)
   output = output.replace('%16%',param.annee16)
   output = output.replace('%17%',param.annee17)
   output = output.replace('%18%',param.annee18)
   output = output.replace('%19%',param.annee19)
   output = output.replace('%20%',param.annee20)                                            
                           
   return HttpResponse(output)  
    
def lst_tco_build_list(lst_tco,lst_mesures_tmp):
    index = 0
    for i in lst_tco:
        tco_id = lst_tco[index].id
        
        lst_tco[index].mesureFound = False
        lst_tco[index].mesure = False
        for m in lst_mesures_tmp:
            if m.tco.id == tco_id:
                lst_tco[index].mesureFound = True
                lst_tco[index].mesure = m
                break
            
        if lst_tco[index].mesureFound == True:
            lst_mesures_tmp.remove(m)
        
        
        sql = "SELECT * FROM "+table_tco+" WHERE parent_tco_id = "+str(tco_id)+" ORDER BY niveau "
        lst_childs = list(Tco.objects.raw(sql))
        
        if lst_childs.count == 0:
            lst_tco[index].childs = []
        else:
            lst_tco[index].childs = lst_tco_build_list( lst_childs,lst_mesures_tmp )
        
        index = index + 1
        
    return lst_tco
    
def lst_mesures(request,profil_id,scenario_id):
   section = 'mesure' 
    
   response = before_execute_view(request,section)
   if not response == True:
        return response
    
   template = get_template('pages/profil_scenario/mesures_lst.html');
   cfg = template_config(request)
   cfg.current_url = '/profil_scenario/'
   cfg.section = 'scenario_profil'
   success = 0
   
   base_url = site_config('base_url')
   debug = ''
   
   lst_mesures = list(Mesure.objects.filter(scenario=scenario_id))
   
   cfg.scenario_id = scenario_id
   cfg.profil_id = profil_id
   #cfg.tco_id = tco_id
   
   lst_mesures_tmp = list(Mesure.objects.filter(scenario=scenario_id))
   
   #lst_mesures = [len(lst_mesures_tmp)]
   #for m in lst_mesures_tmp:
   #    lst_mesures[m.tco.id] = m
       
   
   sql = "SELECT * FROM "+table_tco+" WHERE parent_tco_id = -1 ORDER BY niveau "
   lst_tco = list(Tco.objects.raw(sql))
   tree_lst_tco = lst_tco_build_list(lst_tco,lst_mesures_tmp)
   
   cfg.lst_mesures = lst_mesures
   cfg.tree_lst_tco = tree_lst_tco
   
   variables = RequestContext( request, 
     {
        'cfg': cfg,
        'scenario_id' : scenario_id,
        'profil_id' : profil_id,
        'tco_id' : profil_id,
        'lst_mesures' : lst_mesures
     }                  
                    
   )
   
   output = template.render(variables);
   return HttpResponse(output) 
    
#
#  Vue pour creer un nouveau Profil
#
def mesures_add(request,profil_id,scenario_id):
   section = 'profil'
    
   response = before_execute_view(request,section)
   if not response == True:
        return response
    
   template = get_template('pages/profil_scenario/mesures_add.html');
   
   cfg = template_config(request)
   
   cfg.current_url = '/profil_scenario/'
   cfg.section = 'scenario_profil'
   success = 0
   
   base_url = site_config('base_url')
   errorMsg = ''
   
   parametre_id = ''
   
   if request.method == 'POST':
        if request.POST.get('action') == 'Annuler':
            base_url_mesure = base_url + 'profil_scenario/' + profil_id + '/scenario/' + scenario_id + '/mesures'
            
            return HttpResponseRedirect( base_url_mesure )
        
        form = MesureForm(request.POST)
        if form.is_valid():
            success = 1
            parametre_id = request.REQUEST['parametre']
            
            mesure = form.save(commit=False)
            
            if not re.search(r"^[0-9]+$",parametre_id):
                success = 0
                errorMsg = "Le parametre doit etre numerique."
            
            if success == 1:    
                try :
                    mesure.parametre = Parametre.objects.get(pk=parametre_id)
                except Parametre.DoesNotExist:
                    success = 0
                    errorMsg = "Le parametre inscrit n'existe pas."
                    
            if success == 1:
                try:
                    mesure.scenario = Scenario.objects.get(pk=scenario_id)
                except Scenario.DoesNotExist:
                    success = 0
                    errorMsg = "Le Sc&eacute;nario inscrit n'existe pas."
                    
            if success == 1:
                mesure.save();
            
            
        else:
            success = 0
   else:
       form = MesureForm()
       
       
       
   cfg.scenario_id = scenario_id
   cfg.profil_id = profil_id
 #  cfg.tco_id = tco_id
   variables = RequestContext( request, 
     {
        'username' : 'patrice',
        'form' : form,
        'cfg': cfg,
        'success' : success ,
        'errorMsg':errorMsg,
        'parametre_id':parametre_id,
        'scenario_id' : scenario_id,       
        'profil_id' : profil_id
     }               
   )
   
   output = template.render(variables)
   return HttpResponse(output)

def checkIfFloatValue(str):
    if not str:
        return 0
    else:
        try:
            str = float(str)
            return str
        except ValueError:
            return 0

    
    
def mesures_edit(request,profil_id,scenario_id,mesure_id):
   section = 'profil'
    
    
   errorMsg = ''
   response = before_execute_view(request,section)
   if not response == True:
        return response
    
   template = get_template('pages/profil_scenario/mesures_edit.html');
   
   cfg = template_config(request)
   
   cfg.current_url = '/profil_scenario/'
   cfg.section = 'scenario_profil'
   success = 0
   
   base_url = site_config('base_url')
   
   tco_id = -1
   try:
       mesure = Mesure.objects.get(pk=mesure_id)
       tco_id = mesure.tco.id
   except Mesure.DoesNotExist:
       mesure = Mesure()
       
   if request.method == 'POST':
        if request.POST.get('action') == 'Annuler':
            base_url_mesure = base_url + 'profil_scenario/' + scenario_id + '/scenario/' + scenario_id + '/mesures'
            
            return HttpResponseRedirect( base_url_mesure )
        
        form = MesureForm(request.POST)
        if form.is_valid():
            success = 1
            
            p_mesure = form.save(commit=False)
            p_mesure.tco = Tco.objects.get(pk=mesure.tco.id)
            
            p_mesure.id = mesure_id
            
            p_mesure.annee1 = checkIfFloatValue(p_mesure.annee1)
            p_mesure.annee2 = checkIfFloatValue(p_mesure.annee2)
            p_mesure.annee3 = checkIfFloatValue(p_mesure.annee3)
            p_mesure.annee4 = checkIfFloatValue(p_mesure.annee4)
            p_mesure.annee5 = checkIfFloatValue(p_mesure.annee5)
            p_mesure.annee6 = checkIfFloatValue(p_mesure.annee6)
            p_mesure.annee7 = checkIfFloatValue(p_mesure.annee7)
            p_mesure.annee8 = checkIfFloatValue(p_mesure.annee8)
            p_mesure.annee9 = checkIfFloatValue(p_mesure.annee9)
            p_mesure.annee10 = checkIfFloatValue(p_mesure.annee10)
            p_mesure.annee11 = checkIfFloatValue(p_mesure.annee11)
            p_mesure.annee12 = checkIfFloatValue(p_mesure.annee12)
            p_mesure.annee13 = checkIfFloatValue(p_mesure.annee13)
            p_mesure.annee14 = checkIfFloatValue(p_mesure.annee14)
            p_mesure.annee15 = checkIfFloatValue(p_mesure.annee15)
            p_mesure.annee16 = checkIfFloatValue(p_mesure.annee16)
            p_mesure.annee17 = checkIfFloatValue(p_mesure.annee17)
            p_mesure.annee18 = checkIfFloatValue(p_mesure.annee18)
            p_mesure.annee19 = checkIfFloatValue(p_mesure.annee19)
            p_mesure.annee20 = checkIfFloatValue(p_mesure.annee20)
            
            total = p_mesure.annee1 + p_mesure.annee2 + p_mesure.annee3 + p_mesure.annee4 + p_mesure.annee5
            total = total +  p_mesure.annee6 + p_mesure.annee7 + p_mesure.annee8 + p_mesure.annee9 + p_mesure.annee10
            total = total +  p_mesure.annee11 + p_mesure.annee12 + p_mesure.annee13 + p_mesure.annee14 + p_mesure.annee15
            total = total +  p_mesure.annee16 + p_mesure.annee17 + p_mesure.annee18 + p_mesure.annee19 + p_mesure.annee20
            
            p_mesure.total = total
            
            if success == 1:
                try:
                    p_mesure.scenario = Scenario.objects.get(pk=scenario_id)
                except Scenario.DoesNotExist:
                    success = 0
                    errorMsg = "Le Sc&eacute;nario inscrit n'existe pas."
                    
            if success == 1:
                p_mesure.save();
            
        else:
            success = 0
   else:
       form = MesureForm(instance=mesure)
       
       
   cfg.tco_id = tco_id
   cfg.scenario_id = scenario_id
   cfg.profil_id = profil_id
   
   variables = RequestContext( request, 
     {
        'username' : 'patrice',
        'form' : form,
        'cfg': cfg,
        'success' : success,
         'errorMsg':errorMsg,
        'scenario_id' : scenario_id,       
        'profil_id' : profil_id        
     }               
   )
   
   output = template.render(variables)
   return HttpResponse(output)

def mesures_edit_from_tco(request,profil_id,scenario_id,tco_id):
   section = 'profil'
    
    
   errorMsg = ''
   response = before_execute_view(request,section)
   if not response == True:
        return response
    
   template = get_template('pages/profil_scenario/mesures_edit.html');
   
   cfg = template_config(request)
   
   cfg.current_url = '/profil_scenario/'
   cfg.section = 'scenario_profil'
   success = 0
   
   base_url = site_config('base_url')
   
   mesure = Mesure()
       
   if request.method == 'POST':
        if request.POST.get('action') == 'Annuler':
            base_url_mesure = base_url + 'profil_scenario/' + scenario_id + '/scenario/' + scenario_id + '/mesures'
            
            return HttpResponseRedirect( base_url_mesure )
        
        form = MesureForm(request.POST)
        if form.is_valid():
            success = 1
            
            p_mesure = form.save(commit=False)
            p_mesure.tco = Tco.objects.get(pk=tco_id)
            
            p_mesure.annee1 = checkIfFloatValue(p_mesure.annee1)
            p_mesure.annee2 = checkIfFloatValue(p_mesure.annee2)
            p_mesure.annee3 = checkIfFloatValue(p_mesure.annee3)
            p_mesure.annee4 = checkIfFloatValue(p_mesure.annee4)
            p_mesure.annee5 = checkIfFloatValue(p_mesure.annee5)
            p_mesure.annee6 = checkIfFloatValue(p_mesure.annee6)
            p_mesure.annee7 = checkIfFloatValue(p_mesure.annee7)
            p_mesure.annee8 = checkIfFloatValue(p_mesure.annee8)
            p_mesure.annee9 = checkIfFloatValue(p_mesure.annee9)
            p_mesure.annee10 = checkIfFloatValue(p_mesure.annee10)
            p_mesure.annee11 = checkIfFloatValue(p_mesure.annee11)
            p_mesure.annee12 = checkIfFloatValue(p_mesure.annee12)
            p_mesure.annee13 = checkIfFloatValue(p_mesure.annee13)
            p_mesure.annee14 = checkIfFloatValue(p_mesure.annee14)
            p_mesure.annee15 = checkIfFloatValue(p_mesure.annee15)
            p_mesure.annee16 = checkIfFloatValue(p_mesure.annee16)
            p_mesure.annee17 = checkIfFloatValue(p_mesure.annee17)
            p_mesure.annee18 = checkIfFloatValue(p_mesure.annee18)
            p_mesure.annee19 = checkIfFloatValue(p_mesure.annee19)
            p_mesure.annee20 = checkIfFloatValue(p_mesure.annee20)
            
            total = p_mesure.annee1 + p_mesure.annee2 + p_mesure.annee3 + p_mesure.annee4 + p_mesure.annee5
            total = total +  p_mesure.annee6 + p_mesure.annee7 + p_mesure.annee8 + p_mesure.annee9 + p_mesure.annee10
            total = total +  p_mesure.annee11 + p_mesure.annee12 + p_mesure.annee13 + p_mesure.annee14 + p_mesure.annee15
            total = total +  p_mesure.annee16 + p_mesure.annee17 + p_mesure.annee18 + p_mesure.annee19 + p_mesure.annee20
            
            p_mesure.total = total
            
            if success == 1:
                try:
                    p_mesure.scenario = Scenario.objects.get(pk=scenario_id)
                except Scenario.DoesNotExist:
                    success = 0
                    errorMsg = "Le Sc&eacute;nario inscrit n'existe pas."
                    
            if success == 1:
                p_mesure.save();
            
        else:
            success = 0
   else:
       form = MesureForm(instance=mesure)
       
       
   cfg.tco_id = tco_id
   cfg.scenario_id = scenario_id
   cfg.profil_id = profil_id
   
   variables = RequestContext( request, 
     {
        'username' : 'patrice',
        'form' : form,
        'cfg': cfg,
        'success' : success,
         'errorMsg':errorMsg,
        'scenario_id' : scenario_id,       
        'profil_id' : profil_id        
     }               
   )
   
   output = template.render(variables)
   return HttpResponse(output)

def mesures_edit_old(request,profil_id,scenario_id,mesures_id):
   section = 'profil'
    
    
   errorMsg = ''
   response = before_execute_view(request,section)
   if not response == True:
        return response
    
   template = get_template('pages/profil_scenario/mesures_edit.html');
   
   cfg = template_config(request)
   
   cfg.current_url = '/profil_scenario/'
   cfg.section = 'scenario_profil'
   success = 0
   
   base_url = site_config('base_url')
   
   parametre_id = 0
   
   if request.method == 'POST':
        if request.POST.get('action') == 'Annuler':
            base_url_mesure = base_url + 'profil_scenario/' + scenario_id + '/scenario/' + scenario_id + '/mesures'
            
            return HttpResponseRedirect( base_url_mesure )
        
        form = MesureForm(request.POST)
        if form.is_valid():
            success = 1
            parametre_id = request.REQUEST['parametre']
            
            if not re.search(r"^[0-9]+$",parametre_id):
                success = 0
                errorMsg = "Le parametre doit etre numerique."
            
            p_mesure = form.save(commit=False)
            
            p_mesure.id = mesures_id
            
            if success == 1:
                try :
                    p_mesure.parametre = Parametre.objects.get(pk=parametre_id)
                except Parametre.DoesNotExist:
                    success = 0
                    errorMsg = "Le parametre inscrit n'existe pas."
            if success == 1:
                try:
                    p_mesure.scenario = Scenario.objects.get(pk=scenario_id)
                except Scenario.DoesNotExist:
                    success = 0
                    errorMsg = "Le Sc&eacute;nario inscrit n'existe pas."
                    
            if success == 1:
                p_mesure.save();
            
        else:
            success = 0
   else:
       mesure = Mesure.objects.get(pk=mesures_id)
       form = MesureForm(instance=mesure)
       parametre_id = mesure.parametre.id
       
       
   cfg.mesure_id = mesures_id
   cfg.scenario_id = scenario_id
   cfg.profil_id = profil_id
   
   variables = RequestContext( request, 
     {
        'username' : 'patrice',
        'form' : form,
        'cfg': cfg,
        'success' : success,
         'errorMsg':errorMsg,
        'parametre_id':parametre_id,
        'scenario_id' : scenario_id,       
        'profil_id' : profil_id        
     }               
   )
   
   output = template.render(variables)
   return HttpResponse(output)
   
   
def mesures_delete(request,profil_id,scenario_id,mesures_id):
   section = 'scenario'
    
   response = before_execute_view(request,section)
   if not response == True:
        return response
    
   template = get_template('pages/profil_scenario/mesures_delete.html');
   cfg = template_config(request)
   cfg.current_url = '/profil_scenario/'
   section = ''
   cfg.section = section
   success = 0
   
   base_url = site_config('base_url')
   debug = ''
   
   if request.method == 'POST':
       if request.POST.get('action') == 'Annuler':
            base_url_mesure = base_url + 'profil_scenario/' + scenario_id + '/scenario/' + scenario_id + '/mesures'
            return HttpResponseRedirect( base_url_mesure )
        
       deleteForm = DeleteForm( request.POST )
       
       if request.POST.get('action','') == 'delete':
           mesure = Mesure.objects.get(pk=mesures_id)
           mesure.delete()
           
           success = 1
       
   else:
        deleteForm = DeleteForm( { 'action':'delete','scenario_id': scenario_id }  )
   
   
   cfg.mesure_id = mesures_id
   cfg.scenario_id = scenario_id
   cfg.profil_id = profil_id    
   variables = RequestContext(request, 
     {
        'form' : deleteForm,
        'cfg': cfg,
        'scenario_id': scenario_id,
        'request':request,
        'profil_id' : profil_id
     }                  
                    
   )
   
   output = template.render(variables);
   return HttpResponse(output)  
   