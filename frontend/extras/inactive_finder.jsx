import { h, render, Component } from 'preact';
import axios from 'axios';
import classNames from 'classnames';
import { connect } from 'unistore/preact';
import { storeKeys } from '../language';
import { handle_response } from '../actions';
import InactiveTable from '../components/inactive_table';
import InfoTitle from '../components/info_title';
import { Input, DoubleInput, Select, Button } from '../components/form';

@connect(`notifications,${storeKeys}`, handle_response)
export default class InactiveFinder extends Component {
	state = {
		selected_farmlist: '',
		village_name: '',
		village_id: 0,
		all_farmlists: [],
		all_villages: [],
		min_player_pop: '',
		max_player_pop: '',
		min_village_pop: '',
		max_village_pop: '',
		max_villages: '',
		max_evolution: '',
		days: '',
		inactives: [],
		error_village: false,
		error_farmlist: false,
		loading: false,
		message: '',
	};

	componentDidMount() {
		axios.get('/api/data?ident=villages').then(res => {
			this.setState({
				all_villages: res.data,
				village_id: res.data[0].villageId,
				village_name: res.data[0].data.name,
			});
		});

		axios.get('/api/data?ident=farmlists')
			.then(res => this.setState({ all_farmlists: res.data }));
	}

	async clicked(item) {
		const { selected_farmlist } = this.state;

		this.setState({
			error_farmlist: (selected_farmlist == '')
		});

		if (this.state.error_farmlist) return false;

		this.setState({ error_farmlist: false });

		const payload = {
			action: 'toggle',
			data: {
				farmlist: selected_farmlist,
				village: item,
			},
		};

		let response = await axios.post('/api/inactivefinder', payload);

		const { error } = response.data;

		if (error) {
			this.props.handle_response(response.data);
			return false;
		}

		return true;
	}

	async search() {
		if (this.state.loading) return;

		this.setState({
			error_village: (!this.state.village_id)
		});

		if (this.state.error_village) return;

		this.setState({ loading: true, message: '', inactives: [] });

		const {
			selected_farmlist,
			village_id,
			min_player_pop,
			max_player_pop,
			min_village_pop,
			max_village_pop,
			max_villages,
			max_evolution,
			days
		} = this.state;

		const payload_data = {
			selected_farmlist,
			village_id,
			min_player_pop,
			max_player_pop,
			min_village_pop,
			max_village_pop,
			max_villages,
			max_evolution,
			days
		};

		const payload = {
			action: 'get',
			data: payload_data,
		};

		let response = await axios.post('/api/inactivefinder', payload);

		const { error, data, message } = response.data;

		if (error) {
			this.setState({ loading: false });
			this.props.handle_response(response.data);
			return;
		}
		else {
			this.setState({ inactives: [ ...data ], loading: false });
		}

		this.setState({ message });
	}

	render(props, {
		selected_farmlist, village_id,
		all_villages, all_farmlists,
		min_player_pop, max_player_pop,
		min_village_pop, max_village_pop,
		max_villages, max_evolution, days,
		inactives, loading, message
	}) {
		const village_select_class = classNames({
			select: true,
			'is-danger': this.state.error_village,
		});

		const farmlist_select_class = classNames({
			select: true,
			'is-danger': this.state.error_farmlist,
		});

		const search_button = classNames({
			button: true,
			'is-success': true,
			'is-radiusless': true,
			'is-loading': loading,
		});

		const villages = all_villages.map(village =>
			<option
				value={ village.data.villageId }
				village_name={ village.data.name }
			>
				({village.data.coordinates.x}|{village.data.coordinates.y}) {village.data.name}
			</option>
		);

		const farmlist_opt = all_farmlists.map(farmlist =>
			<option value={ farmlist.data.listName }>
				{ farmlist.data.listName }
			</option>
		);

		return (
			<div>
				<InfoTitle
					title={ props.lang_finder_name }
					description={ props.lang_finder_description }
				/>

				<div className='columns'>

					<div className='column'>

						<Select
							label = { props.lang_finder_distance_to }
							value = { village_id }
							onChange = { e => this.setState({
								village_name: e.target[e.target.selectedIndex].attributes.village_name.value,
								village_id: e.target.value,
							}) }
							options = { villages }
							className = { village_select_class }
							icon='fa-home'
						/>

						<DoubleInput
							label = { props.lang_finder_player_pop }
							placeholder1 = { props.lang_finder_default + ': 0' }
							placeholder2 = { props.lang_finder_default + ': 1000' }
							value1 = { min_player_pop }
							value2 = { max_player_pop }
							onChange1 = { e => this.setState({ min_player_pop: e.target.value }) }
							onChange2 = { e => this.setState({ max_player_pop: e.target.value }) }
							icon = 'fa-users-crown'
							style = {{ width: '8.1em' }}
						/>

						<DoubleInput
							label = { props.lang_finder_village_pop }
							placeholder1 = { props.lang_finder_default + ': 0' }
							placeholder2 = { props.lang_finder_default + ': 1000' }
							value1 = { min_village_pop }
							value2 = { max_village_pop }
							onChange1 = { e => this.setState({ min_village_pop: e.target.value }) }
							onChange2 = { e => this.setState({ max_village_pop: e.target.value }) }
							icon = 'fa-house-user'
							style = {{ width: '8.1em' }}
						/>

						<Button
							action = { props.lang_button_search }
							className = { search_button }
							onClick = { this.search.bind(this) }
							style = {{ marginRight: '1rem' }}
							icon = 'fa-search'
						/>

					</div>

					<div className='column'>

						<Select
							label = { props.lang_finder_add_list }
							value = { selected_farmlist }
							onChange = { e => this.setState({ selected_farmlist: e.target.value }) }
							options = { farmlist_opt }
							className = { farmlist_select_class }
							icon = 'fa-cow'
						/>

						<label class='label'>{ props.lang_finder_villages_max }</label>
						<Input
							placeholder={ props.lang_finder_default + ': 3' }
							value={ max_villages }
							onChange={ e => this.setState({ max_villages: e.target.value }) }
							icon = 'fa-house'
							button = { <Button action = { props.lang_finder_villages } className = 'button is-static is-radiusless' /> }
						/>

						<div class="field">
							<label class="label">{ props.lang_finder_evolution_max }</label>
							<div class="field has-addons">
								<Input
									placeholder = { props.lang_finder_default + ': 0' }
									value = { max_evolution }
									onChange = { e => this.setState({ max_evolution: e.target.value }) }
									style = {{ width: '7.5em', marginRight: '0.85em' }}
									icon = 'fa-chart-line'
									parent_field = { false }
								/>
								<Input
									placeholder = { props.lang_finder_default + ': 7' }
									value = { days }
									onChange = { e => this.setState({ days: e.target.value }) }
									style = {{ width: '7.5em' }}
									icon = 'fa-user-slash'
									parent_field = { false }
								/>
								<Button
									action = { props.lang_finder_days }
									className = { 'is-static' }
								/>
							</div>
						</div>

						<div className='content' style={{ marginTop: '1.5rem' }}>
							{ message }
						</div>

					</div>

				</div>

				<InactiveTable
					content={ inactives }
					clicked={ this.clicked.bind(this) }
				/>

			</div>
		);
	}
}
