define(['app', 'lib/backbone', 'lib/underscore'], function(app){

	app.Views.contentArea = Backbone.View.extend({
		el: '#content_area',
		
		initialize : function(){
			this.tp_friendInfo = _.template($('#tp_friendInfo').html());
			this.tp_drawing = _.template($('#tp_drawingBench').html());
			
			app.collections.discussions.on('started', this.startDiscussion, this);
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
			this.$el.empty().append(content);
		
		},
		
		startDiscussion: function(discuss){
			/* On génère le contenu grâce à la template */
			var content = $(this.tp_drawing());
			
			/* On affiche l'espace de dessin */
			this.$el.empty().append(content);
			
			console.log(discuss);
		}
	});
});