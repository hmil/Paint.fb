define(['app', 'lib/backbone', 'lib/underscore'], function(app){

	app.Views.discussions = Backbone.View.extend({
		el: '#discussions',
		
		initialize : function(){
			
			this.label = _.template($('#tp_conferenceLabel').html());
			this.list = this.$('#discussionsList');
			
			app.collections.discussions.on('add', this.startDiscussion, this)
										.on('selected', this.selectDiscussion, this)
										.on('remove', this.removeDiscussion, this);
		},
		
		startDiscussion: function(discuss){
			var _this = this;
			
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
			
			var content = $(this.label({name: name, id: discuss.cid}))
			.click(function(){
				_this.selectLabel($(this));
				//On demande à la contentArea d'afficher la discussion courante
				//On profite de la closure pour utiliser discuss
				app.views.contentArea.switchDiscussion(discuss);
			})
			.mouseenter(function(){
				$(this).children('.conferenceLabel_close').show();
			})
			.mouseleave(function(){
				if(!$(this).hasClass('active'))
					$(this).children('.conferenceLabel_close').hide();
			});
			
			//Comportement du bouton de fermeture
			content.children('.conferenceLabel_close')
				.click(function(e){
					e.stopPropagation();
					discuss.destroy({model: discuss});					
				});
			
			//On ajoute le label à la liste
			this.list.append(content);
			//Puis on le sélectionne
			this.selectLabel(content);
			
			//On enregistre le label dans la discussion pour pouvoir s'en servir plus tard
			discuss.set('label', content);
			
			//Comme on a modifié la taille du submenu, on demande au menu de recalculer les tailles
			app.views.menu.resize();
		},
		
		selectDiscussion: function(discuss){	
			this.selectLabel(discuss.get('label'));
		},
		
		selectLabel: function(label){
			label.parent().children('li').removeClass('active').children('.conferenceLabel_close').hide();
			label.addClass('active').children('.conferenceLabel_close').show();
		},
		
		removeDiscussion: function(foo, bar, options){
			this.$('[data-id="'+options.model.cid+'"]').remove();
		}
		
	});
});