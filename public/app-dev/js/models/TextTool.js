define(['app', 'lib/backbone', 'lib/underscore', 'models/Tool', 'lib/jquery.caret'], function(app){
	
	var requiredProps = ['color', 'lineWidth', 'italic', 'bold', 'fontSize', 'fontFamily'];
	
	app.Models.TextTool = app.Models.Tool.extend({
		
		defaults: {
			id: 'text'
		},
		
		initialize: function(){
			var _this = this;

			this.editing = false;
			this.preventRefocus = false;
			
			this.anchor = {x: 0, y: 0};
			
			this.string = '';
			
			this.textHeight = 10;
			
			//Variable utilisée pour faire clignoter le curseur
			this.caretState = false;
			
			this.input = $('<input />')	
				.attr('type', 'text')
				.css({
					position: 'absolute',
					top: '-50px'
				})
				.appendTo('body')
				.on('focusout', function(){
					_this.stopEditing();
				})
				.on('keyup keydown', function(e){
					
					//A chaque appui de touche, le curseur peut avoir bougé. pour cette raison, on le redessine
					if(_this.caretState == false)
						_this.drawCaret();
					
					if(e.which == '13')
						_this.input.blur();
					else if(_this.input.val() != _this.string)
						_this.refresh();
				});
			
		},
		
		onMousedown: function(e){
			if(this.editing)
				this.preventRefocus = true;
		},
		
		onMouseup: function(e){	
			if(this.preventRefocus == false){
				this.input.focus();
				
				this.anchor = {x: e.x, y: e.y};
				
				this.textHeight = this.env.get('buffer').measureText('m').width;
				
				this.editing = true;
				this.caretState = false;
				
				this.refresh();
				
				var _this = this;
				
				this.caretInterval = window.setInterval(function(){_this.drawCaret();}, 300);
				this.drawCaret();
			}
			else{
				this.preventRefocus = false;
			}
		},
		
		stopEditing: function(){
			this.editing = false;
			
			window.clearInterval(this.caretInterval);
			
			this.input.val('');
			
			//On envoie une action que s'il y a du texte
			if(this.string != ''){
				this.sendAction({
					str: this.string,
					p: this.anchor,
					
					//Propriétés nécessaires pour cet outil
					properties: requiredProps
				});
			}
			else
				this.env.clearBuf();
		},
		
		refresh: function(){
			this.string = this.input.val();
						
			this.env.clearBuf();
			
			this.drawString(this.env.get('buffer'), this.string, this.anchor);
		},
		
		drawCaret: function(){
		
			var buffer = this.env.get('buffer');
			
			if(this.caretState == true){
				this.env.clearBuf();
				this.drawString(buffer, this.string, this.anchor);
				
				this.caretState = false;
			}
			else{
				var width = buffer.measureText(this.string.substring(0, this.input.caret().start)).width;
				
				buffer.save();
				
				buffer.lineWidth = 3;
				
				buffer.beginPath();
				buffer.moveTo(this.anchor.x + width, this.anchor.y);
				buffer.lineTo(this.anchor.x + width, this.anchor.y - this.textHeight);
				buffer.stroke();
				
				buffer.restore();
				
				
				this.caretState = true;
			}
		},
		
		drawString: function(ctx, string, anchor){
			ctx.fillText(string, anchor.x, anchor.y);		
		},
		
		drawAction: function(act, ctx){
			this.updateContext(ctx, act.properties);
			this.drawString(ctx, act.str, act.p);
			
			if(this.editing == false)
				this.env.clearBuf();
		},
		
		updateContext: function(ctx, properties){
			properties = this.getCleanedProperties(requiredProps, properties);
			
			ctx.fillStyle = properties.color;
			ctx.strokeStyle = properties.color;
			ctx.lineWidth = properties.lineWidth;
			
			var attributes 	= 	((properties.italic == true) ? 'italic ' : '')
							+	((properties.bold == true) ? 'bold ' : '')
								
			ctx.font = attributes+properties.fontSize+'pt '+properties.fontFamily;
			ctx.lineCap = 'round';
			
		}
		
	
	});

});