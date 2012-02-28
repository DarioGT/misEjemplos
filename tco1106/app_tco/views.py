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

table_tco = 'app_tco_tco'
base_url = site_config('base_url')
base_tco_url =  base_url + 'tco'
#  Vue pour generer la liste des TCO
#

def lst_tco_build_list(lst_tco):
    index = 0
    for i in lst_tco:
        tco_id = lst_tco[index].id
        sql = "SELECT * FROM "+table_tco+" WHERE parent_tco_id = "+str(tco_id)+" ORDER BY niveau "
        lst_childs = list(Tco.objects.raw(sql))
        
        if lst_childs.count == 0:
            lst_tco[index].childs = []
        else:
            lst_tco[index].childs = lst_tco_build_list( lst_childs )
        
        index = index + 1
        
    return lst_tco
    
    
def lst_tco(request):
    
   section = 'tco'
   response = before_execute_view(request,section)
   if not response == True:
        return response
    
    
   template = get_template('pages/tco/tco_lst.html');
   
   sql = "SELECT * FROM "+table_tco+" WHERE parent_tco_id = -1 ORDER BY niveau "
   lst_tco = list(Tco.objects.raw(sql))
   tree_lst_tco = lst_tco_build_list(lst_tco)
   
   cfg = template_config(request)
   
   cfg.current_url = '/tco/'
   cfg.section = section
   
   variables = RequestContext( request, 
     {
        'username' : 'patrice',
        'lst_tco' : lst_tco,
        'cfg': cfg,
        'list':list,
        'tree_lst_tco':tree_lst_tco
     }                  
                    
   )
   
   output = template.render(variables);
   
   return HttpResponse(output)  
   
#
#  Vue pour creer un nouveau TCO
#
def add_tco(request,parent_tco_id):
   section = 'tco'
   
   response = before_execute_view(request,section)
   if not response == True:
        return response
    
   template = get_template('pages/tco/tco_add.html');
   
   cfg = template_config(request)
   
   cfg.current_url = '/tco/'
   cfg.section = 'tco'
   success = 0
   
   if request.method == 'POST':
        if request.POST.get('action') == 'Annuler':
            return HttpResponseRedirect( base_url + 'tco')
        
        form = TcoForm(request.POST)
        #form = UserCreationForm(request.POST)
        if form.is_valid():
            success = 1
            titre = form.cleaned_data['titre']
            niveau = form.cleaned_data['niveau']
            description = form.cleaned_data['description']
            parent_tco_id = form.cleaned_data['parent_tco_id']
            documentation = form.cleaned_data['documentation']
            
            tco = Tco(0,parent_tco_id,niveau,titre,description,documentation)
            tco.niveau = niveau
            tco.titre = titre
            tco.description = description
            tco.documentation = documentation 
            tco.parent_tco_id = parent_tco_id 
            
            tco.save()
            
        else:
            success = 0
   else:
       niveau = 'g'
       if parent_tco_id > -1:
           lst_childs = list( Tco.objects.filter(parent_tco_id=parent_tco_id) )
           niveau = len(lst_childs)
       form = TcoForm(initial={'parent_tco_id':parent_tco_id,'niveau':niveau})

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
#  Vue pour voir la liste des parametres pour un TCO
#                       
def lst_tco_parametres(request,tco_id):
   section = 'tco'
   
   response = before_execute_view(request,section)
   if not response == True:
        return response
    
   template = get_template('pages/tco/tco_parametres_lst.html');
   
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
   

def copy_tco(request,idTco):
   tco = Tco.objects.get(pk=idTco)
   tco.id = 0
   tco.save()

   return HttpResponseRedirect( base_url + 'tco/')

  


   
