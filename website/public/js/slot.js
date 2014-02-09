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
	$(document).keydown(function(e){
		console.log(e.which);
		if(e.which==38) spin(-1);
		else if (e.which==40) spin(1);
	});
});


function luckywheel(){
	if (rolling) return;
	rolling =true;
	cancelPanelOpening();
	numberitems = $(".recipelist div").length+1;
	maxroll=numberitems*2+Math.floor(Math.random()*numberitems+1);
	closePanel(spinDown);
}

function changeContent (type){
	closePanel(animationLoad(type));
}
function animationLoad(type){
	$("#centercontainer").hide( 'slide', { direction : 'right'  }, 300, function(){
		$("#menu > ul > .selected").removeClass("selected");
		$('body' ).animate({ backgroundColor: colorscheme[type-1]}, 500,function(){
			$(".secondcolor").css({ "background-color": colorschemeband[type-1]});
			$("#rightpanel").css('background-image', 'url(img/filigrane-0' + type + '.png)');
			$("#menu > ul >#menu"+type).addClass("selected");
			$("#centercontainer").show( 'slide', { direction : 'right'  }, 300);
		});
		
	});
	requestPanelOpening();	
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
	rolling =true;
	cancelPanelOpening();
	if(delta<0)
		closePanel(spinUp);
	else
		closePanel(spinDown);
}



function spinDown(){	
	numberitems = $(".recipelist div").length+4;
	doneitems =0;
	var l = $("#upperlist > .recipe").last().clone();
	l.addClass("highlight");
	$("#highlightcontainer").prepend(l);
	var l = $("#lowerlist > .recipe").last().clone();
	$("#upperlist").prepend(l);
	var l = $("#highlightcontainer > .recipe").last().clone();
	l.removeClass("highlight");
	$("#lowerlist").prepend(l);
	$("#lowerlist > .recipe").css({"top": "-1.2em"});
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
	numberitems = $(".recipelist div").length+4;
	doneitems =0;	
	var l = $("#lowerlist > .recipe").first().clone();
	l.addClass("highlight");	
	$("#highlightcontainer").append(l);
	var l = $("#upperlist > .recipe").first().clone();
	$("#lowerlist").append(l);
	var l = $("#highlightcontainer > .recipe").first().clone();
	l.removeClass("highlight");
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