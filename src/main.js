'use strict';

angular.module('mc-drag-and-drop', [
  'mc-drag-and-drop.mcCss',
  'mc-drag-and-drop.mcAnimation',
  'mc-drag-and-drop.mcEvents',
  'mc-drag-and-drop.mcDraggable',
  'mc-drag-and-drop.mcSortable'
])
.value('isAndroid', /Android/i.test(navigator.userAgent))
.value('hasTouchEvents', /webOS|Android|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent));