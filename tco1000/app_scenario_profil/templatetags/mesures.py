from django import template
from tco.app_admin.template_config import *

register = template.Library()

base_url = site_config('base_url')
#from templates.tags import *

#def buildtcotree_recursive(tree,niveau):
    
option = '''
            <div style="float:right; class='option'>
                <table border="0" cellspacing="0" cellpadding="0" align="right">
                    <tr>
                        <td width="30" align="center">
                            <a href="%base_url%tco/%tco_id%/addFromParent/%tco_id%">
                                TOTAL TCO
                            </a>
                        </td>

                        <td width="30" align="center">
                            <a href="%base_url%profil_scenario/%profil_id%/scenario/%scenario_id%/mesures_tco/%tco_id%/mesures">    
                            <img src="/images/zoom.gif" border="0" width="16" height="16"  alt="Voir les mesures" title="Voir les mesures" />
                            </a>
                        </td>
                    </tr>
                </table>
            </div>    

         '''
tplRow =      '''
                <li class="niveau-popup-%niveau%" style="float:left; display:block;">
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
def buildtcotree_recursive(tree,parent_tco_id,niveau):
    output = '<ul>'
    #niveau = 0
    
    for tco in tree:
        
        classRow = "file"
        if len(tco.childs) > 0:
            classRow = "folder"
        
        child_output = ''
        link = "<a href='javascript:tcoSelected(%tco_id%);' title=''>"  + tco.titre + '</a>'
        
        if len(tco.childs) > 0:
            child_niveau = niveau + 1
            child_output =  buildtcotree_recursive(tco.childs,tco.id, child_niveau)
            link = "<a href='javascript:tcoSelected(%tco_id%);' title='Regroupement de -"+str(len(tco.childs))+" TCO'>"   + tco.titre + '</a>'
        
        tpl = tplRow
        tpl = tpl.replace('%classRow%',classRow)
        tpl = tpl.replace('%link%',link)
        tpl = tpl.replace('%option%','')
        tpl = tpl.replace('%niveau%',str(niveau))
        
        
        tpl = tpl.replace('%tco_id%',str(tco.id))
        tpl = tpl.replace('%parent_tco_id%',str(-1))
        tpl = tpl.replace('%childs%',child_output)
            
        output = output + tpl
        
         
    return output + '</ul>'       
        
    
    

def buildtcotree(cfg):
    tree = cfg.tree
    
    output = '<ul id="example" class="filetree">'
    niveau = 0
    
    for tco in tree:
        classRow = "file"
        if len(tco.childs) > 0:
            classRow = "folder"
        
        child_output = ''
        link = "<a href='javascript:tcoSelected(%tco_id%);' title=''>" + tco.titre + '</a>'
        if len(tco.childs) > 0:
            child_output =  buildtcotree_recursive(tco.childs,tco.id,2)
            link = "<a href='javascript:tcoSelected(%tco_id%);' title='Regroupement de -"+str(len(tco.childs))+" TCO'>" + tco.titre + '</a>'
        
        tpl = tplRow
        tpl = tpl.replace('%classRow%',classRow)
        tpl = tpl.replace('%link%',link)
        tpl = tpl.replace('%option%','')
        
        tpl = tpl.replace('%niveau%',str(1))
        tpl = tpl.replace('%tco_id%',str(tco.id))
        tpl = tpl.replace('%parent_tco_id%',str(-1))
        tpl = tpl.replace('%profil_id%',str(cfg.profil_id))
        tpl = tpl.replace('%scenario_id%',str(cfg.scenario_id))
        
        tpl = tpl.replace('%childs%',child_output)
            
        output = output + tpl
            
    
    #output = output + "</ul>"
    
    output = output.replace('%base_url%',base_url)
    output = output.replace('%profil_id%',str(cfg.profil_id))
    output = output.replace('%scenario_id%',str(cfg.scenario_id))
    
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
    
register.simple_tag(buildtcotree)

register.simple_tag(printtcoform)

register.simple_tag(transFr)
