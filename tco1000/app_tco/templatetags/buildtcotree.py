from django import template
from tco.app_admin.template_config import *

register = template.Library()

base_url = site_config('base_url')
#from templates.tags import *

#def buildtcotree_recursive(tree,niveau):
    
option = '''
            <div style="float:right;" class='option'>
                <table border="0" cellspacing="0" cellpadding="0" align="right">
                    <tr>
                        <td width="20" align="center">
                            <a href="%base_url%tco/%tco_id%/addFromParent/%tco_id%">
                                <img src="%base_url%images/add.gif" width="16" height="16" alt="Ajouter un enfant" title="Ajouter un &eacute;l&eacute;ment en dessous" />
                            </a>
                        </td>
                        <td width="20" align="center">
                            <a href="%base_url%tco/%tco_id%/edit">
                                <img src="%base_url%stylesheets/images/edit-icon.gif" width="16" height="16"  alt="Modifier" title="Modifier" />
                            </a>
                        </td>
                        <td width="20" align="center">
                            <a href="%base_url%tco/%tco_id%/delete">
                                <img src="%base_url%images/delete.gif" width="16" height="16" alt="Supprimer" title="Supprimer" />
                            </a>
                        </td>
                        <td width="20" align="center">
                            <a href="%base_url%tco/%tco_id%/parameters">    
                            <img src="%base_url%images/zoom.gif" border="0" width="16" height="16"  alt="Voir les param&egrave;tres" title="Voir les param&egrave;tres" />
                            </a>
                        </td>
                        <td width="60" align="center">
                            <a href="%base_url%tco/%tco_id%/move/up">
                                <img src="%base_url%images/up.gif" width="16" height="16" alt="Monter d'un niveau" title="Monter d'un niveau" />
                            </a>
                            <a href="%base_url%tco/%tco_id%/move/down">
                                <img src="%base_url%images/down.gif" width="16" height="16" title="Descendre d'un niveau" alt="Descendre d'un niveau" />
                            </a>
                            <a href="%base_url%tco/%tco_id%/move/under">
                                <img src="%base_url%images/move_under.gif" width="16" height="16" title="Deplacer le noeud" alt="Deplacer le noeud" />
                            </a>
                        </td>
                        <td>
                           <a href="%base_url%tco/%tco_id%/copy">Copier</a>
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
def buildtcotree_recursive(tree,parent_tco_id,niveau):
    output = '<ul>'
    #niveau = 0
    
    for tco in tree:
        
        classRow = "file"
        if len(tco.childs) > 0:
            classRow = "folder"
        
        child_output = ''
        link = "<a href='%base_url%tco/%tco_id%/edit' title=''>"  + tco.titre + '</a>'
        
        if len(tco.childs) > 0:
            child_niveau = niveau + 1
            child_output =  buildtcotree_recursive(tco.childs,tco.id, child_niveau)
            link = "<a href='%base_url%tco/%tco_id%/edit' title='Regroupement de -"+str(len(tco.childs))+" TCO'>"   + tco.titre + '</a>'
        
        tpl = tplRow
        tpl = tpl.replace('%classRow%',classRow)
        tpl = tpl.replace('%link%',link)
        tpl = tpl.replace('%option%',option)
        tpl = tpl.replace('%niveau%',str(niveau))
        
        
        tpl = tpl.replace('%tco_id%',str(tco.id))
        tpl = tpl.replace('%parent_tco_id%',str(-1))
        tpl = tpl.replace('%childs%',child_output)
            
        output = output + tpl
        
         
    return output + '</ul>'       
        
    
    

def buildtcotree(tree):
    output = '<ul id="example" class="filetree">'
    niveau = 0
    
    for tco in tree:
        classRow = "file"
        if len(tco.childs) > 0:
            classRow = "folder"
        
        child_output = ''
        link = "<a href='%base_url%tco/%tco_id%/edit' title=''>" + tco.titre + '</a>'
        if len(tco.childs) > 0:
            child_output =  buildtcotree_recursive(tco.childs,tco.id,2)
            link = "<a href='%base_url%tco/%tco_id%/edit' title='Regroupement de -"+str(len(tco.childs))+" TCO'>" + tco.titre + '</a>'
        

        tpl = tplRow
        tpl = tpl.replace('%classRow%',classRow)
        tpl = tpl.replace('%link%',link)
        tpl = tpl.replace('%option%',option)
        
        tpl = tpl.replace('%niveau%',str(1))
        tpl = tpl.replace('%tco_id%',str(tco.id))
        tpl = tpl.replace('%parent_tco_id%',str(-1))
        tpl = tpl.replace('%childs%',child_output)
            
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
    
register.simple_tag(buildtcotree)

register.simple_tag(printtcoform)

register.simple_tag(transFr)
