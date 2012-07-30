define(['app', 'lib/backbone', 'lib/underscore'], function(app){

	app.Views.contentArea = Backbone.View.extend({
		el: '#content_area',
		
		initialize : function(){
			this.tp_friendInfo = _.template($('#tp_friendInfo').html());
			
			app.collections.discussions	.on('add', this.switchDiscussion, this)
										.on('selected', this.switchDiscussion, this)
										.on('remove', this.removeDiscussion, this);
		},
		
		showFriendInfo : function(friend){
			//On enferme la variable this
			var _this = this;
			
			/* On génère le contenu grâce à la template */
			var content = $(this.tp_friendInfo(friend));
			
			/* On applique la logique de la frame */
			content.find('#start-convers-button').click(function(){
				app.collections.discussions.startWithFriend(friend); 
			});
			content.find('#addto-convers-button').click(function(){
				console.log('comming soon');
			});
			
			/* Et on l'affiche */
			this.$el.children().detach();
			this.$el.empty().append(content);
		
		},
		
		switchDiscussion: function(discuss){
			/* On affiche l'espace de dessin */
			this.$el.children().detach();
			this.$el.empty().append(app.views.drawingBench.getBench(discuss));
			
			// On ajuste la taille de l'espace de travail maintenant qu'il est affiché.
			// NB : cela n'est utile qu'au premier affichage
			app.views.drawingBench.adjustSize();
		},
		
		removeDiscussion: function(foo, bar, options){
			if(options.model == app.views.drawingBench.discuss){
				var next = app.collections.discussions.first();
				if(next)
					app.collections.discussions.startWithId(next.get('id'));
				else
					this.$el.children().detach();
			}
		},
		
		resize: function(size){
			this.$el.width(size);
			
			this.trigger('resized', size);
		}
		
		
	});
});