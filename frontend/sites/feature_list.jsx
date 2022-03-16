import { h, render, Component } from 'preact';
import axios from 'axios';
import { connect } from 'unistore/preact';

import Feature from '../components/feature';
import lang, { storeKeys } from '../language';

var jQuery = require( 'jquery' );
import 'datatables.net';
import 'datatables-bulma';

const rowStyle = {
	verticalAlign: 'middle',
	textAlign: 'center',
	whiteSpace: 'nowrap'
};

@connect(storeKeys)
export default class FeatureList extends Component {
	state = {
		features: []
	};

	async componentDidMount() {
		await axios.get('/api/allfeatures').then(({ data }) => this.setState({ features: data }));

		// TODO: Absolute sorting: https://datatables.net/plug-ins/sorting/absolute
		const table = jQuery('#table').DataTable({
			dom: 'frtip',
			order: [],
			columnDefs: [
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
							<th style={{ verticalAlign: 'middle', textAlign: 'left' }}>
								{props.lang_home_description}
							</th>
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
