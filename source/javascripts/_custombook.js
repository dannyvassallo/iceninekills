/*
 * Turn.js responsive book
 */

/*globals window, document, $*/

(function () {
    'use strict';

    var module = {
        ratio: 2,
        init: function (id) {
            var me = this;

            // if older browser then don't run javascript
            if (document.addEventListener) {
                this.el = document.getElementById(id);
                this.resize();
                this.plugins();

                // on window resize, update the plugin size
                window.addEventListener('resize', function (e) {
                    var size = me.resize();
                    $(me.el).turn('size', size.width, size.height);
                });
            }
        },
        resize: function () {
            // reset the width and height to the css defaults
            this.el.style.width = '';
            this.el.style.height = '';

            var width = this.el.clientWidth,
                height = Math.round(width / this.ratio),
                padded = Math.round(document.body.clientHeight * 0.9);

            // if the height is too big for the window, constrain it
            if (height > padded) {
                height = padded;
                width = Math.round(height * this.ratio);
            }

            // set the width and height matching the aspect ratio
            this.el.style.width = width + 'px';
            this.el.style.height = height + 'px';

            return {
                width: width,
                height: height
            };
        },
        plugins: function () {
            // run the plugin
            $(this.el).turn({
                gradients: true,
                acceleration: true,
                page: 2,
                when: {
                    start: function(event, pageObject, corner) {
                       if (pageObject.next==1)
                         event.preventDefault();
                    },
                    turning: function(event, page, view) {
                       if (page==1)
                          event.preventDefault();
                    }
                },
            });
        }
    };

    module.init('book');
}());


// PAUSE YOUTUBE EMBEDS ON PAGE TURN
$("#book").bind("turning", function(event, page, view) {
    stopVideos();
});

// RESIZE BOOK BORDER
$(function(){
    resizeBook();
});
$(window).resize(resizeBook);
function resizeBook(){
    var bookWidth = $('#book').width();
    var bookHeight = $('#book').height();
    bookWidth = bookWidth + ((4/100)*bookWidth);
    bookHeight = bookHeight + (((4/100)*bookHeight)/2);
    $('#book-background img').css('max-width',bookWidth);
    $('#book-background').css('margin-top',-Math.abs(bookHeight));
}


// ADD API FUNCTION TO YOUTUBE EMBEDS
function initVideos() {

  // Find all video iframes on the page:
  var iframes = $("iframe");

  // For each of them:
  for (var i = 0; i < iframes.length; i++) {
    // If "enablejsapi" is not set on the iframe's src, set it:
    if (iframes[i].src.indexOf("enablejsapi") === -1) {
      // ...check whether there is already a query string or not:
      // (ie. whether to prefix "enablejsapi" with a "?" or an "&")
      var prefix = (iframes[i].src.indexOf("?") === -1) ? "?" : "&amp;";
      iframes[i].src += prefix + "enablejsapi=true";
    }
  }
}

initVideos();

// STOP YOUTUBE EMBEDS
function stopVideos(){
    jQuery("iframe").each(function() {
      jQuery(this)[0].contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
    });
}



function isElementInViewport (el) {

    //special bonus for those using jQuery
    if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
    }

    var rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
}
