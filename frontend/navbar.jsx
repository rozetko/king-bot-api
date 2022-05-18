import { h, render, Component } from 'preact';
import classNames from 'classnames';
import axios from 'axios';
// getCurrentUrl: https://github.com/jgthms/bulma/issues/2514#issuecomment-710771267
import { route, getCurrentUrl } from 'preact-router';
import { connect } from 'unistore/preact';

import features from './features';
import lang, { storeKeys } from './language';
import actions from './actions';

@connect('notifications,' + storeKeys, actions)
export default class NavBar extends Component {
	navbarFeatures = [];
	state = {
		gameworld: '',
		avatar_name: '',
		burger: false
	};

	componentWillMount() {
		this.availableLanguages = lang.availableLanguages.map(x =>
			<a className='navbar-item' onClick={ () =>
			{
				this.setState({ burger: false });
				lang.changeLanguage(x);
			} }>{x}</a>
		);
	}

	async componentDidMount() {
		await axios.get('/api/data?ident=settings')
			.then(({ data }) => this.setState({ gameworld: data.gameworld, avatar_name: data.avatar_name }));
	}

	show_burger = e => {
		this.setState({
			burger: !this.state.burger,
		});
	};

	get_new = async ident => {
		const payload = {
			action: 'new',
			feature: { ident },
		};

		const res = await axios.post('/api/feature', payload);

		const { error, message, data } = res.data;

		if (error) {
			this.props.add_notification(message, 'error');
			return;
		}

		const { uuid } = data;

		this.route(`/edit_feature/${ident}/${uuid}`);
	};

	route = name => {
		this.setState({ burger: false });
		route(name);
	};

	render() {
		this.navbarFeatures = Object.keys(features).filter(x => features[x].navbar)
			.map(feature =>
				h(
					'a',
					{ className: 'navbar-item', onClick: () => this.get_new(feature) },
					this.props['lang_feature_' + feature],
				)
			);

		const burger_class = classNames({
			'navbar-burger': true,
			'burger': true,
			'is-active': this.state.burger,
		});

		const menu_class = classNames({
			'navbar-menu': true,
			'is-active': this.state.burger,
		});

		return (
			<nav class="navbar is-light is-fixed-top" role="navigation" aria-label="main navigation">
				<div class="container">
					<div class="navbar-brand">
						<span class="navbar-item">
							<a href="/">
								<h1 style="margin-bottom: 0.3em; line-height: 0;" class="navbar-item title is-3">
									{this.props.lang_navbar_king_bot_api}
								</h1>
							</a>
							<span style="line-height: 0em; margin-top: 0em; margin-bottom: 0.2em;margin-left: 0.2em;" class="subtitle is-4">
								{this.state.gameworld}{this.state.avatar_name ? '/' + this.state.avatar_name : ''}
							</span>
						</span>
						<a role="button" onClick={ this.show_burger } class={ burger_class } aria-label="menu" aria-expanded="false">
							<span aria-hidden="true"></span>
							<span aria-hidden="true"></span>
							<span aria-hidden="true"></span>
						</a>
					</div>
					<div class={ menu_class }>
						<div class="navbar-start">

							<div class="navbar-item has-dropdown is-hoverable" key={ 'features' + getCurrentUrl() }>
								<a class="navbar-link">
									{this.props.lang_navbar_add_feature}
								</a>
								<div class='navbar-dropdown is-radiusless'>
									{this.navbarFeatures}
								</div>
							</div>

							<div class='navbar-item has-dropdown is-hoverable' key={ 'extras' + getCurrentUrl() }>
								<a class='navbar-link'>
									{this.props.lang_navbar_extras}
								</a>
								<div class="navbar-dropdown is-radiusless">
									<a className="navbar-item" onclick={ () => this.route('/easy_scout') }>
										{this.props.lang_navbar_easy_scout}
									</a>
									<a className="navbar-item" onclick={ () => this.route('/inactive_finder') }>
										{this.props.lang_navbar_inactive_finder}
									</a>
									<a className="navbar-item" onclick={ () => this.route('/crop_finder') }>
										{this.props.lang_navbar_crop_finder}
									</a>
									<a className="navbar-item" onclick={ () => this.route('/nature_finder') }>
										{this.props.lang_navbar_nature_finder}
									</a>
								</div>
							</div>

						</div>
						<div class="navbar-end">

							<div id="table_search" class="navbar-item">
								<div class="control has-icons-left has-icons-right">
									<input
										class = "input is-radiusless is-small"
										type = "text"
										placeholder = { this.props.lang_navbar_search }
										autocomplete = "off"
										spellcheck = "false"
										style = {{ width: '13em' }}
									/>
									<span class="icon is-small is-left">
										<i class="fas fa-search"></i>
									</span>
									<span class="icon is-small is-right" style={{ pointerEvents: 'all', cursor: 'pointer' }}>
										<i class="fas fa-times"></i>
									</span>
								</div>
							</div>

							<div class="navbar-item has-dropdown is-hoverable" key={ 'options' + getCurrentUrl() }>
								<a class="navbar-link">{this.props.lang_home_options}</a>

								<div class="navbar-dropdown is-radiusless">

									<div class="navbar-item has-dropdown is-hoverable">
										<a class="navbar-link">
											{this.props.lang_navbar_language}
										</a>
										<div class="navbar-dropdown is-radiusless">
											{this.availableLanguages}
										</div>
									</div>
									<a class="navbar-item" onclick={ () => this.route('/logger') }>
										{this.props.lang_navbar_logger}
									</a>
									<a class="navbar-item" onclick={ () => this.route('/login') }>
										{this.props.lang_navbar_change_login}
									</a>
									<a class="navbar-item" target="_blank" href="https://github.com/pkeweloh/king-bot-api">
										{this.props.lang_navbar_king_bot_api}
									</a>
									<hr class="navbar-divider" />
									<div class="navbar-item">
										v{process.env.VERSION}
									</div>
								</div>

							</div>
						</div>
					</div>
				</div>
			</nav>
		);
	}
}
