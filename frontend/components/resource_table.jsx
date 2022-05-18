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
export default class ResourceTable extends Component {

	table = null;

	createTable() {
		if (this.table)
			this.table.destroy();
		this.table = jQuery('#table').DataTable({
			dom: 'ritp',
			pageLength: 25,
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
		const list = content.map(item => <Resource content={ item } props={ props } />);

		return (
			<div>
				<table id="table" className='table is-hoverable is-fullwidth'>
					<thead>
						<tr>
							<th style={ rowCenterStyle }>{props.lang_table_distance}</th>
							<th style={ rowCenterStyle }>{props.lang_table_coordinates}</th>
							<th style={ rowStyle }>{props.lang_table_type}</th>
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

class Resource extends Component {

	render({ content, props }) {
		const {
			id, x, y, res_type, bonus, playerId, player_name, distance, free
		} = content;

		const coordinates = `(${x}|${y})`;

		let oasis_type;
		switch (res_type) {
			case '5436':
			case '5346':
				oasis_type = '10';
				break;
			case '4536':
			case '3546':
				oasis_type = '20';
				break;
			case '4356':
			case '3456':
				oasis_type = '30';
				break;
		}

		return (
			<tr>
				<td style={ rowCenterStyle }>
					{ Number(distance).toFixed(1) }
				</td>
				<td style={ rowCenterStyle } title={ `id: ${id}` }>
					{ coordinates }
				</td>
				<td style={ rowStyle }>
					<div style={{ display: 'inline-flex', alignItems: 'center', verticalAlign: 'text-top' }}>
						{ oasis_type && <i class={ `oasis oasis${oasis_type}` } title={ props.lang_oasis_types[oasis_type] }></i> }
						<span style={{ paddingLeft: '0.2em', paddingRight: '0.4em' }}>{ res_type }</span>
					</div>
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
