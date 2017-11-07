(function() {
	// Get all the toggletip buttons:
	const toggles = document.querySelectorAll( '[data-tooltip]' ),
		clickOut = function( e ) {
			// Find any toggles associated with open tooltips:
			const activeToggle = document.querySelector( '[aria-expanded="true"]' );

			if( activeToggle && !activeToggle.nextSibling.contains( e.target ) ) {
				setVisibility( activeToggle, false );
			}
		},
		setVisibility = function( el, state ) {
			const tooltip = el.nextElementSibling;

			// Toggle the visibility of the associated tooltip:
			tooltip.setAttribute( 'aria-hidden', !state );

			// Set the toggle’s expanded state:
			el.setAttribute( 'aria-expanded', state );
		},
		toggle = function( e ) {
			/* ---------------------------------------------- */
			/* Invert the state of the associated tooltip.
			------------------------------------------------- */
			var el = e.target,
				state = el.getAttribute( 'aria-expanded' ) === "false";

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
			const tooltip = document.createElement( 'span' ),
				msg = el.getAttribute( "data-tooltip" ),
				refid = 'mwf-tooltip-' + i;

			/* ----------------------------------- */
			/* ARIA up the toggles:
			-------------------------------------- */
			el.setAttribute( 'aria-haspopup', 'true' );
			el.setAttribute( 'aria-expanded', 'false' );
			el.setAttribute( 'aria-controls', refid );

			/* ----------------------------------- */
			/* Create the tooltip:
			-------------------------------------- */
			// Class(es) for theming:
			tooltip.classList.add( 'mwf-tooltip' );

			tooltip.setAttribute( 'aria-hidden', 'true' );

			// Make the tooltip itself programmatically focusable:
			tooltip.setAttribute( 'tabindex', '-1' );

			// Add generated ID for ARIA association:
			tooltip.id = refid;

			// Tooltip message:
			tooltip.append( msg );

			// Add the tooltip to the DOM:
			el.parentNode.insertBefore( tooltip, el.nextSibling );

			/* ----------------------------------- */
			/* Bind events:
			-------------------------------------- */
			// Toggle the tooltip on interaction:
			el.addEventListener( 'click', toggle );

			// Close the tooltip when `esc` is pressed:
			document.addEventListener( 'keydown', function( e ) {
				if( ( e.keyCode || e.which ) === 27 ) {
					closeAll();
				}
			});

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
			};

			/* Warnings
			-------------------------- */
			check( el.nodeName !== 'BUTTON', 'Toggles should be `button` elements.', 'warn' );

			/* Errors
			-------------------------- */
			const message = el.getAttribute( 'data-tooltip' );
			check( !message, 'Tooltip message cannot be empty', 'error' );
		};

	// Iterate over the trigger elements:
	Array.prototype.forEach.call( toggles, init );

	//
	document.addEventListener( 'click', clickOut );
}());