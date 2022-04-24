import { h, render, Component } from 'preact';
import { route } from 'preact-router';
import axios from 'axios';
import classNames from 'classnames';
import actions from '../actions';
import { connect } from 'unistore/preact';
import { storeKeys } from '../language';
import InfoTitle from '../components/info_title';
import { Input, Select, Button } from '../components/form';

@connect(storeKeys, actions)
export default class EasyScout extends Component {
	state = {
		farmlist: '',
		village_id: 0,
		amount: 1,
		spy_mission: 'resources',
		all_farmlists: [],
		all_villages: [],
		error_village: false,
		error_farmlist: false,
		error_amount: false
	};

	componentWillMount() {
		this.setState({
			...this.props.feature,
		});
	}

	async componentDidMount() {
		await axios.get('/api/data?ident=villages').then(res => this.setState({ all_villages: res.data }));
		await axios.get('/api/data?ident=farmlists').then(res => this.setState({ all_farmlists: res.data }));
	}

	async submit() {
		this.setState({
			error_farmlist: (this.state.farmlist == ''),
			error_village: (this.state.village_id == 0),
			error_amount: (this.state.amount ==  0)
		});

		if (this.state.error_village || this.state.error_farmlist || this.state.error_amount) return;

		const payload = {
			list_name: this.state.farmlist,
			village_id: this.state.village_id,
			amount: this.state.amount,
			spy_mission: this.state.spy_mission,
		};

		const response = await axios.post('/api/easyscout', payload);
		if (response.data == 'success')
			route('/');
	}

	async cancel() {
		route('/');
	}

	render(props, {
		all_villages, all_farmlists,
		farmlist, village_id, amount, spy_mission,
	}) {
		const farmlist_select_class = classNames({
			select: true,
			'is-danger': this.state.error_farmlist,
		});

		const village_select_class = classNames({
			select: true,
			'is-danger': this.state.error_village,
		});

		const input_class_amount = classNames({
			input: true,
			'is-radiusless': true,
			'is-danger': this.state.error_amount,
		});

		const villages = all_villages.map(village =>
			<option
				value={ village.data.villageId }
				village_name={ village.data.name }
			>
				({village.data.coordinates.x}|{village.data.coordinates.y}) {village.data.name}
			</option>
		);

		const farmlists = all_farmlists
			.map(farmlist =>
				<option value={ farmlist.data.listName }>{ farmlist.data.listName }</option>
			);

		const spy_missions = [
			{ value: 'resources', name: this.props.lang_label_ressources },
			{ value: 'defence', name: this.props.lang_label_defence }
		].map(option =>
			<option value={ option.value }>{ option.name }</option>
		);

		return (
			<div>
				<InfoTitle
					title={ this.props.lang_easy_scout_title }
					description={ this.props.lang_easy_scout_description }
				/>

				<div className='columns'>

					<div className='column'>

						<Select
							label = { props.lang_combo_box_farmlist }
							value = { farmlist }
							onChange = { e => this.setState({ farmlist: e.target.value }) }
							options = { farmlists }
							className = { farmlist_select_class }
							icon = 'fa-cow'
						/>

						<Select
							label = { props.lang_label_spy_for }
							value = { spy_mission }
							onChange = { e => this.setState({ spy_mission: e.target.value }) }
							options = { spy_missions }
							icon = 'fa-user-secret'
						/>

					</div>

					<div className='column'>

						<Select
							label = { props.lang_combo_box_village }
							value = { village_id }
							onChange = { e => this.setState({
								village_name: e.target[e.target.selectedIndex].attributes.village_name.value,
								village_id: e.target.value
							}) }
							options = { villages }
							className = { village_select_class }
							icon='fa-home'
						/>

						<Input
							label={ props.lang_common_amount }
							placeholder={ props.lang_finder_default + ': 1' }
							value={ amount }
							onChange={ e => this.setState({ amount: e.target.value }) }
							className={ input_class_amount }
							width= '7.5em'
							icon = 'fa-sort-amount-up'
						/>

					</div>

				</div>

				<div className="columns">

					<div className="column">

						<div class="buttons">
							<Button action={ props.lang_button_send } onClick={ this.submit.bind(this) } className="is-success" icon='fa-share' />
							<Button action={ props.lang_button_cancel } onClick={ this.cancel.bind(this) } icon='fa-times' />
						</div>

					</div>

					<div className="column">
					</div>

				</div>

			</div>
		);
	}
}
