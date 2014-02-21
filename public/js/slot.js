var rolling =false;
var numberitems = 0;
var doneitems=0;
var rolls=0;
var maxroll=1;
var animation_time=2;
var	colorscheme= ["#D82900","#6e4c5a","#d15490","#a8ba42","#fc872e","#3a817d"];
var colorschemeband= ["#871600","#4F3742","#9b4070","#8a9335","#c96928","#2e635f"];
var timerPanelID;
var xhr=null;


var spinvalue;
var unities=['gramme','Kg','litre','cl','dl','ml','c.a.s','c.a.c','pincée'];




function checkxhr(){
	if(xhr!=null){
		xhr.abort();
		xhr=null;
	}
}



$(document).ready(function(){
	$.ajaxSetup ({  cache: false});
	History.Adapter.bind(window,'statechange',function(){ // Note: We are using statechange instead of popstate
        var State = History.getState(); // Note: We are using History.getState() instead of event.state
    	next=0;
    	if(State.data.recipe!=null)
    		next = State.data.recipe;
    	changeContent(next);
    });
	$(document).keydown(function(e){
		if($("input:focus,select:focus").length==0){
			if(e.which==38) 
				spin(-1);
			else if (e.which==40) 
				spin(1);
		}
	});

	$('#loginscreen> form').submit(login);


	 $.ui.autocomplete.prototype._renderItem = function( ul, item) {
        var re = new RegExp(this.term) ;
        var t = item.label.replace(re,"<span style='text-decoration:underline;'>" + this.term + "</span>");
        ul.addClass('searchAutocomplete firstcolor');
        return $( "<li ></li>" )
            .data( "item.autocomplete", item )
            .append( "<a>" + t + "</a>" )
            .appendTo( ul );
      };
 

	$('#unity_1').autocomplete({source: unities});


	$("#menu a").click(clickLink);

	$(function() {
	    function split( val ) {
	      return val.split( /,\s*/ );
	    }
	    function extractLast( term ) {
	      return split( term ).pop();
	    }	 
	    $( "#taglist" ).selectize({
	    	plugins: ['remove_button'],
			delimiter: ',',
			persist: false,
			createOnBlur: true,
			create: function(input) {
				return {
					value: input,
					text: input
				}
			},
			load: function(query, callback) {
				if (query.length<2) return callback();
				$.ajax({
					url: 'tags/list/' + encodeURIComponent(query),
					data: { key: timestamp},
					type: 'GET',
					error: function() {
						callback();
					},
					success: function(res) {
						callback(res.tags.slice());
					}
				});
			}
		});
  	});
});

function clickLink(event){
	target = event.currentTarget;
	if(target.name=="login"){
		$("#loginscreen").show( 'slide', { direction : 'up' }, 300);
	}else{
		History.pushState({recipe:target.name}, "Rata. "+target.title, target.href); 
	}
	return event.preventDefault();
}

function login(){
	log = $("#loginscreen > form #login").val();
	pwd = $("#loginscreen > form #password").val();
	$('.overlay').fadeIn('fast');
	$("#loading").fadeIn('fast');
	$.ajax({
		type: "GET",
		url: 'user/login',
		data:{login: log, password: pwd},
		dataType:'json'
	}).always(function(){
		$("#loading").fadeOut('fast');
	}).done(function(response){
		if(response.error){
			createMessageBox("Erreur", "Connexion impossible. Vérifiez votre login et votre mot de passe.")			
		}else{
			$('.overlay').fadeOut();
		}

	});
	return false;
}
function dismissLoginScreen(){
	$("#loginscreen").hide( 'slide', { direction : 'up'  }, 200);
}

function createMessageBox(title, content)
{
	$('.overlay').fadeIn('fast');
	mb = $('#messagebox');
	t= $('#messagebox >h1');
	c= $('#messagebox >p');
	if(!mb.hasClass('hidden')){
		mb.fadeOut('fast');
		mb.addClass('hidden');
	}
	t.empty();
	c.empty();
	t.append(title);
	c.append(content);
	mb.fadeIn('slow');
	mb.removeClass('hidden');
}

function dismissMessageBox(){
	mb = $('#messagebox');
	mb.fadeOut('fast');
	mb.addClass('hidden');
	$('.overlay').fadeOut('fast');
}

function luckywheel(){
	if (rolling) return;
	numberitems = $(".recipelist div").length+1;
	if(numberitems==1) return;
	rolling =true;
	cancelPanelOpening();	
	maxroll=numberitems*2+Math.floor(Math.random()*numberitems+1);
	closePanel(spinDown);
}

