(function() {
	// Get all the toggletip buttons:
	const toggles = document.querySelectorAll( '[data-tooltip]' ),
		bailOut = function( e ) {
			const target = e.relatedTarget || e.target,
			// Find any toggles associated with open tooltips:
				activeToggle = document.querySelector( '[aria-expanded="true"]' );

			if( activeToggle && !activeToggle.nextSibling.contains( target ) ) {
				setVisibility( activeToggle, false );
			}
		},
		setVisibility = function( el, state ) {
			const tooltip = el.nextElementSibling;
			let collision;

			// Toggle the visibility of the associated tooltip:
			tooltip.setAttribute( 'aria-hidden', !state );

			// Set the toggle’s expanded state:
			el.setAttribute( 'aria-expanded', state );

			// Add a class if tooltip would collide with right side of viewport:
			collision = tooltip.getBoundingClientRect().right >= window.innerWidth;
			tooltip.classList[ collision ? 'add' : 'remove']( 'mwf-tooltip-collide-right' );

			// Add a class if tooltip would collide with bottom of viewport:
			collision = tooltip.getBoundingClientRect().bottom >= window.innerHeight;
			tooltip.classList[ collision ? 'add' : 'remove']( 'mwf-tooltip-collide-bottom' );
		},
		toggle = function( e ) {
			/* ---------------------------------------------- */
			/* Invert the state of the associated tooltip.
			------------------------------------------------- */
			const el = e.target,
				state = el.getAttribute( 'aria-expanded' ) === "false",
				tooltip = el.nextElementSibling;

			// Close any open tooltips:
			closeAll();

			// Set the associated tooltip to visible/hidden:
			setVisibility( el, state );

			// Manage focus to the tooltip itself:
			el.nextElementSibling.focus();

			e.stopPropagation();
		},
		closeAll = function( e ) {
			/* ---------------------------------------------- */
			/* Loop through the tooltips and close them all.
			------------------------------------------------- */
			const tooltips = document.querySelectorAll( '[data-tooltip]' );

			if( tooltips ) {
				Array.prototype.forEach.call( tooltips, function( el ) {
					setVisibility( el, false );
				});
			}
		},
		init = function( el, i ) {
			/* ---------------------------------------------- */
			/* Create tooltips, if they don’t exist.
			------------------------------------------------- */
			const msg = el.getAttribute( "data-tooltip" ),
				message = document.createTextNode( msg ),
				target = el.getAttribute( "aria-controls" ),
				// If a tooltip is specified via `aria-controls`, use that; else, create a `div`:
				tooltip = document.getElementById( target ) || document.createElement( 'div' ),
				refid = tooltip.id || 'mwf-tooltip-' + i,
				wrap = document.createElement( 'span' );

			/* ----------------------------------- */
			/* Wrap the tooltip/toggle for styling:
			-------------------------------------- */
			wrap.classList.add( 'mwf-tooltip-wrap' );
			el.parentNode.insertBefore( wrap, el );
			wrap.appendChild( el );

			/* ----------------------------------- */
			/* ARIA up the toggles:
			-------------------------------------- */
			el.setAttribute( 'aria-haspopup', 'true' );
			el.setAttribute( 'aria-expanded', 'false' );
			el.setAttribute( 'aria-controls', refid );

			/* ----------------------------------- */
			/* Augment the tooltip:
			-------------------------------------- */
			// Add rich tooltip class:
			if( target !== null ) {
				tooltip.classList.add( 'mwf-rich-tooltip' );
				tooltip.setAttribute( 'aria-live', 'off' );
				tooltip.setAttribute( 'aria-role', 'presentation' );
			}
			tooltip.classList.add( 'mwf-tooltip' );

			// `aria-hidden` the generated tooltip
			tooltip.setAttribute( 'aria-hidden', 'true' );

			// Make the tooltip itself programmatically focusable:
			tooltip.setAttribute( 'tabindex', '-1' );

			// Add generated ID for ARIA association:
			tooltip.id = refid;

			// Tooltip message:
			tooltip.appendChild( message );

			// Add the tooltip to the DOM:
			el.parentNode.insertBefore( tooltip, el.nextSibling );

			/* ----------------------------------- */
			/* Bind events:
			-------------------------------------- */
			// Toggle the tooltip on interaction:
			el.addEventListener( 'click', toggle );

			// If focus lands outside the open tooltip, close it:
			tooltip.addEventListener( "focusout", bailOut );

			// Run built-in tests:
			spotcheck( el );
		},
		spotcheck = function( el ) {
			/* ---------------------------------------------- */
			/* Perform checks for common a11y issues.
			------------------------------------------------- */
			const check = function( ev, msg, type ) {
					if ( ev ) {
						console[ type ]( msg );
					}
				},
				desc = el.innerHTML,
				label = el.getAttribute( 'aria-label' ),
				copy = el.getAttribute( 'data-tooltip' );

			/* Warnings
			-------------------------- */
			check( !desc && label === null, 'Tooltip toggle needs either discoverable text or `aria-label`.', 'warn' );
			check( copy.length > 100, 'Simple tooltips shouldn\'t be used for long runs of text.' , 'warn' );

			/* Errors
			-------------------------- */
			check( el.nodeName !== 'BUTTON', 'Toggles should be `button` elements.', 'error' );
		};

	// Iterate over the trigger elements:
	Array.prototype.forEach.call( toggles, init );

	// Clicking outside an open tooltip should close it:
	document.addEventListener( 'click', bailOut );

	// `esc` should close any open tooltips:
	document.addEventListener( 'keydown', function( e ) {
		if( ( e.keyCode || e.which ) === 27 ) {
			closeAll();
		}
	});

}());