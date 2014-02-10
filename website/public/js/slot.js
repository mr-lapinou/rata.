var rolling =false;
var numberitems = 0;
var doneitems=0;
var rolls=0;
var maxroll=1;
var animation_time=2;
var colorscheme= ["#6e4c5a","#d15490","#a8ba42","#fc872e","#3a817d"];
var colorschemeband= ["#4F3742","#9b4070","#8a9335","#c96928","#2e635f"];
var timerPanelID;

var spinvalue;

$(document).ready(function(){
	$.ajaxSetup ({  cache: false});
	$(document).keydown(function(e){
		if($("input:focus").length==0){
			if(e.which==38) 
				spin(-1);
			else if (e.which==40) 
				spin(1);
		}
	});
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
	$("#centercontainer").hide( 'slide', { direction : 'right'  }, 300, function(){
		$("#menu > ul > .selected").removeClass("selected");
		$("#loading").fadeIn();
		$('body' ).animate({ backgroundColor: colorscheme[type-1]}, 500,function(){
			$(".secondcolor").css({ "background-color": colorschemeband[type-1]});
			$("#rightpanel").css('background-image', 'url(img/filigrane-0' + type + '.png)');
			$("#menu > ul >#menu"+type).addClass("selected");
			$.ajax({ type: "GET",cache: true, url: "/recipes/list/"+type,  dataType:"json"}).done(function(content){
				$(".recipe").remove();
				fillListRecipes(content);
				loadDetail();
				animationLoadend();
			});
		});
		
	});
}

function fillListRecipes(content){
	var n=0;

	$.each(content, function( i, c ){
		$.each( c, function( key, val ) {
			addRecipeToList( "<div class='recipe' id='recipe_" + key + "'>" + val + "</div>" );
		});
		n++;
	});
  	if(n==0){
  		$("#highlightcontainer").append("<div class='recipe highlight' id='recipe_null'>Aucune recette.</div>");
  	}
}

function loadDetail(){
	content="";
	id = $("#highlightcontainer > .recipe").attr('id').replace("recipe_", "");
	if(id=="null"){
		content = "Ajouter ma première recette.";
	}
	$("#rightpanel").empty().append(content);
}



function animationLoadend(){
	$("#loading").fadeOut("fast");
	openPanel();
	$("#centercontainer").show( 'slide', { direction : 'right'  }, 500);
}

function addRecipeToList(r){
	var n= $(".recipelist div").length+$("#highlightcontainer > .recipe").length;
	var nup = $("#upperlist > .recipe").length;
	if(n==0){
		$("#highlightcontainer").append(r);
	}else if(nup<3){
		$("#upperlist").append(r);
	}else{
		$("#lowerlist").append(r);
	}
}





function closePanel(callback){
	$("#rightpanel").hide( 'slide', { direction : 'right'  }, 300,callback);
}

function openPanel(){
	$("#rightpanel").show( 'slide', { direction : 'right'  }, 300);
}

function requestPanelOpening(){
	timerPanelID = window.setTimeout(openPanel, 700);
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