function changeContent (type){
	closePanel(animationLoadstart(type));
}
function animationLoadstart(type){
	currentTheme = type;
	$("#centercontainer").hide( 'slide', { direction : 'right'  }, 300, function(){
		$("#menu > ul > .selected").removeClass("selected");
		$("#loading").fadeIn();
		$('body' ).animate({ backgroundColor: colorscheme[type]}, 500,function(){
			$(".secondcolor").css({ "background-color": colorschemeband[type]});
			$(".firstcolor").css({ "background-color": colorscheme[type]});
			checkxhr();
			if(type!='0'){
				$("#connection").fadeOut(300);
				$("#searchfield").hide();
				$('#rightpanel, #uppercontainer, #lowercontainer,#wheel,#highlightcontainer').css({"visibility":'visible'});
				$("#rightpanel").css('background-image', 'url(/img/filigrane-0' + type + '.png)');
				xhr =$.ajax({ type: "GET",
					data: { key: timestamp},
					cache: true, 
					url: "/recipes/list/"+type,  
					dataType:"json"})
				.done(function(content){
					xhr=null;
					$(".recipe").remove();
					fillListRecipes(content);
					$("#menu > ul >#menu"+type).addClass("selected");
					animationLoadend();
					
				});
			}else{
				$('#rightpanel, #uppercontainer, #lowercontainer,#wheel,#highlightcontainer').css({"visibility":'hidden'});
				$('#searchfield').show();
				$(".recipe").remove();
				$("#loading").fadeOut("fast");
				$("#homecontainer").fadeIn( 300,function(){
					$("#centercontainer").show( 'slide', { direction : 'right'  }, 500);
					$("#connection").fadeIn(300);
				});

			}
		});		
	});
}

function updatecolor(){
	$(".secondcolor").css({ "background-color": colorschemeband[currentTheme]});
	$(".firstcolor").css({ "background-color": colorscheme[currentTheme]});
} 


function fillListRecipes(content){
	if(xhr!=null) return;
	var n=0;

	$.each(content, function( i, c ){
		console.log(c);
		$.each( c, function( key, val ) {
			addRecipeToList( "<div class='recipe' id='recipe_" + key + "'>" + val + "</div>" );
		});
		n++;
	});
  	if(n==0){
  		$("#highlightcontainer").append("<div class='recipe highlight' id='recipe_null'>Aucune recette.</div>");
  	}
  	requestPanelOpening(loadDetail);
}

function loadDetail(){
	content="";
	$("#recipeview").hide();
	$("#recipeedit").hide();
	recipe =  $("#highlightcontainer > .recipe");
	if(recipe === undefined) return;
	id = recipe.attr('id').replace("recipe_", "").replace(/ /g,'');
	if(id=="null"){
		$("#rightpanel > #continer").append("<h1>Ajouter ma première recette.</h1>");
	}else{
		$('#loadingrecipe').fadeIn('fast');
		url = "/recipes/detail/"+id;
		checkxhr();
		
		xhr =$.ajax({ type: "GET",
				data: {'key': timestamp},
				cache: true, 
				url: url,  
				dataType:"json"})
		.done(function(content){
			$('#loadingrecipe').fadeOut('slow');
			$("#rightpanel  #recipeview").css({'display':'none'});
			$("#rightpanel  #recipeview #title").text(content.title);

			var obj = jQuery.parseJSON(content.text);
			$('#recipeview select').val(content.person);
			$('#recipeview #person #default').text(content.person);
			ilist = $("#rightpanel  #recipeview #ingredientlist");
			ilist.empty();
			obj.ingredient.forEach(function(entry){
				s='';
				if(entry.quantity>1 && entry.unity!='') s='s';
				li ="<li> "+ 
						"<span class='name'>"+entry.name+"</span>"+
						"<span class='unity'>"+entry.unity+s+"</span>"+
				        "<span class='quantity' data-default='"+entry.quantity+"'>"+entry.quantity+"</span>"+
				    "</li>";

				ilist.append(li);
			});

			slist = $("#rightpanel  #recipeview #steplist");
			slist.empty();
			obj.step.forEach(function(entry){
				li ="<li>"+entry.detail+"</li>";
				slist.append(li);
			});
			$("#rightpanel  #recipeview").fadeIn('slow');
		});
	}
}

function animationLoadend(){
	$("#loading").fadeOut("fast");
	requestPanelOpening();
	$("#centercontainer").show( 'slide', { direction : 'right'  }, 500);
}

function addRecipeToList(r,first){
	if(typeof(first)==='undefined') first=false;
	var n= $(".recipelist div").length+$("#highlightcontainer > .recipe").length;
	var nup = $("#upperlist > .recipe").length;
	recipe =$("#highlightcontainer > .recipe").length;
	if(first){
		if(n==0){
			
		}else if(nup<3){
			l = $("#highlightcontainer > .recipe").remove();
			if(recipe>0)		 
			$("#upperlist").prepend(l);
		}else{
			l = $("#highlightcontainer > .recipe").remove();	
			if(recipe>0)		 
			$("#lowerlist").prepend(l);
		}
		$("#highlightcontainer").append(r);
	}else{
		if(n==0){
			$("#highlightcontainer").append(r);
		}else if(nup<3){
			$("#upperlist").append(r);
		}else{
			$("#lowerlist").append(r);
		}
	}
}


