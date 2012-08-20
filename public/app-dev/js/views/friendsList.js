define(['app', 'lib/backbone', 'lib/underscore'], function(app){

	app.Views.friendsList = Backbone.View.extend({
		el: '#friends',
		
		initialize : function(){
			//Définition des éléments et templates
			this.list = this.$('#friendslist');
			this.filter = this.$('#friendslist_search');
			
			this.template = _.template($('#tp_friendsList').html());
			
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
			this.filter.keyup(function(){
				_this.update(app.models.facebook.get('friendsList'));
			});
			
			/** Evenements des modèles **/
			
			//Lorsque l'utilisateur se connecte
			app.models.facebook.on('login', function(){
				//Rafraichit la liste maintenant
				app.models.facebook.refreshFriendsList();
				
				//Ordonne de rafraichir la liste toutes les 30 secondes
				window.setInterval(function(){app.models.facebook.refreshFriendsList();}, 60000);
				
				//On en profite pour redimentionner la liste
				_this.resize();
			})
			//Lorsque la liste d'amis est mise à jour
			.on('friendsListRefreshed', function(list){
				_this.update(list);
			});
		},
		
		resize: function(){
			this.$('#friendsViewport').height($(window).height() - $('#friendsViewport').offset().top);
		},
		
		update: function(list){
			var _this = this;
			
			//Copie du filtre de recherche
			var filter = this.filter.val();
			
			//On applique le filtre et prépare la liste en même temps
			list = _.groupBy(
				_.filter(list, function(elem){
					if(elem.name.substr(0, filter.length).toLowerCase() == filter.toLowerCase()){
						return true;
					}
					return false;
				})
			, 'online_presence');
			
			//On vide la liste
			this.list.empty();
			
			//On prépare le nouveau contenu
			var content = $(this.template({list: list}));
			//Comportement des liens
			content.children('.friendLabel').click(function(){
				$(this).parent().parent().children('li').removeClass('active');
				$(this).parent().addClass('active');
				
				_this.trigger('selected', $(this).attr('data-uid'));
				
				app.views.contentArea.showFriendInfo(app.models.facebook.getFriend($(this).attr('data-uid')));
			});
			
			//Ajout du contenu dans la liste
			this.list.append(content);
		},
		
		unselect: function(){
			this.$('.active').removeClass('active');
		}
	});
});