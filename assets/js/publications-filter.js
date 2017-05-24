(function () {
'use strict';

function addEventListener( elements, eventname, callback ) {

   if( elements === null  ) {

      throw new Error( "[addEventListenerException] No elements provided" );
   }

   if( Array.isArray( elements ) ) {

      var handles = [];
      for( var i=0, nrEls = elements.length; i < nrEls; i++ ) {

         handles.push( addEventListener( elements[i], eventname, callback ) );
      }
      return handles;
   }

   if (document.attachEvent) {

      return elements.attachEvent("on" + eventname, callback);
   }
   else if (document.addEventListener) {

      return elements.addEventListener(eventname, callback, false);
   }

}

var searchfield = document.getElementById("search-field");
var publications = document.getElementsByClassName("publication");
var countField = document.getElementById("search--nr-pubs-visible");
var yearHeaders = document.querySelectorAll("h2.year");
var headersAreHidden = false;
var index = [];

for (var i = 0; i < publications.length; ++i) {

   var item = publications[i];
   index.push({
      "content": item.textContent.replace(/[\s\n]+/g, ' '),
      "element": item,
      "visible": true
   });
}

// console.table(index);

addEventListener( searchfield, 'keyup', filterPublications );

addEventListener( searchfield, 'keyup', hideHeaders );

// ========================================================================== //
// FUNCTIONS
// ========================================================================== //

function filterPublications( e ) {

   var filter = searchfield.value;
   var regex = filterValueToRegex( filter );
   var nrVisibleItems = 0;

   for (var i = 0, len = index.length; i < len; i++) {

      var item = index[i];
      var itemMatchesFilter = item.content.match( regex );

      if( itemMatchesFilter && !item.visible ) {

         item.element.classList.remove('hidden');
         index[i].visible = true;
      }
      else if( !itemMatchesFilter && item.visible ) {

         item.element.classList.add('hidden');
         index[i].visible = false;
      }

      if( item.visible ) nrVisibleItems++;
   }

   countField.innerHTML = nrVisibleItems;
}

// ========================================================================== //

function filterValueToRegex( string ) {

   var keywords = string.split('+');
   var regexString = '';

   for (var i = 0, len = keywords.length; i < len; i++) {

      var word = keywords[i];
      if( word == '' ) continue;

      word = word.replace(/\s+\|\s+/, '|');

      regexString += '(?=.*'+word.trim()+')';
   }

   return new RegExp( '('+regexString+')', 'ig' );
}

// ========================================================================== //

function hideHeaders(e) {

   if( searchfield.value == '' && headersAreHidden ) {

      for (var i = 0, len = yearHeaders.length; i < len; i++) {

         yearHeaders[i].classList.remove('hidden');
      }
      headersAreHidden = false;
   }
   else if( searchfield.value != '' && !headersAreHidden ) {

      for (var i = 0, len = yearHeaders.length; i < len; i++) {

         yearHeaders[i].classList.add('hidden');
      }
      headersAreHidden = true;
   }

}

}());