function newRecipe(){
	closePanel(showEdit);
}

function showEdit(){
	$('#recipeview').hide();
	clearform();
	$('#recipeedit').show();
	openPanel();
}

function clearform(){
	$("#ingredientcontainer").find(".ingredientitem:gt(0)").remove();
	$("#stepcontainer").find(".step:gt(0)").remove();
	$('input[type=text], textarea', '#recipeedit').val("");
}



function addRecipeStep(){
	i=$('.step').length+1;
	t = $("<li id='step_"+i+"' class='step'><span class='grab'></span></li>");
	t.append("<div class='delete clickable'><a href='#' onclick='deleteStep("+i+");return false;'> <img src='/img/delete.png' /></a></a></div>");
	t.append("<div class='content'><textarea wrap='hard' rows=2 class='firstcolor' name='content_"+i
	 	+"' onkeyup='(Math.max(this.value.split(\"\n\").length,2)||2);' placeholder='Nouvelle étape'></textarea></div>");
	t.hide();
	t.append("<div id='addstep' class='clickable'><a href='#'  onclick='addRecipeStep();return false;'><img src='/img/add.png' /></a></div>");
	t.appendTo($('#stepcontainer'));
	updatecolor();
	container =$("#stepcontainer");
	container.animate({scrollTop: container.height()}, 300);
	t.fadeIn('slow');
	$("#step_"+i+" textarea").focus();
}

function addIngredient(){
	i=$('.ingredientitem').length+1;
	t = $("<li id='ingredient_"+i+"' class='ingredientitem'></li>");
	t.append("<div class='delete clickable'><a href='#' onclick='deleteIngredient("+i+");return false;'> <img src='/img/delete.png' /></a></a></div>");
	t.append("<div class='inputs'>"+
				"<input type='text' name='ingredient_"+i+"' id='ingredient_"+i+"' class='ingredient firstcolor' placeholder='Ingrédient'/>"+
				"<input type='text' name='quantity_"+i+"' id='quantity_"+i+"' maxlength='5' size='5' class='quantity firstcolor' placeholder='Qté' />"+
				"<input type='text' name='unity_"+i+"' id='unity_"+i+"' class='unity firstcolor' placeholder='Unité' />"+
				"</div>");
	t.hide();
	t.append("<div id='addstep' class='clickable'><a href='#'  onclick='addIngredient();return false;'><img src='/img/add.png' /></a></div>");
	t.appendTo($('#ingredientcontainer'));
	updatecolor();
	container =$("#ingredientcontainer");
	$('#unity_'+i).autocomplete({source: unities});
	container.animate({scrollTop: container.height()}, 300);
	t.fadeIn('slow',function(){
		$(".ingredient", this).focus();
	});
	
}



function deleteStep(step){
	$('#step_'+step).hide( 'slide', { direction : 'right'  }, 400, function(){
		this.remove();
	});
}


function deleteIngredient(ing){
	$('#ingredient_'+ing).hide( 'slide', { direction : 'right'  }, 400, function(){
		this.remove();
	});
}

function buildRecipe(){
	//title
	title=$('#recipeedit #title').val();
	if(title==0){
		createMessageBox("Erreur","Votre recette doit avoir un titre.");
		return;
	}
	//types
	types={ 'isAppetizer' : true,
		 	'isStarter' :true,
		 	'isCourse' :true,
		 	'isSideCourse' :true,
		 	'isDesert' : true};
	//ingredients
	ingredients=[];
	$('.ingredientitem').each(function(){
		name= $('.ingredient',this).val();
		quantity= $('.quantity',this).val();
		unity = $('.unity',this).val();
		if(name!=''){
			ingredients.push({'name': name, 'quantity': quantity, 'unity':unity});
		}
	});
	//steps
	steps=[];
	$('.step').each(function(){
		content = $('textarea' , this).val();
		if(content!=''){
			steps.push({'detail': content});
		}
	});
	data={
		'title' : title,
		'type' : types,
		'privacy'  : '0',
		'content': {
			'ingredient': ingredients,
			'step' : steps
		}
	};
	$.ajax({
          url: "/recipes/create",
          type: "POST",
          data: {content: JSON.stringify(data) },
          dataType: "json",
          beforeSend: function(x) {
            if (x && x.overrideMimeType) {
              x.overrideMimeType("application/j-son;charset=UTF-8");
            }
          },
          success: function(result) {
 			addRecipeToList("<div class='recipe' id='recipe_" + result.id + "'>" + result.title + "</div>",true);
          	closePanel(function(){requestPanelOpening(loadDetail);});
          }
	});

}