#
#  Vue pour editer un TCO
#  
def edit_tco(request,idTco):
   section = 'tco'
   
   response = before_execute_view(request,section)
   if not response == True:
        return response
    
   template = get_template('pages/tco/tco_edit.html');
   
   tco = Tco.objects.get(pk=idTco)
   
   cfg = template_config(request)
   
   cfg.current_url = '/tco/'
   cfg.section = section
   success = 0
   
   if request.method == 'POST':
        if request.POST.get('action') == 'Annuler':
            return HttpResponseRedirect( base_url + 'tco/')
       
        form = TcoForm(request.POST)
        if form.is_valid():
            success = 1
            titre = form.cleaned_data['titre']
            niveau = form.cleaned_data['niveau']
            description = form.cleaned_data['description']
            parent_tco_id = form.cleaned_data['parent_tco_id']
            documentation = form.cleaned_data['documentation']
            
            tco = Tco()
            tco.id = idTco
            tco.niveau = niveau
            tco.titre = titre
            tco.description = description
            tco.documentation = documentation
            tco.parent_tco_id = parent_tco_id
            
            tco.save()
            
        else:
            success = 0
   else:
        form = TcoForm(instance=tco)

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
#  Vue pour supprimer un TCO
#    
def delete_tco(request,tco_id):
   section = 'tco'
   
   response = before_execute_view(request,section)
   if not response == True:
        return response
    
   template = get_template('pages/tco/tco_delete.html');
   cfg = template_config(request)
   cfg.current_url = '/tco/'
   section = ''
   cfg.section = 'tco'
   success = 0
   
   debug = ''
   
   if request.method == 'POST':
       if request.POST.get('action') == 'Annuler':
            return HttpResponseRedirect( base_url + 'tco')
        
       deleteForm = DeleteForm( request.POST )
       
       if request.POST.get('action','') == 'delete':
           tco_id = request.POST.get('tco_id','')
           tco = Tco.objects.get(pk=tco_id)
           
           #sql = "SELECT * FROM "+table_tco+" WHERE parent_tco_id = "+str(tco.parent_tco_id)+" ORDER BY niveau"
           #lst_brothers = list(Tco.objects.raw(sql))
           #if len(lst_brothers) > 1:
           #    found = False
           #    lst_id = []
           #    
           #    for tco_brother in lst_brothers:
           #        if found == True:
           #            lst_id.append(str(tco_brother.id)+',')
           #        
           #        if tco_brother.id == tco.id:
           #            found = True
               
           #    if len(lst_id) > 0:
           #        cursor = connection.cursor()
                   
           #        sql = "UPDATE "+table_tco+" SET niveau = niveau -1 WHERE parent_tco_id = "+str(tco.parent_tco_id)+" AND niveau > " + str(tco.niveau)
                    # Data modifying operation - commit required
           #        cursor.execute(sql)
           #        transaction.commit_unless_managed()
               
           tco.delete()
           
           success = 1
       
   else:
        deleteForm = DeleteForm( { 'action':'delete','tco_id': tco_id }  )
       
   variables = RequestContext(request, 
     {
        'username' : 'patrice',
        'form' : deleteForm,
        'lst_tco' : lst_tco,
        'cfg': cfg,
        'tco_id': tco_id,
        'request':request,
        'debug':debug
     }                  
                    
   )
   
   output = template.render(variables);
   return HttpResponse(output)          
   
   
   
def tco_parametres_add(request,tco_id):
   section = 'parameter'
   
   response = before_execute_view(request,section)
   if not response == True:
        return response
    
   template = get_template('pages/tco/tco_parametres_add.html');
   
   cfg = template_config(request)
   
   cfg.current_url = '/tco/'
   cfg.section = 'tco'
   success = 0
   
   parametreType = ''
   
   if request.method == 'POST':
        if request.POST.get('action') == 'Annuler':
            return HttpResponseRedirect( base_url + 'tco/' + tco_id + '/parameters')
        
        form = ParametreForm(request.POST)
        if form.is_valid():
            parametreType = request.REQUEST['parametreType']
            
            form = ParametreForm(request.POST)
            parametre = form.save(commit=False)
            
            parametre.tco = Tco.objects.get(pk=tco_id)
            parametre.parametreType = parametreType
            parametre.save()
            
            success = 1
        else:
            success = 0
   else:
        form = ParametreForm()

   variables = RequestContext( request, 
     {
        'username' : 'patrice',
        'form' : form,
        'cfg': cfg,
        'success' : success,
        'tco_id': tco_id,
        'parametreType':parametreType        
     }               
   )
   
   output = template.render(variables)
   return HttpResponse(output)
    
def tco_parametres_edit(request,tco_id,parametre_id):
   section = 'parameter'
   
   response = before_execute_view(request,section)
   if not response == True:
        return response
    
   template = get_template('pages/tco/tco_parametres_edit.html');
   parametre = Parametre.objects.get(pk=parametre_id)
   cfg = template_config(request)
   
   cfg.current_url = '/tco/'
   cfg.section = 'tco'
   success = 0
   
   parametreType = parametre.parametreType
   
   if request.method == 'POST':
        if request.POST.get('action') == 'Annuler':
            return HttpResponseRedirect( base_url + 'tco/' + tco_id + '/parameters')
        form = ParametreForm(request.POST)
        if form.is_valid():
            
            parametreType = request.REQUEST['parametreType']
            
            parametre = form.save(commit=False)
            parametre.tco = Tco.objects.get(pk=tco_id)
            parametre.id = parametre_id
            parametre.parametreType = parametreType
            parametre.save()
            
            success = 1
        else:
            success = 0
   else:
        form = ParametreForm(instance=parametre)

   variables = RequestContext( request, 
     {
        'username' : 'patrice',
        'form' : form,
        'cfg': cfg,
        'success' : success,
        'tco_id': tco_id,
        'parametreType':parametreType      
     }               
           
                    
   )
   
   
   output = template.render(variables)
   return HttpResponse(output)    
    
