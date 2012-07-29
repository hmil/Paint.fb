define(['app', 'lib/backbone', 'lib/underscore', 'models/Tool', 'lib/jquery.caret'], function(app){
	
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
			
			var canvas = this.env.get('canvas');
			
			window.clearInterval(this.caretInterval);
			
			this.input.val('');
			
			this.env.clearBuf();
			
			this.updateContext(canvas);
			this.drawString(canvas);
		},
		
		refresh: function(){
			this.string = this.input.val();
						
			this.env.clearBuf();
			
			this.drawString(this.env.get('buffer'));
		},
		
		drawCaret: function(){
		
			var buffer = this.env.get('buffer');
			
			if(this.caretState == true){
				this.env.clearBuf();
				this.drawString(buffer);
				
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
		
		drawString: function(ctx){
			ctx.fillText(this.string, this.anchor.x, this.anchor.y);		
		},
		
		updateContext: function(ctx){
			var properties = this.env.get('properties');
			
			ctx.fillStyle = properties.get('color');
			ctx.strokeStyle = properties.get('color');
			ctx.lineWidth = properties.get('lineWidth');
			
			var attributes 	= 	((properties.get('italic') == true) ? 'italic ' : '')
							+	((properties.get('bold') == true) ? 'bold ' : '')
								
			ctx.font = attributes+properties.get('fontSize')+'pt '+properties.get('fontFamily');
			ctx.lineCap = 'round';
			
		}
		
	
	});

});