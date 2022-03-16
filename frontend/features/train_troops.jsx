import { h, render, Component } from 'preact';
import { route } from 'preact-router';
import axios from 'axios';
import classNames from 'classnames';
import { connect } from 'unistore/preact';
import { storeKeys } from '../language';
import { Input, DoubleInput, Select, Button } from '../components/form';

@connect(storeKeys)
export default class TrainTroops extends Component {
	state = {
		all_villages: [],
		unit_types: '',
		own_tribe: 0,
		research_units: [],
		village_name: '',
		village_id: '',
		error_village: false,
		unit_type: 0,
		unit_type_name: '',
		amount: 0,
		interval_min: 0,
		interval_max: 0,
		error_amount: false,
		error_unit: false,
		error_interval_max: false,
		error_interval_min: false
	};

	componentWillMount() {
		this.setState({
			...this.props.feature
		});

		axios.get('/api/data?ident=villages').then(res => this.setState({ all_villages: res.data }));
		axios.get('/api/data?ident=player_tribe').then(res => this.setState({ own_tribe: Number(res.data) }));
		axios.get('/api/data?ident=unit_types').then(res => this.setState({ unit_types: res.data }));
	}

	componentDidMount() {
		this.set_research_units();
	}

	set_research_units = async e => {
		var { village_id, unit_type } = this.state;
		const response = await axios.get(`/api/data?ident=research&village_id=${village_id}`);
		let research_units = [];
		if (response.data != null) {
			for (let unit_data of response.data) {
				research_units[unit_data.unitType] = unit_data.canResearch;
			}
		}
		if (!research_units[unit_type])
			unit_type = 0;
		this.setState({ research_units, unit_type });
	};

	async submit() {
		this.setState({
			error_village: (this.state.village_id == 0),
			error_unit: (this.state.unit_type == 0),
			error_amount: (this.state.amount == 0),
			error_interval_min: (this.state.interval_min == 0),
			error_interval_max: (this.state.interval_max == 0)
		});

		if (this.state.error_village || this.state.error_unit || this.state.error_amount ||
			this.state.error_interval_min || this.state.error_interval_max)
			return;

		this.props.submit({ ...this.state });
	}

	async delete() {
		this.props.delete({ ...this.state });
	}

	async cancel() {
		route('/');
	}

	render(props) {
		var {
			all_villages, unit_types, own_tribe,
			village_id,	unit_type, amount,
			interval_min, interval_max,
			research_units,
		} = this.state;

		const village_select_class = classNames({
			select: true,
			'is-danger': this.state.error_village,
		});

		const unit_select_class = classNames({
			select: true,
			'is-danger': this.state.error_unit,
		});

		const input_class_amount = classNames({
			input: true,
			'is-radiusless': true,
			'is-danger': this.state.error_amount,
		});

		const input_class_min = classNames({
			input: true,
			'is-radiusless': true,
			'is-danger': this.state.error_interval_min,
		});

		const input_class_max = classNames({
			input: true,
			'is-radiusless': true,
			'is-danger': this.state.error_interval_max,
		});

		const villages = all_villages.map(village =>
			<option
				value={ village.data.villageId }
				village_name={ village.data.name }
			>
				({village.data.coordinates.x}|{village.data.coordinates.y}) {village.data.name}
			</option>
		);

		var tribe_units = [];
		if (own_tribe != 0 && unit_types != '') {
			tribe_units = [
				{
					unit_type: unit_types[own_tribe][1].unit_type,
					name: props.lang_unit_types[own_tribe][1],
					disabled: research_units
						? !research_units[unit_types[own_tribe][1].unit_type]
						: false,
				},
				{
					unit_type: unit_types[own_tribe][2].unit_type,
					name: props.lang_unit_types[own_tribe][2],
					disabled: research_units
						? !research_units[unit_types[own_tribe][2].unit_type]
						: false,
				},
				{
					unit_type: unit_types[own_tribe][3].unit_type,
					name: props.lang_unit_types[own_tribe][3],
					disabled: research_units
						? !research_units[unit_types[own_tribe][3].unit_type]
						: false,
				},
				{
					unit_type: unit_types[own_tribe][4].unit_type,
					name: props.lang_unit_types[own_tribe][4],
					disabled: research_units
						? !research_units[unit_types[own_tribe][4].unit_type]
						: false,
				},
				{
					unit_type: unit_types[own_tribe][5].unit_type,
					name: props.lang_unit_types[own_tribe][5],
					disabled: research_units
						? !research_units[unit_types[own_tribe][5].unit_type]
						: false,
				},
				{
					unit_type: unit_types[own_tribe][6].unit_type,
					name: props.lang_unit_types[own_tribe][6],
					disabled: research_units
						? !research_units[unit_types[own_tribe][6].unit_type]
						: false,
				},
				{
					unit_type: unit_types[own_tribe][7].unit_type,
					name: props.lang_unit_types[own_tribe][7],
					disabled: research_units
						? !research_units[unit_types[own_tribe][7].unit_type]
						: false,
				},
				{
					unit_type: unit_types[own_tribe][8].unit_type,
					name: props.lang_unit_types[own_tribe][8],
					disabled: research_units
						? !research_units[unit_types[own_tribe][8].unit_type]
						: false,
				},
			];
		}
		const own_troops = tribe_units.map(troop =>
			<option
				value={ troop.unit_type }
				unit_type_name={ troop.name }
				disabled = { troop.disabled }
			>
				{troop.name}
			</option>
		);

		return (
			<div>
				<div className="columns">

					<div className="column">

						<Select
							label = { props.lang_combo_box_village }
							value = { village_id }
							onChange = { e => {
								this.setState({
									village_name: e.target[e.target.selectedIndex].attributes.village_name.value,
									village_id: e.target.value
								});
								this.set_research_units();
							} }
							options = { villages }
							className = { village_select_class }
							icon='fa-home'
						/>

						<DoubleInput
							label = { props.lang_common_interval }
							placeholder1 = { props.lang_common_min }
							placeholder2 = { props.lang_common_max }
							value1 = { interval_min }
							value2 = { interval_max }
							onChange1 = { e => this.setState({ interval_min: e.target.value }) }
							onChange2 = { e => this.setState({ interval_max: e.target.value }) }
							class1 = { input_class_min }
							class2 = { input_class_max }
							icon = 'fa-stopwatch'
						/>

					</div>

					<div className='column'>

						<Select
							label = { props.lang_combo_box_unittype }
							value = { unit_type }
							onChange = { e => this.setState({
								unit_type_name: e.target[e.target.selectedIndex].attributes.unit_type_name.value,
								unit_type: e.target.value,
							}) }
							options = { own_troops }
							className = { unit_select_class }
							icon = 'fa-helmet-battle'
						/>

						<Input
							label={ props.lang_common_amount }
							//placeholder='0: max'
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
							<Button action={ props.lang_button_submit } onClick={ this.submit.bind(this) } className="is-success" icon='fa-check' />
							<Button action={ props.lang_button_cancel } onClick={ this.cancel.bind(this) } icon='fa-times' />
							<Button action={ props.lang_button_delete } onClick={ this.delete.bind(this) } className="is-danger" icon='fa-trash-alt' />
						</div>

					</div>

					<div className="column">
					</div>

				</div>

			</div>
		);
	}
}
