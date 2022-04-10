import { h, render, Component } from 'preact';
import axios from 'axios';
import { connect } from 'unistore/preact';

import Feature from '../components/feature';
import lang, { storeKeys } from '../language';

var jQuery = require( 'jquery' );
import 'datatables.net';
import 'datatables-bulma';
import 'plugins/datatables.absolute.js';

const rowStyle = {
	verticalAlign: 'middle',
	textAlign: 'center',
	whiteSpace: 'nowrap'
};

const rowDescStyle = {
	verticalAlign: 'middle',
	textAlign: 'left'
};

@connect(storeKeys)
export default class FeatureList extends Component {
	state = {
		features: []
	};

	async componentDidMount() {
		await axios.get('/api/allfeatures').then(({ data }) => this.setState({ features: data }));

		// Absolute sorting
		// https://datatables.net/plug-ins/sorting/absolute
		var absoluteOrder = jQuery.fn.dataTable.absoluteOrder([
			{ value: lang.translate('lang_feature_finish_earlier'), position: 'top' },
			{ value: lang.translate('lang_finish_earlier_description'), position: 'top' },
			{ value: lang.translate('lang_feature_hero'), position: 'top' },
			{ value: lang.translate('lang_adventure_short'), position: 'top' },
			{ value: lang.translate('lang_adventure_long'), position: 'top' }
		]);

		const table = jQuery('#table').DataTable({
			dom: 'frtip',
			order: [[ 0, 'asc' ], [ 1, 'asc' ]],
			columnDefs: [
				{ type: absoluteOrder, targets: [0,1] },
				{ targets: [2,3,4], orderable: false }
			],
			pageLength: 10,
			lengthChange: false,
			rowGroup: true,
			language: {
				url: '/i18n/' + lang.currentLanguage + '.json'
			}
		});

		jQuery('#table_search input').on('keyup', function () {
			if (this.value) {
				jQuery('#table_search .icon.is-right').show();
				jQuery('#table_search .icon.is-right').on('click', function() {
					jQuery('#table_search input').val('');
					jQuery('#table_search input').trigger('keyup');
				});
			}
			else {
				jQuery('#table_search .icon.is-right').hide();
			}
			table.search(this.value).draw();
		});
		jQuery('#table_search').slideDown();
		jQuery('#table_search input').trigger('keyup');
	}

	async componentWillUnmount() {
		jQuery('#table_search').slideUp();
	}

	shouldComponentUpdate(nextProps, nextState) {
		// render only if features were not already loaded
		return this.state.features.length != nextState.features.length;
	}

	render(props, state) {
		const features = state.features
			.map(feature => <Feature feature={ feature } />);

		return (
			<div>
				<table id="table" className='table is-hoverable is-fullwidth'>
					<thead>
						<tr>
							<th style={ rowStyle }>{props.lang_home_name}</th>
							<th style={ rowDescStyle }>{props.lang_home_description}</th>
							<th style={ rowStyle }>{props.lang_home_status}</th>
							<th style={ rowStyle }>{props.lang_home_off_on}</th>
							<th style={ rowStyle }>{props.lang_home_options}</th>
						</tr>
					</thead>
					<tbody>
						{features}
					</tbody>
				</table>
			</div>
		);
	}
}
