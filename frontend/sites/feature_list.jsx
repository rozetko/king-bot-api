import { h, render, Component } from 'preact';
import axios from 'axios';
import { connect } from 'unistore/preact';

import Feature from '../components/feature';
import { storeKeys } from '../language';

const rowStyle = {
	verticalAlign: 'middle',
	textAlign: 'center'
};

@connect(storeKeys)
export default class FeatureList extends Component {
	state = {
		gameworld: '',
		avatar_name: '',
		features: []
	};

	async componentDidMount() {
		await axios.get('/api/data?ident=settings')
			.then(({ data }) => this.setState({ gameworld: data.gameworld, avatar_name: data.avatar_name }));
		await axios.get('/api/allfeatures').then(({ data }) => this.setState({ features: data }));
	}

	render(props, state) {
		const features = state.features
			.map(feature => <Feature feature={ feature } />);

		return (
			<div>
				<h1 className='title is-2' align='left'>
					{props.lang_navbar_king_bot_api} <span class="subtitle is-3">{state.gameworld}{state.avatar_name ? '/' + state.avatar_name : ''}</span>
				</h1>
				<table className='table is-hoverable is-fullwidth'>
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