function closePanel(callback){
	$("#homecontainer").hide( 'slide', { direction : 'right'  }, 200);
	$("#loginscreen").hide( 'slide', { direction : 'up'  }, 200);
	$("#rightpanel").hide( 'slide', { direction : 'right'  }, 300,callback);
}

function openPanel(callback){
	if(callback!==undefined) callback();

	$("#rightpanel").show( 'slide', { direction : 'right'  }, 300);
}

function requestPanelOpening(callback){
	timerPanelID = window.setTimeout(function(){openPanel(loadDetail);}, 700);
}

function cancelPanelOpening(){
	window.clearTimeout(timerPanelID);
}


function spin(delta){
	if (rolling) return;
	numberitems = $(".recipelist div").length+1;
	if(numberitems==1) return;
	rolling =true;
	cancelPanelOpening();
	if(delta<0)
		closePanel(spinUp);
	else
		closePanel(spinDown);
}



function spinDown(){	
	numberitems = $(".recipelist div").length;
	doneitems =0;
	nup = $("#upperlist > .recipe").length;
	var l = $("#upperlist > .recipe").last().clone();
	$("#highlightcontainer").prepend(l);
	if(nup>=3){
		var l = $("#lowerlist > .recipe").last().clone();
		$("#upperlist").prepend(l);
		var l = $("#highlightcontainer > .recipe").last().clone();
		$("#lowerlist").prepend(l);
		$("#lowerlist > .recipe").css({"top": "-1.2em"});
		numberitems +=4;
	}else{
		var l = $("#highlightcontainer > .recipe").last().clone();
		$("#upperlist").prepend(l);
		numberitems +=3;
	}
	var time  =  (maxroll>1)?animation_time:200;
	$("#highlightcontainer > .recipe").css({"top": "-1.2em"});
	$(".recipe").each(function(){
		$(this).animate({ "top": "+=1.2em" },time,function(){
			doneitems++;
			if(doneitems == numberitems){
				$("#lowerlist > .recipe").last().remove();				
				$("#highlightcontainer > .recipe").last().remove();
				$("#upperlist > .recipe").last().remove();
				$(".recipe").each(function(){
					$(this).css({ "top": "0em" });
				});
				speedDown();
			}
		});
	});
}


function spinUp(){
	numberitems = $(".recipelist div").length;
	doneitems =0;	
	nup = $("#upperlist > .recipe").length;
	if(nup>=3){
		var l = $("#lowerlist > .recipe").first().clone();
		$("#highlightcontainer").append(l);
			var l = $("#upperlist > .recipe").first().clone();
		$("#lowerlist").append(l);
		numberitems +=4;
	}else{
		var l = $("#upperlist > .recipe").first().clone();
		$("#highlightcontainer").append(l);
		numberitems +=3;
	}
	var l = $("#highlightcontainer > .recipe").first().clone();
	$("#upperlist").append(l);
	$("#highlightcontainer > .recipe").css({"top": "0em"});
	$("#upperlist > .recipe").css({"top": "1.2em"});
	var time  =  (maxroll>1)?animation_time:200;
	$(".recipe").each(function(){
		$(this).animate({ "top": "-=1.2em" },time,function(){
			doneitems++;
			if(doneitems == numberitems){
				$("#lowerlist > .recipe").first().remove();				
				$("#highlightcontainer > .recipe").first().remove();
				$("#upperlist > .recipe").first().remove();				
				$(".recipe").each(function(){
					$(this).css({ "top": "0em" });
				});
				speedDown();
			}
		});
	});
}
	
function computeQuantity(v){
	def = parseInt($('#person #default').text());
	ratio = v/def;
	console.log(ratio);
	$('#ingredientlist .quantity').each(function(){
		q = parseFloat($(this).data('default'));
		if(!isNaN(q))
			$(this).text(q*ratio);
	});

}



function speedDown(){
	rolls++;
	animation_time = easeInQuint(rolls, 20, 200,maxroll);
	if(rolls<maxroll){
		cancelPanelOpening();
		spinDown();
	}else{
		rolling = false;
		requestPanelOpening();
		rolls=0;
		maxroll=1;
	}
		

}
function easeInQuint(currentIteration, startValue, changeInValue, totalIterations) {
    return changeInValue * Math.pow (currentIteration / totalIterations, 5) + startValue;
}

function easeOutQuad(currentIteration, startValue, changeInValue, totalIterations) {
    return -changeInValue * (currentIteration /= totalIterations) * (currentIteration - 2) + startValue;
}