$(function() {

  /*-----------------------------------------------------------------------------------*/
  /*  Anchor Link
  /*-----------------------------------------------------------------------------------*/
  $('a[href*=#]:not([href=#])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') 
      || location.hostname == this.hostname) {

      var target = $(this.hash);
    target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
    if (target.length) {
      $('html,body').animate({
        scrollTop: target.offset().top
      }, 1000);
        return false;
      }
    }
  });

  /*-----------------------------------------------------------------------------------*/
  /*  Tooltips
  /*-----------------------------------------------------------------------------------*/
  $('.tooltip-side-nav').tooltip();

  var jumbotron = $('.jumbotron');
  jumbotron.find(".to-animate").removeClass('fadeInUp animated');
  jumbotron.find(".to-animate-2").removeClass('fadeInUp animated');
  setTimeout(function(){
    jumbotron.find(".to-animate").addClass('fadeInUp animated');
  }, 700);
  setTimeout(function(){
    jumbotron.find(".to-animate-2").addClass('fadeInUp animated');
  }, 900);
  
});
