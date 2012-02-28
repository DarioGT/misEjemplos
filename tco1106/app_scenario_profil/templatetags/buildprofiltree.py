from django import template
from tco.app_admin.template_config import *

register = template.Library()

base_url = site_config('base_url')
#from templates.tags import *

#def buildtcotree_recursive(tree,niveau):
    
optionProfil = '''
            <div style="float:right;" class='option'>
                <table border="0" cellspacing="0" cellpadding="0" align="right">
                    <tr>
                        <td width="170" align="right">
                            <table border="0" cellspacing="0" cellpadding="0" align="right">
                                <tr>
                                    <td width="10">
                                        &nbsp;&nbsp;
                                    </td>
                                    <td width="70" align="left">
                                        %nombre_occurence%
                                    </td>
                                    <td width="10">
                                        &nbsp;&nbsp;
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td>
                            <table border="0" cellspacing="0" cellpadding="0" align="right">
                                <tr>
                                    <td width="30" align="center">
                                        <a href="%url%/addScenario">
                                            <img src="%base_url%images/add.gif" width="16" height="16" alt="Ajouter un enfant" title="Ajouter un sc&eacute;nario" />
                                        </a>
                                    </td>
                                    <td width="30" align="center">
                                        <a href="%url%/edit_profil">
                                            <img src="%base_url%stylesheets/images/edit-icon.gif" width="16" height="16"  alt="Modifier" title="Modifie le Profilr" />
                                        </a>
                                    </td>
                                    <td width="30" align="center">
                                        <a href="%url%/delete_profil">
                                            <img src="%base_url%images/delete.gif" width="16" height="16" alt="Supprimer" title="Supprimer le Profil" />
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </div>    

         '''
         
         
optionScenario = '''
            <div style="float:right"; class='option'>
                    <table border="0" cellspacing="0" cellpadding="0" align="right">
                    <tr>
                        <td width="170" align="right">
                            <table border="0" cellspacing="0" cellpadding="0" align="right">
                                <tr>
                                    <td width="80" align="center">
                                        %scenario_type%
                                    </td>
                                    <td width="10">
                                        &nbsp;&nbsp;
                                    </td>
                                    <td width="70" align="left">
                                        %nombre_occurence%
                                    </td>
                                    <td width="10">
                                        &nbsp;&nbsp;
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td>
                            <table border="0" cellspacing="0" cellpadding="0" align="right">
                                <tr>
                                    <td width="30" align="center">
                                        <a href="%base_url%profil_scenario/%profil_id%/scenario/%scenario_id%/mesures">
                                            <img width="16" height="16" border="0" title="Voir les mesures" alt="Voir les mesures" src="%base_url%images/zoom.gif"/>
                                        </a>
                                    </td>
                                    <td width="30" align="center">
                                        <a href="%url%/edit_scenario">
                                            <img src="%base_url%stylesheets/images/edit-icon.gif" width="16" height="16"  alt="Modifier" title="Modifier le sc&eacute;nario" />
                                        </a>
                                    </td>
                                    <td width="30" align="center">
                                        <a href="%url%/delete_scenario">
                                            <img src="%base_url%images/delete.gif" width="16" height="16" alt="Supprimer" title="Supprimer le sc&eacute;nario" />
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </div>    

         '''
tplRow =      '''
                <li class="niveau-%niveau%" style="float:left; display:block;">
                    <div class="title">
                        <div style="float:left;">
                            <span class="%classRow%">%link%</span>
                        </div>
                        <div style="float:right;">
                            %option%
                        </div>
                    </div>
                    %childs%
                </li>
              '''    