def tco_parametres_delete(request,tco_id,parametre_id):
   section = 'parameter'
   
   response = before_execute_view(request,section)
   if not response == True:
        return response
    
   template = get_template('pages/tco/tco_parametres_delete.html')
   cfg = template_config(request)
   cfg.current_url = '/tco/'
   section = ''
   cfg.section = 'tco'
   success = 0
   
   if request.method == 'POST':
       if request.POST.get('action') == 'Annuler':
            return HttpResponseRedirect( base_url + 'tco/' + tco_id + '/parameters')
        
       
       if request.POST.get('action','') == 'delete':
            try:
                parametre = Parametre.objects.get(pk=parametre_id)
                parametre.delete()
                success = 1
            except Parametre.DoesNotExist:
                success = 0
            
       deleteForm = DeleteForm( request.POST )
            
   else:
        deleteForm = DeleteForm( { 'action':'delete','tco_id': tco_id }  )
       
   variables = RequestContext(request, 
     {
        'username' : 'patrice',
        'form' : deleteForm,
        'lst_tco' : lst_tco,
        'cfg': cfg,
        'tco_id': tco_id,
        'parametre_id':parametre_id,
        'request':request,
        'success':success
     }                  
                    
   )
   
   output = template.render(variables);
   return HttpResponse(output) 


def tco_move(request,tco_id,direction):
   section = 'tco'
   
   response = before_execute_view(request,section)
   if not response == True:
        return response
    
   output = ""
   
   tco = Tco.objects.get(pk=tco_id)
   
   sql = "SELECT * FROM "+table_tco+" WHERE parent_tco_id = "+str(tco.parent_tco_id)+" ORDER BY niveau"
   lst_brothers = list(Tco.objects.raw(sql))
   if len(lst_brothers) > 1:
       found = False
       current = -1
       id_to_switch = -1
       for tco_brother in lst_brothers:
           if found == True and direction == 'down':
               id_to_switch = tco_brother.id
               break
           
           if tco_brother.id == tco.id:
               found = True
               if direction == 'up':
                   id_to_switch = current
                   break
               
           current = tco_brother.id
       
       if id_to_switch > -1:
           obj_tco_switch = Tco.objects.get(pk=id_to_switch)
           cursor = connection.cursor()
           
           if direction == 'up':
               sql = "UPDATE "+table_tco+" SET niveau = niveau -1 WHERE id = "+ str(tco.id)
               cursor.execute(sql)
               transaction.commit_unless_managed
               
               sql = "UPDATE "+table_tco+" SET niveau = niveau +1 WHERE id = "+ str(id_to_switch)
               cursor.execute(sql)
               transaction.commit_unless_managed
               
           if direction == 'down':
               sql = "UPDATE "+table_tco+" SET niveau = niveau +1 WHERE id = "+ str(tco.id)
               cursor.execute(sql)
               transaction.commit_unless_managed
               
               sql = "UPDATE "+table_tco+" SET niveau = niveau -1 WHERE id = "+ str(id_to_switch)
               cursor.execute(sql)
               transaction.commit_unless_managed
    

   return HttpResponseRedirect( base_url + 'tco/') 
   
   
def tco_move_under(request,tco_id):
   section = 'tco'
   
   response = before_execute_view(request,section)
   if not response == True:
        return response
    
   template = get_template('pages/tco/tco_moveunder.html')
   cfg = template_config(request)
   cfg.current_url = '/tco/'
   section = ''
   cfg.section = 'tco'
   success = 0
   
   if request.method == 'POST':
       if request.POST.get('action') == 'Annuler':
            return HttpResponseRedirect( base_url + 'tco/')
        
       moveForm = TcoFormMoveUnder( request.POST )
       
       if moveForm.is_valid():
            try:
                tco_id = moveForm.cleaned_data['tco_id']
                parent_tco_id = moveForm.cleaned_data['parent_tco_id']
                
                tco = Tco.objects.get(pk=tco_id)
                tco.parent_tco_id = parent_tco_id
                
                tco.save()
                success = 1
                
            except Tco.DoesNotExist:
                success = 0
   else:
        moveForm = TcoFormMoveUnder( { 'tco_id': tco_id, 'parent_tco_id' : -1 }  )
       
   variables = RequestContext(request, 
     {
        'username' : 'patrice',
        'form' : moveForm,
        'cfg': cfg,
        'tco_id': tco_id,
        'request':request,
        'success': success
     }                  
                    
   )
   
   output = template.render(variables);
   return HttpResponse(output) 
   
   
def ajax_tco_lst(request):
   section = 'tco' 
    
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
   cfg.scenario_id = 0
   cfg.profil_id = 0
   
   variables = RequestContext( request, 
     {
        'username' : 'patrice',
        'lst_tco' : lst_tco,
        'cfg': cfg,
        'list':list,
         'scenario_id' : 0,
         'profil_id' : 0,
        'tree_lst_tco':tree_lst_tco
     }                  
                    
   )
   
   output = template.render(variables)
   return HttpResponse(output)
    
