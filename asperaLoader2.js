"use strict";

if (typeof AW4 === "undefined") var AW4 = {};

/** section: API
 * class AW4.AsperaLoader
 *
 * The [[AW4.AsperaLoader]] class contains helper functions for connect 3.6 integration.
 **/
AW4.AsperaLoader = (function() {
  
  var ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';

  /** 
   * AW4.AsperaLoader.onlyConnect36supported(files, callback) -> Boolean 
   * 
   * Check if the browser can only work with Aspera Connect 3.6
   *
   * @return {bool} True if the browser can only work with Aspera Connect 3.6 and greater versions
   */ 
   var onlyConnect36supported = function () { 
    var supported = navigator.mimeTypes['application/x-pnacl'] !== undefined;
    if (supported) { 
      var version = ua.match(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i);
      version = (version && version.length > 1 && version[1]) || '';
      if (version >= 42) {
        return true;
      } 
    }
    return false;
  };

  /** 
   * AW4.AsperaLoader.loadFiles(files, type, callback) -> null
   * - files (Array): Set of files to load
   * - type (String): type of the files to load: `js` or `css`
   * - callback (function): to be called when all scripts provided have been loaded,
   *   no arguments provided.
   * 
   **/
  var loadFiles = function(files, type, callback) {
    if (files === null || typeof files === 'undefined' || !(files instanceof Array)) {
      console.log("Please provide the files to be loaded");
      return null;
    } else if (type === null || typeof type !== 'string') {
      console.log("Please provide the type of the files to be loaded");
      return null;
    }
    var 
      numberOfFiles = 0,
      head = document.getElementsByTagName("head")[0] || document.documentElement;

    /* Loads the file given, and sets a callback, when the file is the last one and a callback is 
     * provided, it will call it
     * Loading mechanism based on https://jquery.org (MIT license)
     */
    var loadFilesHelper = function (file) {
      //IE9+ supports both script.onload AND script.onreadystatechange thus the done check
      var 
        done = false,
        fileref = null;

      if (type.toLowerCase() === "js") {
        fileref = document.createElement('script');
        fileref.setAttribute("type","text/javascript");
        fileref.setAttribute("src", file);
      } else if (type.toLowerCase() === "css") {
        fileref = document.createElement("link");
        fileref.setAttribute("rel", "stylesheet");
        fileref.setAttribute("type", "text/css");
        fileref.setAttribute("href", file);
      } else {
        return null;
      }
      if (typeof callback === 'function') {
        // Attach handlers for all browsers
        fileref.onload = fileref.onreadystatechange = function() {
            if (!done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") ) {
              done = false;
              // Handle memory leak in IE
              fileref.onload = fileref.onreadystatechange = null;
              if (head && fileref.parentNode) {
                  head.removeChild(fileref);
              }
              if (--numberOfFiles <= 0 && typeof callback === 'function') {
                callback();
              }              
            }
        };
      }
      // Use insertBefore instead of appendChild  to circumvent an IE6 bug.
      head.insertBefore(fileref, head.firstChild);
    }
    numberOfFiles = files.length;
    for (var i = 0; i < numberOfFiles; i++) {
      if (typeof files[i] === 'string') {
        loadFilesHelper(files[i]);
      } 
    } 
  };
  
  return {
    onlyConnect36supported: onlyConnect36supported,
    loadFiles: loadFiles
  };
}());