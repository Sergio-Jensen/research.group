$(document).ready(function(){
	var bReady=true;
	$(".header .open").click(function(){
		if(bReady){
			$(this).addClass("close");
			$(".header ul").slideDown();
			bReady=false;
		}else{
			$(this).removeClass("close");
			$(".header ul").slideUp();
			bReady=true;
		}
		
	});
});
