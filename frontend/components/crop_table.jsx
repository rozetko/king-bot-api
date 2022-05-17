import { h, render, Component } from 'preact';
import { connect } from 'unistore/preact';
import lang, { storeKeys } from '../language';

var jQuery = require( 'jquery' );
import 'datatables.net';
import 'datatables-bulma';

const rowStyle = {
	verticalAlign: 'middle',
	textAlign: 'left',
	whiteSpace: 'nowrap'
};

const rowCenterStyle = {
	verticalAlign: 'middle',
	textAlign: 'center',
};

@connect(storeKeys)
export default class CropTable extends Component {

	table = null;

	createTable() {
		if (this.table)
			this.table.destroy();
		this.table = jQuery('#table').DataTable({
			dom: 'ritp',
			pageLength: 10,
			lengthChange: false,
			language: {
				url: '/i18n/' + lang.currentLanguage + '.json'
			}
		});
		if (jQuery('table').length > 1)
			jQuery('table')[1].remove();
	}

	componentDidMount() {
		this.createTable();
	}

	componentDidUpdate(prevProps) {
		if (this.props.content.length !== prevProps.content.length)
			this.createTable();
	}

	shouldComponentUpdate(nextProps) {
		return this.props.content.length !== nextProps.content.length;
	}

	render(props) {
		const { content } = props;
		const list = content.map(item => <Crop content={ item } />);

		return (
			<div>
				<table id="table" className='table is-hoverable is-fullwidth'>
					<thead>
						<tr>
							<th style={ rowCenterStyle }>{props.lang_table_distance}</th>
							<th style={ rowCenterStyle }>{props.lang_table_coordinates}</th>
							<th style={ rowCenterStyle }>{props.lang_table_type}</th>
							<th style={ rowStyle }>{props.lang_table_bonus}</th>
							<th style={ rowCenterStyle }>{props.lang_table_free}</th>
						</tr>
					</thead>
					<tbody>{list}</tbody>
				</table>
			</div>
		);
	}
}

class Crop extends Component {

	render({ content }) {
		const {
			id, x, y, is_15c, bonus, playerId, player_name, distance, free
		} = content;

		const coordinates = `(${x}|${y})`;

		return (
			<tr>
				<td style={ rowCenterStyle }>
					{ Number(distance).toFixed(1) }
				</td>
				<td style={ rowCenterStyle } title={ `id: ${id}` }>
					{ coordinates }
				</td>
				<td style={ rowCenterStyle }>
					{ is_15c ? '15c' : '9c' }
				</td>
				<td style={ rowStyle }>
					{ bonus }%
				</td>
				<td style={ rowCenterStyle }  title={ `playerId: ${playerId}` }>
					{ free &&
					<a class="has-text-black">
						<span class='icon is-medium'>
							<i class='fas fa-lg fa-check'></i>
						</span>
					</a>
					|| player_name }
				</td>
			</tr>
		);
	}
}