def buildprofiltree_recursive(tree,profil_id,niveau):
    output = '<ul>'
    url = '%base_url%profil_scenario/%id%'
    
    for scenario in tree:
        
        classRow = "scenario"
        
        link = "<a href='%base_url%profil_scenario/%id%/edit_scenario' title=''>"  + scenario.nom + '</a>'
        
        tpl = tplRow
        tpl = tpl.replace('%classRow%',classRow)
        tpl = tpl.replace('%link%',link)
        tpl = tpl.replace('%option%',optionScenario)
        tpl = tpl.replace('%niveau%',str(niveau))
        
        tpl = tpl.replace('%url%',url)
        
        
        tpl = tpl.replace('%base_url%',base_url)
        tpl = tpl.replace('%id%',str(scenario.id))
        
        tpl = tpl.replace('%profil_id%',str(profil_id))
        tpl = tpl.replace('%scenario_id%',str(scenario.id))
        
        scenarioType = ''
        if scenario.scenarioType == 'L':
            scenarioType = 'Libre'
        elif scenario.scenarioType == 'P':
            scenarioType = 'Propri&eacute;taire'
        elif scenario.scenarioType == 'M':
            scenarioType = 'Mixte'
            
            
        
        
        tpl = tpl.replace('%scenario_type%',scenarioType)
        tpl = tpl.replace('%nombre_occurence%',str(scenario.nombreOccurence))
        
        tpl = tpl.replace('%childs%','')    
        output = output + tpl
        
         
    return output + '</ul>'       
        
    
    

def buildprofiltree(tree):
    output = '<ul id="example" class="filetree">'
    niveau = 0
    
    for profil in tree:
        classRow = "profil"
        
        child_output = ''
        link = "<a href='%base_url%profil_scenario/%id%/edit_profil'>" + profil.nomProfil + '</a>'
                    
        if len(profil.childs) > 0:
            child_output =  buildprofiltree_recursive(profil.childs,profil.id,2)
            link = "<a href='%base_url%profil_scenario/%id%/edit_profil' title='Regroupement de -"+str(len(profil.childs))+" Sc&eacute;nario(s)'>" + profil.nomProfil + '</a>'
        

        tpl = tplRow
        tpl = tpl.replace('%classRow%',classRow)
        tpl = tpl.replace('%link%',link)
        tpl = tpl.replace('%option%',optionProfil)
        
        tpl = tpl.replace('%url%', base_url + 'profil_scenario/' + str(profil.id)  )
        tpl = tpl.replace('%niveau%',str(1))
        tpl = tpl.replace('%id%',str(profil.id))
        tpl = tpl.replace('%childs%',child_output)
        tpl = tpl.replace('%nombre_occurence%',str(profil.nombreOccurence))
                                                       
        output = output + tpl
            
    
    #output = output + "</ul>"
    
    output = output.replace('%base_url%',base_url)
    
    return output


def transformtohiddenfield(field):
    output = field
    return str(output).replace('text','hidden')
    

def printtcoformrow(form,field,label):
    output = '''
                <tr>
                    <td width="100" align="right">
                        %label%
                    </td>
                    <td width="10" align="center">
                    :
                    </td>
                    <td width="100" align="right">
                        %field%
                    </td>
                    <td width="100" align="right">
                        %error%
                    </td>
                </tr>
             '''
    output = output.replace('%label%',str(label))
    output = output.replace('%field%',str(field))
    output = output.replace('%error%','')
    
    return output
    

def printtcoform(form,el):
    output = ''
    hiddenField = ['niveau','parent_tco_id']
    #output = output + transformtohiddenfield(str(form['niveau'])) + transformtohiddenfield( str(form['parent_tco_id']))
    for field in form:
        if field.name not in hiddenField:
            output = output + printtcoformrow(form,field,'')
        else:
            output + transformtohiddenfield(str(form[field.name]))
        
    return output
    

def transFr(key):
    translate_into_german = gettext.translation('django', 'locale', ['fr'], fallback=True).ugettext
    return translate_into_german(key)

    
    

register.simple_tag(transformtohiddenfield)
    
register.simple_tag(buildprofiltree)

register.simple_tag(printtcoform)

register.simple_tag(transFr)
