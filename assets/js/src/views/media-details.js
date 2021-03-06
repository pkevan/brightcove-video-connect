var MediaDetailsView = BrightcoveView.extend(
	{
		tagName :   'div',
		className : 'media-details',

		attributes : function () {
			return {
				'tabIndex' :     0,
				'role' :         'checkbox',
				'aria-label' :   this.model.get( 'title' ),
				'aria-checked' : false,
				'data-id' :      this.model.get( 'id' )
			};
		},

		events : {
			'click .brightcove.edit.button' :    'triggerEditMedia',
			'click .brightcove.preview.button' : 'triggerPreviewMedia',
			'click .brightcove.back.button' :    'triggerCancelPreviewMedia',
            'change #aspect-ratio' : 'toggleUnits',
            'change #video-player, #autoplay, input[name="embed-style"], input[name="sizing"], #aspect-ratio, #width, #height, #units' : 'generateShortcode',
			'change #generate-shortcode' : 'toggleShortcodeGeneration',
		},

		triggerEditMedia : function ( event ) {
			event.preventDefault();
			wpbc.broadcast.trigger( 'edit:media', this.model, this.mediaType );
		},

		triggerPreviewMedia : function ( event ) {
			event.preventDefault();
			wpbc.broadcast.trigger( 'preview:media', this.model );
		},

		triggerCancelPreviewMedia : function ( event ) {
			wpbc.broadcast.trigger( 'cancelPreview:media', this.mediaType );
		},

		toggleUnits: function( event ) {
			var value = $( '#aspect-ratio' ).val();

			if ( 'custom' === value ) {
				$( '#custom' ).show();
			} else {
                $( '#custom' ).hide();
			}
		},

		generateShortcode: function () {
			if ( 'videos' === this.mediaType ) {
				this.generateVideoShortcode();
			} else {
				this.generatePlaylistShortcode();
			}
		},

		generateVideoShortcode: function () {
			var videoId = this.model.get( 'id' ).replace( /\D/g, '' ),
				accountId = this.model.get( 'account_id' ).replace( /\D/g, '' ),
				playerId = $( '#video-player' ).val(),
				autoplay = ( $( '#autoplay' ).is( ':checked' ) ) ? 'autoplay': '',
				embedstyle = $( 'input[name="embed-style"]:checked' ).val(),
				sizing = $( 'input[name="sizing"]:checked' ).val(),
				aspectRatio = $( '#aspect-ratio' ).val(),
				minWidth = '0px',
				maxWidth = $( '#width' ).val(),
				paddingTop = '',
				width = $( '#width' ).val(),
				height = $( '#height' ).val(),
				units = $( '#units' ).val(),
				shortcode;

			if ( '16:9' === aspectRatio ) {
				paddingTop = '56';
			} else if ( '4:3' === aspectRatio ) {
				paddingTop = '75';
			} else {
				paddingTop = ( height / width * 100 );
			}

			if ( 'responsive' === sizing ) {
				width = '100';
				height = '100';
			}

			shortcode = '[bc_video video_id="' + videoId + '" account_id="' + accountId + '" player_id="' + playerId + '" ' +
				'embed="' + embedstyle + '" padding_top="' + paddingTop + '%" autoplay="' + autoplay + '" ' +
				'min_width="' + minWidth + '" max_width="' + maxWidth + '" ' +
				'width="' + width + units + '" height="' + height + units + '"' +
				']';

			$( '#shortcode' ).val( shortcode );
		},

		generatePlaylistShortcode: function () {
		    var playlistId = this.model.get( 'id' ).replace( /\D/g, '' ),
                accountId = this.model.get( 'account_id' ).replace( /\D/g, '' ),
				playerId = $( '#video-player' ).val(),
				autoplay = ( $( '#autoplay' ).is( ':checked' ) ) ? 'autoplay': '',
				embedStyle = $( 'input[name="embed-style"]:checked' ).val(),
                sizing = $( 'input[name="sizing"]:checked' ).val(),
				aspectRatio = $( '#aspect-ratio' ).val(),
				minWidth = '',
				maxWidth = '',
				paddingTop = '',
				width = $( '#width' ).val(),
				height = $( '#height' ).val(),
				units = $( '#units' ).val(),
				shortcode;

		    if ( 'in-page-vertical' === embedStyle ) {
			    shortcode = '[bc_playlist playlist_id="' + playlistId + '" account_id="' + accountId + '" player_id="' + playerId + '" ' +
				    'embed="in-page-vertical" autoplay="' + autoplay + '" ' +
				    'min_width="" max_width="" padding_top="" ' +
				    'width="' + width + units + '" height="' + height + units + '"' +
				    ']';
		    } else if ( 'in-page-horizontal' === embedStyle ) {
			    shortcode = '[bc_playlist playlist_id="' + playlistId + '" account_id="' + accountId + '" player_id="' + playerId + '" ' +
				    'embed="in-page-horizontal" autoplay="' + autoplay + '" ' +
				    'min_width="" max_width="" padding_top="" ' +
				    'width="' + width + units + '" height="' + height + units + '"' +
				    ']';
		    } else if ( 'iframe' === embedStyle ) {
			    if ( '16:9' === aspectRatio ) {
				    paddingTop = '40';
			    } else if ( '4:3' === aspectRatio ) {
				    paddingTop = '54';
			    } else {
				    paddingTop = ( height / ( width * 1.4 ) * 100 );
			    }

			    max_width = width + units;
			    min_width = '0px;'

			    if ( 'responsive' === sizing ) {
				    width = '100%';
				    height = '100%';
			    } else {
			    	width = width + units;
			    	height = height + units;
			    }

			    shortcode = '[bc_playlist playlist_id="' + playlistId + '" account_id="' + accountId + '" player_id="' + playerId + '" ' +
				    'embed="iframe" autoplay="' + autoplay + '" ' +
				    'min_width="' + min_width + '" max_width="' + max_width + '" padding_top="' + paddingTop + '%" ' +
				    'width="' + width + units + '" height="' + height + units + '"' +
				    ']';
		    }

		    $( '#shortcode' ).val( shortcode );
        },

		toggleShortcodeGeneration: function () {
		    var method = $( '#generate-shortcode' ).val(),
                $fields = $( '#video-player, #autoplay, input[name="embed-style"], input[name="sizing"], #aspect-ratio, #width, #height, #units' );

		    if ( 'manual' === method ) {
		    	$( '#shortcode' ).removeAttr( 'readonly' );
                $fields.attr( 'disabled', true );
			} else {
                $( '#shortcode' ).attr( 'readonly', true );
                $fields.removeAttr( 'disabled' );
			}
        },

		initialize : function ( options ) {
			options        = options || {};
			this.type      = options.type ? options.type : 'grid';
			this.mediaType = options.mediaType;
			this.listenTo( wpbc.broadcast, 'insert:shortcode', this.insertShortcode );
			this.listenTo( this.model, 'change', this.render );
		},

		/**
		 * @returns {wp.media.view.Media} Returns itself to allow chaining
		 */
		render : function ( options ) {
			options                     = _.extend( {}, options, this.model.toJSON() );
			options.duration            = this.model.getReadableDuration();
			options.updated_at_readable = this.model.getReadableDate( 'updated_at' );
			options.created_at_readable = this.model.getReadableDate( 'created_at' );
			options.account_name        = this.model.getAccountName();

			this.template = wp.template( 'brightcove-media-item-details-' + this.mediaType );

			this.$el.html( this.template( options ) );

			this.delegateEvents();
            this.generateShortcode();

			return this;
		},

		/* Prevent this.remove() from removing the container element for the details view */
		remove : function () {
			this.undelegateEvents();
			this.$el.empty();
			this.stopListening();
			return this;
		}
	}
);

