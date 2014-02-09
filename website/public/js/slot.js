var rolling =false;
var numberitems = 0;
var doneitems=0;
var rolls=0;
var maxroll;
var animation_time=2;
var colorscheme= ["#6e4c5a","#eb5490","#82b941","#e34a2e","#3a817d"];
var colorschemeband= ["#4F3742","#eb5490","#82b941","#e34a2e","#3a817d"];

$(document).ready(function(){
	$(document).keydown(function(e){
		console.log(e.which);
		if(e.which==38) spinUp();
		else if (e.which==40) spinDown();
	});


});

function changeContent (type){
	
	$("#centercontainer").hide( 'slide', { direction : 'right'  }, 300, function(){
		$("#menu > ul > .selected").removeClass("selected");
		$('body' ).animate({ backgroundColor: colorscheme[type-1]}, 500,function(){
			$(".hasback").css({ "background-color": colorschemeband[type-1]});
			$("#menu > ul >#menu"+type).addClass("selected");
			$("#centercontainer").show( 'slide', { direction : 'right'  }, 300);
		});
		
	});
	
}







function spinDown(){
	if (rolling) return;
	rolling =true;
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
	$("#highlightcontainer > .recipe").css({"top": "-1.2em"});
	$(".recipe").each(function(){
		$(this).animate({ "top": "+=1.2em" },200,function(){
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
	if (rolling) return;
	rolling =true;
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
	$(".recipe").each(function(){
		$(this).animate({ "top": "-=1.2em" },200,function(){
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

function finalizeSpin(){
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

}
	

function speedDown(){
	rolls++;
	animation_time = easeInQuint(rolls, 2000, 3000,maxroll);
	if(rolls<1){
		spin();
	}else{
		rolling = false;
	}
		

}
function easeInQuint(currentIteration, startValue, changeInValue, totalIterations) {
    return changeInValue * Math.pow (currentIteration / totalIterations, 5) + startValue;
}

function easeOutQuad(currentIteration, startValue, changeInValue, totalIterations) {
    return -changeInValue * (currentIteration /= totalIterations) * (currentIteration - 2) + startValue;
}