(function () {
  'use strict';

  var content = document.querySelector('.post-content');
  var script = document.currentScript;
  var sourceUrl = script && script.getAttribute('data-source-url');

  if (!content || !sourceUrl) {
    return;
  }

  function isEditable(node) {
    var element = node && (node.nodeType === 1 ? node : node.parentElement);
    return element && (element.isContentEditable || element.closest('input, textarea'));
  }

  document.addEventListener('copy', function (event) {
    if (event.defaultPrevented || !event.clipboardData ||
        isEditable(event.target) || isEditable(document.activeElement)) {
      return;
    }

    var selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.rangeCount) {
      return;
    }

    // Leave selections spanning the navigation, comments or other page areas alone.
    for (var i = 0; i < selection.rangeCount; i += 1) {
      if (!content.contains(selection.getRangeAt(i).commonAncestorContainer)) {
        return;
      }
    }

    var text = selection.toString();
    if (!text.trim()) {
      return;
    }

    try {
      event.clipboardData.setData('text/plain', text + '\n\n来源：' + sourceUrl);
      event.preventDefault();
    } catch (error) {
      // Preserve the browser's normal copy behavior if clipboard access fails.
    }
  });
}());
