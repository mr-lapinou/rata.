var rolling =false;
var numberitems = 0;
var doneitems=0;
var rolls=0;
var maxroll;
var animation_time=2;

$(document).ready(function(){
	$(document).keypress(function(){
		if (rolling==false){
			rolls= 0;
			maxroll = Math.floor(Math.random()*10+1);
			rolling=true;
			$(".recipelist").css({"overflow": "visible"});
			spin();
		}
	});
	$( "#menu li" ).click(function() {
		changeContent();
	});

});

function changeContent (){
	$("#centercontainer").toggle( 'slide', { direction : 'right'  }, 1000 );
	$('body' ).animate({
        backgroundColor: "#aa0000",    		
        }, 500 );
}





function spin(){
	numberitems = $(".recipelist div").length+1;
	doneitems =0;
	var l = $("#upperlist > .recipe").last().clone();
	$("#highlightcontainer").prepend(l);
	var l = $("#highlightcontainer > .recipe").last().clone();
	$("#lowerlist").prepend(l);
	$(".recipe").each(function(){
		$(this).animate({ "top": "1em" }, animation_time,function(){
			doneitems++;
			if(doneitems == numberitems){

				var l = $("#lowerlist > .recipe").last().detach();
				$("#upperlist").prepend(l);

			

				var l = $("#upperlist > .recipe").last().remove();
			
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