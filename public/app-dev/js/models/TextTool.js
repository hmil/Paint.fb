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
			this.buffer;
			
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
				this.cachedEvent = e;
				
				this.textHeight = e.buffer.measureText('m').width;
				
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
			
			this.cachedEvent.clearBuf();
			
			this.cachedEvent.applyStyle();
			
			this.drawString(this.cachedEvent.canvas);
		},
		
		refresh: function(){
			this.string = this.input.val();
						
			this.cachedEvent.clearBuf();
			
			this.drawString(this.cachedEvent.buffer);
		},
		
		drawCaret: function(){
		
			var buffer = this.cachedEvent.buffer;
			
			if(this.caretState == true){
				this.cachedEvent.clearBuf();
				this.drawString(buffer);
				
				this.caretState = false;
			}
			else{
				var width = buffer.measureText(this.string.substring(0, this.input.caret().start)).width;
				
				buffer.save();
				
				buffer.strokeStyle = 'black';
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
		}
		
	
	});

});