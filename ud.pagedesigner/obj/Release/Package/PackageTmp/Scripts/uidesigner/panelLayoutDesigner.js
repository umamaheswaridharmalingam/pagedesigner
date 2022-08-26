adg.pageInit = function () {
    adg.ui.initPanelLayoutDesigner();
}


adg.ui = {
    initPanelLayoutDesigner: function () {
        this.initGraggable();
        this.initGridSystemGenerator();
        this.initRemoveElm();
        this.initConfigurationElement();
        this.initClickEvent();
        this.initMiscEvents();
        this.leftNavigation.init();
    },
    initGraggable: function () {
        $(".demo, .demo .column").sortable({
            connectWith: '.column',
            opacity: 0.35,
            handle: ".drag"
            //,activate: function (event, ui) {
            //    alert('activate');
            //},
            //beforeStop: function (event, ui) {
            //    alert('beforeStop');
            //},
            //change: function (event, ui) {
            //    alert('change');
            //},
            //create: function (event, ui) {
            //    alert('create');
            //},
            //deactivate: function (event, ui) {
            //    alert('deactivate');
            //},
            //over: function (event, ui) {
            //    alert('over');
            //},
            //receive: function (event, ui) {
            //    alert('receive');
            //},
            //sort: function (event, ui) {
            //    //alert('sort');
            //},
            //start: function (event, ui) {
            //    alert('start');
            //},
            //stop: function (event, ui) {
            //    alert('stop');
            //},
            //update: function (event, ui) {
            //    alert('update');
            //}
        });

        /* drag and drop rows */
        $(".sidebar-nav .lyrow").draggable({
            connectToSortable: ".demo",
            helper: "clone",
            handle: ".drag",
            drag: function (event, ui) {
                ui.helper.width(400);
            },
            stop: function (event, ui) {
                $('.demo .column').sortable({
                    opacity: 0.35,
                    connectWith: '.column'
                });
            }
        });

        /* drag and drop boxes */
        $(".sidebar-nav .box").draggable({
            connectToSortable: ".column",
            helper: "clone",
            revert: "invalid",
            handle: ".drag",
            drag: function (event, ui) {
                ui.helper.width(400);
            },
            stop: function (event, ui) {                
                adg.ui.handleJsIds();
            }
        });
    },
    initGridSystemGenerator: function () {
        $('.lyrow .preview input').bind('keyup', function () {
            var sum = 0;
            var src = '';
            var invalidValues = false;
            var cols = $(this).val().split(" ", 12);
            $.each(cols, function (index, value) {
                if (!invalidValues) {
                    if (parseInt(value) <= 0) invalidValues = true;
                    sum = sum + parseInt(value)
                    src += '<div class="col-md-' + value + ' column"></div>';
                }
            });
            if (sum == 12 && !invalidValues) {
                $(this).parent().next().children().html(src);
                $(this).parent().prev().show();
            } else {
                $(this).parent().prev().hide();
            }
        });
    },
    initRemoveElm: function () {
        $('.demo').delegate('.remove', 'click', function (event) {
            event.preventDefault();
            $(this).parent().remove();
            adg.ui.leftNavigation.init();
            if (!$('.demo .lyrow').length > 0) {
                adg.ui.clearDemo();
            }
        });
    },
    initClickEvent: function () {

        $('#edit').click(function () {
            $('body').removeClass('devpreview sourcepreview');
            $('body').addClass('edit');
            adg.ui.removeMenuClasses();
            $(this).addClass('active');
            return false;
        });

        $('#devpreview').click(function () {
            $('body').removeClass('edit sourcepreview');
            $('body').addClass('devpreview');
            adg.ui.removeMenuClasses();
            $(this).addClass('active');
            return false;
        });

        $('#sourcepreview').click(function () {
            $('body').removeClass('edit');
            $('body').addClass('devpreview sourcepreview');
            adg.ui.removeMenuClasses();
            $(this).addClass('active');
            return false;
        });

        $('.nav-header').click(function () {
            $('.sidebar-nav .boxes, .sidebar-nav .rows').hide();
            $(this).next().slideDown();
        });

        $('#clear').click(function (event) {
            event.preventDefault();
            adg.ui.clearDemo();
        });


    },
    initConfigurationElement: function () {

        $('.demo').delegate('.configuration > a', 'click', function (event) {
            event.preventDefault();
            var currentViewObj = $(this).parent().next().next().children();
            $(this).toggleClass('active');
            currentViewObj.toggleClass($(this).attr('rel'));
        });

        $('.demo').delegate('.configuration .dropdown-menu a', 'click', function (event) {
            event.preventDefault();
            var currentClassesObj = $(this).parent().parent();
            var currentViewObj = currentClassesObj.parent().parent().next().next().children();

            currentClassesObj.find('li').removeClass('active');
            $(this).parent().addClass('active');

            var removeClasses = "";
            currentClassesObj.find('a').each(function () {
                removeClasses += $(this).attr('rel') + " ";
            });
            currentClassesObj.parent().removeClass('open');
            currentViewObj.removeClass(removeClasses);
            currentViewObj.addClass($(this).attr('rel'));
        });
    },
    initMiscEvents: function () {
        $('[data-target=#downloadModal]').click(function (event) {
            event.preventDefault();
            adg.ui.downloadLayoutSrc();
        });

    },
    clearDemo: function () {
        $('.demo').empty();
        adg.ui.leftNavigation.init();
    },
    removeMenuClasses: function () {
        $('#menu-layoutit li button').removeClass('active');
    },
    handleJsIds: function () {
        this.leftNavigation.update();
    },
    leftNavigation: {
        init: function(){
            var elm = $('.demo .view').find('.box-element');
            var leftnavElm = $('.sidebar-nav').find('.box-element');
           
            $.each(leftnavElm, function (current, element) {
                var ctlId = $(element).data('controlid');
                if ($('.demo .view').find("[data-controlid='" + ctlId + "']").exists()) 
                    $(this).hide();
                else
                    $(this).show();
            });
        },
        update: function () {
            var elm = $('.demo .view').find('.box-element');
            $.each(elm, function (current, element) {
                var ctlId = $(element).data('controlid');
                $(".sidebar-nav").find("[data-controlid='" + ctlId + "']").hide();
            });
        },
        add: function (controlID) {

        },
        remove: function (controlID) {

        }
    },
    downloadLayoutSrc: function () {
  
        function cleanHtml(elm) {
            $(elm).parent().append($(elm).children().html());
        }

        function changeStructure(oldClass, newClass) {
            $('#download-layout .' + oldClass).removeClass(oldClass).addClass(newClass);
        }

        var src = '';
        $('#download-layout').children().html($('.demo').html());
        var downloadContent = $('#download-layout').children();
        downloadContent.find('.preview, .configuration, .drag, .remove').remove();
        downloadContent.find('.lyrow').addClass('removeClean');
        downloadContent.find('.box-element').addClass('removeClean');

        downloadContent.find('.lyrow .lyrow .lyrow .lyrow .lyrow .removeClean').each(function () { cleanHtml(this) });
        downloadContent.find('.lyrow .lyrow .lyrow .lyrow .removeClean').each(function () { cleanHtml(this) });
        downloadContent.find('.lyrow .lyrow .lyrow .removeClean').each(function () { cleanHtml(this) });
        downloadContent.find('.lyrow .lyrow .removeClean').each(function () { cleanHtml(this) });
        downloadContent.find('.lyrow .removeClean').each(function () { cleanHtml(this) });
        downloadContent.find('.removeClean').each(function () { cleanHtml(this) });

        downloadContent.find('.removeClean').remove();

        $('#download-layout .column').removeClass('ui-sortable');
        $('#download-layout .row-fluid').removeClass('clearfix').children().removeClass('column');

        if ($('#download-layout .container').length > 0) {
            changeStructure('row-fluid', 'row');
        }

        formatSrc = $.htmlClean($('#download-layout').html(), {
            format: true,
            allowedAttributes: [
                ['id'], ["class"], ['data-toggle'], ['data-target'], ['data-parent'], ['role'], ['data-dismiss'], ['aria-labelledby'],
                ['aria-hidden'], ['data-slide-to'], ['data-slide']
            ]
        });

        $('#download-layout').html(formatSrc);
        $('#downloadModal textarea').empty();
        $('#downloadModal textarea').val(formatSrc);
        $('#downloadModal').modal('show');
    }
};
