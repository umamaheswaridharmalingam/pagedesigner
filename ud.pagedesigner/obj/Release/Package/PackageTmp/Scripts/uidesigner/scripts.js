var currentDocument = null;
var timerSave = 2000;
var demoHtml = $('.demo').html();

$(window).resize(function(){$('body').css('min-height',$(window).height()-90);
	$('.demo').css('min-height',$(window).height()-160);
});

$(document).ready(function() {
	
	$('body').css('min-height',$(window).height()-90);
	$('.demo').css('min-height',$(window).height()-160);
	
	/* sortables */
	$( ".demo, .demo .column" ).sortable({
		connectWith: '.column',
		opacity : 0.35,
		handle: ".drag"
	});

	/* drag and drop rows */
	$( ".sidebar-nav .lyrow" ).draggable({
		connectToSortable: ".demo",
		helper: "clone",
		handle: ".drag",
		drag: function(event, ui) {
			ui.helper.width(400);
		},
		stop: function( event, ui ) {
			$('.demo .column').sortable({ 
				opacity : 0.35,
				connectWith: '.column'
			});
		}
	});
	
	/* drag and drop boxes */
	$( ".sidebar-nav .box" ).draggable({
		connectToSortable: ".column",
		helper: "clone",
		handle: ".drag",
		drag: function(event, ui) {
			ui.helper.width(400);
		},
		stop: function() {
			handleJsIds();
		}
	});


	/* fin drageable sortable  */
	
	
	$('[data-target=#downloadModal]').click(function(event){
	    event.preventDefault();	    
		downloadLayoutSrc();
	});

	$('#download').click(function(){
		downloadLayout();
		return false;
	});

	$('#downloadhtml').click(function(){
		downloadHtmlLayout();
		return false;
	});

	$('#edit').click(function(){
		$('body').removeClass('devpreview sourcepreview');
		$('body').addClass('edit');
		
		removeMenuClasses();
		
		$(this).addClass('active');

		return false;
	});

	$('#clear').click(function(event) {
		event.preventDefault();
		clearDemo();
	});

	$('#devpreview').click(function(){
		$('body').removeClass('edit sourcepreview');
		$('body').addClass('devpreview');

		removeMenuClasses();

		$(this).addClass('active');

		return false;
	});
	
	$('#sourcepreview').click(function(){
		$('body').removeClass('edit');
		$('body').addClass('devpreview sourcepreview');
		removeMenuClasses();
		$(this).addClass('active');
		return false;
	});
	
  // ya no hay mas fluid page
	/*$('#fluidPage').click(function(event){
		event.preventDefault();
		changeStructure('container','container-fluid');
		$('#fixedPage').removeClass('active');
		$(this).addClass('active');
		downloadLayoutSrc();
	});*/
	
	/*$('#fixedPage').click(function(event){
		event.preventDefault();
		changeStructure('container-fluid','container');
		$('#fluidPage').removeClass('active');
		$(this).addClass('active');
		downloadLayoutSrc();
	});*/
	
	$('.nav-header').click(function(){
		$('.sidebar-nav .boxes, .sidebar-nav .rows').hide();
		$(this).next().slideDown();	
	});

	removeElm();
	configurationElm();
	gridSystemGenerator();
	
	setInterval(function() {
		handleSaveLayout();
	}, timerSave);
});

function handleSaveLayout(){
	var currentDocument = $('.demo').html();
	if(currentDocument != window.demoHtml) {
		saveLayout();
		window.demoHtml = currentDocument;
	}
}

function handleJsIds(){
	handleModalIds();
	handleAccordionIds();
	handleCarouselIds();
	handleTabsIds();
}

function handleAccordionIds(){
	var elm = $('.demo #myAccordion');	
	var random = randomNumber();
	var elmId = 'panel-' + random;
	var accordionElementId;
	elm.attr('id', elmId);

	elm.find('.panel').each(function(current,element){
		accordionElementId = 'panel-element-' + randomNumber();

		$(element).find('.panel-title').each(function(toggleCurrent,toggleElement){
			$(toggleElement).attr('data-parent', '#' + elmId);
			$(toggleElement).attr('href', '#' + accordionElementId);
		});

		$(element).find('.panel-collapse').each(function(bodyCurrent,bodyElement){
			$(bodyElement).attr('id', accordionElementId);
		});
	});
}

function handleCarouselIds(){
	var elm = $('.demo #myCarousel');	
	var random = randomNumber();
	var elmId = 'carousel-' + random;

	elm.attr('id', elmId);

	elm.find('.carousel-indicators li').each(function(current,element){
		$(element).attr('data-target', '#' + elmId);
	});

	elm.find('.left').attr('href','#' + elmId)
	elm.find('.right').attr('href','#' + elmId);
}

