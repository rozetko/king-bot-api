import { h, render, Component } from 'preact';
import { route, getCurrentUrl } from 'preact-router';
import axios from 'axios';
import { connect } from 'unistore/preact';

import actions from '../actions';
import features from '../features';
import { storeKeys } from '../language';

@connect(`notifications,${storeKeys}`, actions)
export default class EditFeature extends Component {
	state = {
		ident: '',
		show_tips: false,
		tips_style: { display: 'none' }
	};

	componentWillMount() {
		const { ident, uuid } = this.props;

		if (!ident || !uuid) {
			this.props.add_notification('provide ident and uuid for feature to edit !', 'error');
			route('/');
			return;
		}

		const payload = {
			action: 'get',
			feature: {
				ident,
				uuid,
			}
		};

		axios.post('/api/feature', payload).then(res => {
			const { error, message, data } = res.data;

			if (error) {
				this.props.add_notification(message, 'error');
				return;
			}

			this.setState({ ...data });
		});
	}

	toggle_tips = _ => {
		const { tips_style } = this.state;
		this.setState({
			tips_style: Object.keys(tips_style).length === 0 ? { display: 'none' } : {}
		});
	};

	async submit(feature) {
		const { uuid, ident } = this.state;
		const payload = {
			action: 'update',
			feature: { uuid, ident, ...feature },
		};

		this.send_request(payload);
	}

	async delete(feature) {
		const { uuid, ident } = this.state;
		const payload = {
			action: 'delete',
			feature: { ident, uuid, ...feature },
		};

		this.send_request(payload);
	}

	async send_request(payload) {
		const response = await axios.post('/api/feature', payload);

		const { error, message, data } = response.data;

		if (error) {
			this.props.add_notification(message, 'error');
			return;
		}

		route('/');
	}

	render({ add_notification }, { ident, long_description, tips_style }) {
		if (!ident) return;

		const featureProps = {
			feature: this.state,
			submit: this.submit.bind(this),
			delete: this.delete.bind(this),
		};

		const feature = h(features[ident].component, featureProps);

		return (
			<div key={ getCurrentUrl() }>
				<h1
					className='subtitle is-4'
					style={{ marginBottom: '2rem' }}
					align='left'
				>
					{this.props[`lang_feature_${ident}`]}
					{long_description &&
						<a
							class='has-text-black'
							//onClick={ () => add_notification(this.props[`lang_feature_desc_${long_description}`], 'info') }
							onClick={ () => this.toggle_tips() }
						>
							<span class='icon is-large'>
								<i class='fas fa-info'></i>
							</span>
						</a>
					}
				</h1>
				<article class="message" style={ tips_style }>
					<div class="message-body" style={{ marginTop: '-2rem' }}>
						{this.props[`lang_feature_desc_${long_description}`]}
					</div>
				</article>
				{feature}
			</div>
		);
	}
}
