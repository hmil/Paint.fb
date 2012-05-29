define(['app', 'lib/backbone', 'lib/underscore'], function(app){

	app.Views.menu = Backbone.View.extend({
		el: '#menu',
		
		initialize : function() {
			this.init_resize();
			
			this.init_friends_list();
		},
		
		init_resize: function(){
			var menu = this;
			var minWidth = parseInt(this.$el.css('min-width'));
			
			var onMousemove = function(evt){
				//On calcule la nouvelle largeur
				var width = $(window).width() - evt.pageX;
				if(width > minWidth){
					//On l'applique et déclenche un évènement pour permettre aux autres éléments de s'adapter
					menu.$el.width(width);
					menu.trigger('resized', width);
				}
			};
			
			var onMouseup = function(){
				$(window).unbind('mousemove', onMousemove)
				.unbind('mouseup', onMouseup);
			};
			
			this.$('#menu_resize').mousedown(function(){
				$(window).bind('mousemove', onMousemove)
				.bind('mouseup', onMouseup);
				return false;
			});
		},
		
		init_friends_list: function(){
		
			this.friendslist = this.$('#friendslist');
			this.friendLabel = _.template($('#friendsList_label').html());
			
			var _this = this;
			
			app.models.facebook.on('login', function(){
				//Rafraichit la liste maintenant
				_this.refreshFriendsList();
				
				//Ordonne de rafraichir la liste toutes les 30 secondes
				window.setInterval(function(){_this.refreshFriendsList();}, 30000);
				
			});
		
		},
		
		refreshFriendsList: function(){
			//On met à jour le modèle avant de mettre à jour la vue
			var _this = this;
			app.models.facebook.refreshFriendsList(function(list){
				if(list.active != 'undefined'){
					//On vide la liste
					_this.friendslist.children('li[id!="friendslist_search"]').remove();
					
					//On prépare le nouveau contenu
					var content = $(_this.friendLabel(list));
					//Comportement des liens
					content.children('a').click(function(){
						$(this).parent().parent().children('li').removeClass('active');
						$(this).parent().addClass('active');
					});
					
					//Ajout du contenu dans la liste
					_this.friendslist.append(content);
				}
			});
		}

	});
});