function handleModalIds(){
	var elm = $('.demo #myModalLink');	
	var random = randomNumber();
	var containerId = 'modal-container-' + random;
	var elmId = 'modal-' + random;

	elm.attr('id', elmId);
	elm.attr('href', '#' + containerId);
	elm.next().attr('id', containerId);
}

function handleTabsIds(){
	var elm = $('.demo #myTabs');	
	var random = randomNumber();
	var elmId = 'tabs-' + random;

	elm.attr('id', elmId);

	elm.find('.tab-pane').each(function(current,element){
		var paneId = $(element).attr('id');
		var paneIdNew = 'panel-'+randomNumber();

		$(element).attr('id', paneIdNew);
		$(element).parent().parent().find('a[href=#'+paneId+']').attr('href', '#' + paneIdNew);		
	});
}

function randomNumber(){
	return randomFromInterval(1,1000000);
}

function randomFromInterval(from,to){
    return Math.floor(Math.random()*(to-from+1)+from);
}

function gridSystemGenerator() {
	$('.lyrow .preview input').bind('keyup',function(){
		var sum = 0;
		var src = '';
		var invalidValues = false;
		var cols = $(this).val().split(" ",12);
		$.each(cols, function(index,value){
			if(!invalidValues) {
				if(parseInt(value) <= 0) invalidValues = true;
				sum = sum + parseInt(value)
				src += '<div class="col-md-'+value+' column"></div>';
			}
		});
		if(sum==12 && !invalidValues) { 
			$(this).parent().next().children().html(src);
			$(this).parent().prev().show();
		} else {
			$(this).parent().prev().hide();
		}
	});
}

function configurationElm(elmToggle, elmMenu) {
	$('.demo').delegate('.configuration > a', 'click', function(event){
		event.preventDefault();
		var currentViewObj = $(this).parent().next().next().children();
		$(this).toggleClass('active');
		currentViewObj.toggleClass($(this).attr('rel'));
	});

	$('.demo').delegate('.configuration .dropdown-menu a', 'click', function(event){
		event.preventDefault();
		var currentClassesObj = $(this).parent().parent();
		var currentViewObj = currentClassesObj.parent().parent().next().next().children();

		currentClassesObj.find('li').removeClass('active');
		$(this).parent().addClass('active');
	
		var removeClasses = "";
		currentClassesObj.find('a').each(function(){
			removeClasses += $(this).attr('rel')  + " ";
		});

		currentClassesObj.parent().removeClass('open');
	
		currentViewObj.removeClass(removeClasses);
		currentViewObj.addClass($(this).attr('rel'));
	});
}

function removeElm() {
	$('.demo').delegate('.remove','click',function(event) {
		event.preventDefault();
		$(this).parent().remove();
		if(!$('.demo .lyrow').length > 0) { 
			clearDemo();
		}
	});
}

function clearDemo() {
	$('.demo').empty();
}
function removeMenuClasses(){
	$('#menu-layoutit li button').removeClass('active');
}

function changeStructure(oldClass, newClass) {
	$('#download-layout .'+oldClass).removeClass(oldClass).addClass(newClass);
}

function cleanHtml(elm) {
	$(elm).parent().append($(elm).children().html());
}

function downloadLayoutSrc() {
	var src = '';

	$('#download-layout').children().html($('.demo').html());

	var downloadContent = $('#download-layout').children();

	downloadContent.find('.preview, .configuration, .drag, .remove').remove();
	downloadContent.find('.lyrow').addClass('removeClean');
	downloadContent.find('.box-element').addClass('removeClean');

	downloadContent.find('.lyrow .lyrow .lyrow .lyrow .lyrow .removeClean').each(function(){ cleanHtml(this) });
	downloadContent.find('.lyrow .lyrow .lyrow .lyrow .removeClean').each(function(){ cleanHtml(this) });
	downloadContent.find('.lyrow .lyrow .lyrow .removeClean').each(function(){ cleanHtml(this) });
	downloadContent.find('.lyrow .lyrow .removeClean').each(function(){ cleanHtml(this) });
	downloadContent.find('.lyrow .removeClean').each(function(){ cleanHtml(this) });
	downloadContent.find('.removeClean').each(function(){ cleanHtml(this) });

	downloadContent.find('.removeClean').remove();
	
	$('#download-layout .column').removeClass('ui-sortable');	
	$('#download-layout .row-fluid').removeClass('clearfix').children().removeClass('column');

	if($('#download-layout .container').length > 0) {
		changeStructure('row-fluid','row');
	}

	formatSrc = $.htmlClean($('#download-layout').html(), {
		format:true, 
		allowedAttributes:[
			['id'], ["class"], ['data-toggle'], ['data-target'], ['data-parent'], ['role'], ['data-dismiss'], ['aria-labelledby'],
			['aria-hidden'], ['data-slide-to'], ['data-slide']
		] 
	});

	$('#download-layout').html(formatSrc);
	$('#downloadModal textarea').empty();
	$('#downloadModal textarea').val(formatSrc);
    $('#downloadModal').modal('show');
}
