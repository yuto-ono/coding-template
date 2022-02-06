(function () {
	'use strict';

	(function (d) {
	  var toggleDrawer = function toggleDrawer() {
	    d.body.classList.toggle('is-drawer-active');
	  };

	  d.getElementById('drawer_btn').addEventListener('click', toggleDrawer);
	  d.getElementById('drawer_shade').addEventListener('click', toggleDrawer);
	})(document);

})();
