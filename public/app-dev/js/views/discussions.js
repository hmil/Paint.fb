define(['app', 'lib/backbone', 'lib/underscore'], function(app){

	app.Views.discussions = Backbone.View.extend({
		el: '#discussions',
		
		initialize : function(){
			
			this.label = _.template($('#tp_conferenceLabel').html());
			this.list = this.$('#discussionsList');
			
			app.collections.discussions.bind('started', function(discuss){
				
				/* on crée le nom de la discussion avec ceux des participants */
				//Compact supprime les valeurs nulles
				var name = _.compact(
					
					//Grâce à map, on crée un array contenant uniquement les noms
					//Et on filtre le nom de l'utilisateur courant.
					_.map(discuss.get('members'),
						function(val){
							if(val.name != app.models.facebook.get('me').name)
						return val.name;
					}))
				//Join transforme l'array en une chaine
				.join(', ');
				
				var content = $(this.label({name: name}))
				
				.click(function(){
					$(this).parent().children('li').removeClass('active');
					$(this).addClass('active');
				});
				this.list.append(content);
				
			}, this);
		}
	});
});