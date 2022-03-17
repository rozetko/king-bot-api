
import { h, render, Component } from 'preact';
import axios from 'axios';
import { connect } from 'unistore/preact';
import { storeKeys } from '../language';

const rowStyle = {
	verticalAlign: 'middle',
	textAlign: 'center',
};

@connect(storeKeys)
export default class Logger extends Component {
	state = {
		log_list: [],
	};

	componentDidMount() {
		axios.get('/api/data?ident=logger')
			.then(res => this.setState({ log_list: res.data.reverse() }));
	}

	render(props, { log_list }) {

		const logs = log_list.map(log => <Log log={ log }></Log>);

		return (
			<div>
				<table className='table is-hoverable is-fullwidth'>
					<thead>
						<tr>
							<th
								style={{ verticalAlign: 'middle', textAlign: 'left' }}
							>{props.lang_log_timestamp}</th>
							<th style={ rowStyle }>{props.lang_log_level}</th>
							<th style={ rowStyle }>{props.lang_log_group}</th>
							<th
								style={{ verticalAlign: 'middle', textAlign: 'left' }}
							>{props.lang_log_message}</th>
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
		<td
			style={{ verticalAlign: 'middle', textAlign: 'left' }}
		>{ log.timestamp }</td>
		<td
			style={{ verticalAlign: 'middle', textAlign: 'center' }}
		>{ log.level }</td>
		<td
			style={{ verticalAlign: 'middle', textAlign: 'center' }}
		>{ log.group }</td>
		<td
			style={{ verticalAlign: 'middle', textAlign: 'left' }}
		>{ log.message }</td>
	</tr>
);
