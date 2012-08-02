define(['app', 'lib/backbone', 'lib/underscore', 'models/DrawingProperties', 'collections/tools'], function(app){

	/* Modèle contenant toutes les données nécessaires au dessin : 
		sessions en cours, outils (+ outil sélectionné), canvas, buffer, ...
	*/
	app.Models.Drawing = Backbone.Model.extend({
		defaults: {
			properties: new app.Models.DrawingProperties(),
			tools: new app.Collections.Tools(),
			canvasHeight: 0,
			canvasWidth: 0
		},
		
		initialize: function(){
			this.set('tool', this.get('tools').first());
			
			this.get('tools').each(function(tool){
				tool.env = this;
			}, this);
			
			this.discuss = false;
		},
		
		clearBuf: function(){
			this.get('buffer').clearRect(0,0, this.get('canvasWidth'), this.get('canvasHeight'));
		},
		
		sendAction: function(action){
			this.discuss.createAction(action);
		}
	
	});

});