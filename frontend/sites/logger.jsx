
import { h, render, Component } from 'preact';
import axios from 'axios';
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
	whiteSpace: 'nowrap'
};

@connect(storeKeys)
export default class Logger extends Component {
	state = {
		log_list: [],
	};

	async componentDidMount() {
		await axios.get('/api/data?ident=logger')
			.then(res => this.setState({ log_list: res.data.reverse() }));

		jQuery('#table').DataTable({
			dom: 'rtip',
			order: [[ 0, 'desc' ]],
			pageLength: 10,
			lengthChange: false,
			language: {
				url: '/i18n/' + lang.currentLanguage + '.json'
			}
		});
	}

	shouldComponentUpdate(nextProps, nextState) {
		return this.state.log_list.length !== nextState.log_list.length;
	}

	render(props, { log_list }) {
		const logs = log_list.map(log => <Log log={ log }></Log>);

		return (
			<div>
				<table id="table" className='table is-hoverable is-fullwidth'>
					<thead>
						<tr>
							<th	style={ rowStyle }>{props.lang_log_timestamp}</th>
							<th style={ rowCenterStyle }>{props.lang_log_level}</th>
							<th style={ rowCenterStyle }>{props.lang_log_group}</th>
							<th	style={ rowStyle }>{props.lang_log_message}</th>
						</tr>
					</thead>
					<tbody>
						{ logs }
					</tbody>
				</table>
			</div>
		);
	}
}

const Log = ({ log }) => (
	<tr>
		<td style={ rowStyle }>{ log.timestamp }</td>
		<td	style={ rowCenterStyle }>{ log.level }</td>
		<td style={ rowCenterStyle }>{ log.group }</td>
		<td	style={{ ... rowStyle, whiteSpace: 'normal' }}>{ log.message }</td>
	</tr>
);
