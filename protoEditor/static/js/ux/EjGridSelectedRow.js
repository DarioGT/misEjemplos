Ext.override(Ext.grid.Panel, {
 // Returns row index of selected record or -1 if there is
 // no selection. To use call method like this:
 // var idx = grid.getSelectedRowIndex();
getSelectedRowIndex :  function(){
	var r, s;
		r = this.getView().getSelectionModel().getSelection();
		s = this.getStore();
		return s.indexOf(r[0]);

},
// Returns currently selected record in a grid or -1 if there
// is no selected record. To use call method like this:
// var record = grid.getSelectedRecord();
getSelectedRecord : function(){
	var r;
	if(this.getView().getSelectionModel().hasSelection()){
		var r = this.getView().getSelectionModel().getSelection();
		return r[0];
	} else {
		return -1;
	}
},
// Returns currently selected record as a parameter string which
// will allow you to pass the row using an ajax call. If there is
// no slection this will return -1. To use call like this:
// var params = grid.getSelectedRecordAsParameters();
getSelectedRecordAsParameters : function(){
	var r, params;
	if(this.getView().getSelectionModel().hasSelection()){
		r = this.getView().getSelectionModel().getSelection();
		params = '?1=1';
		for (value in r[0].data){
			params = params + '&' + value + '=' + r[0].get(value);
		}
	 } else {
		params = -1;
	 }
		return params;
}
});


// ----------------------------------------------------------------------------------------------
// Set Selected Row 
//----------------------------------------------------------------------------------------------

var grid = Ext.create('Ext.grid.Panel', {
    store: store,
    stateful: true,
    stateId: 'stateGrid',
    
    
    bbar: [
        { xtype: 'button', text: 'Click me to select first row', handler: function(){
        grid.getSelectionModel().select(0);
        } }
],
  
http://jsfiddle.net/molecule/2BhfY/3/
    
    
