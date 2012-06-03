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
			//Définition des éléments et templates
			this.friendslist = this.$('#friendslist');
			this.friendLabel = _.template($('#friendslist_label').html());
			this.friendFilter = this.$('#friendslist_search');
			
			var _this = this;
			
			/** Evenements de l'interface utilisateur **/
			
			//Clic sur le bouton de rafrîchissement
			this.$('#friendslist_refresh').click(function(){
				//On désactive le bouton le temps du rafraichissement
				var btn = $(this);
				btn.attr('disabled', true);
				
				app.models.facebook.refreshFriendsList(function(){
					btn.removeAttr('disabled');
				});
			});
			
			//Modification du champ de recherche
			this.friendFilter.keyup(function(){
				_this.update_friends_list(app.models.facebook.get('friendsList'));
			});
			
			/** Evenements des modèles **/
			
			//Lorsque l'utilisateur se connecte
			app.models.facebook.on('login', function(){
				//Rafraichit la liste maintenant
				app.models.facebook.refreshFriendsList();
				
				//Ordonne de rafraichir la liste toutes les 30 secondes
				window.setInterval(function(){app.models.facebook.refreshFriendsList();}, 60000);
				
			})
			//Lorsque la liste d'amis est mise à jour
			.on('friendsListRefreshed', function(list){
				_this.update_friends_list(list);
			});
		
		},
		
		update_friends_list: function(rawList){
		
			//On applique le filtre de recherche
			var filter = this.friendFilter.val();
			
			var list = new Array();
			
			list.active = _.filter(rawList.active, function(elem){
				if(elem.name.substr(0, filter.length).toLowerCase() == filter.toLowerCase()){
					return true;
				}
				return false;
			});
			
			//On vide la liste
			this.friendslist.children('li[class!="nav-header"]').remove();
			
			//On prépare le nouveau contenu
			var content = $(this.friendLabel(list));
			//Comportement des liens
			content.children('a').click(function(){
				$(this).parent().parent().children('li').removeClass('active');
				$(this).parent().addClass('active');
			});
			
			//Ajout du contenu dans la liste
			this.friendslist.append(content);
		}

	});
});