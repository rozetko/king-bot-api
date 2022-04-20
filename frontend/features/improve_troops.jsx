import { h, render, Component } from 'preact';
import { route } from 'preact-router';
import axios from 'axios';
import classNames from 'classnames';
import { connect } from 'unistore/preact';
import { storeKeys } from '../language';
import UnitTypeTable from '../components/units_improve_table';
import { Select, Button } from '../components/form';

@connect(storeKeys)
export default class ImproveTroops extends Component {
	state = {
		all_villages: [],
		unit_types: '',
		own_tribe: 0,
		research_units: [],
		research_level: 0,
		village_name: '',
		village_id: '',
		units: [],
		unit_type: 0,
		unit_type_name: '',
		level: 0,
		button_edit: false,
		error_units: false,
		error_village: false,
		error_unit_type: false,
		error_level: false
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
		this.set_button();
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

	set_research_level = async e => {
		var { village_id, level } = this.state;
		const building_type = 13;
		const response = await axios.get(`/api/data?ident=building&village_id=${village_id}&building_type=${building_type}`);
		let research_level = 0;
		if (response.data) {
			research_level = response.data.lvl;
		}
		if (Number(level) > Number(research_level) || Number(research_level) == 0)
			level = 0;
		this.setState({ research_level, level });
	};

	set_button = async e => {
		var { units, village_id, unit_type } = this.state;
		var exists = false;
		units.forEach((unit) => {
			if (unit.village_id == village_id &&
				unit.unit_type == unit_type) {
				exists = true;
				return;
			}
		});
		this.setState({	button_edit: exists });
	};

	add_unit = async e => {
		const { village_name, village_id, unit_type, unit_type_name, level, units } = this.state;

		this.setState({
			error_village: (this.state.village_id == 0),
			error_unit_type: (this.state.unit_type == 0),
			error_level: (this.state.level == 0)
		});

		if (this.state.error_village || this.state.error_unit_type || this.state.error_level)
			return;

		const selected_unit = {
			village_id,
			village_name,
			unit_type,
			unit_type_name,
			level
		};

		var is_already = false;
		units.forEach((unit) => {
			if (unit.village_id != village_id)
				return;
			if (unit.unit_type != unit_type)
				return;
			is_already = true;
			unit.level = level;
		});
		if (is_already)
			return; // unit already added
		units.push(selected_unit);
		this.setState({ units });
		this.set_button();
	};

	remove_unit = async e => {
		const { units } = this.state;
		units.splice(units.indexOf(e), 1);
		this.setState({ units });
		this.set_button();
	};

	edit_unit = async e => {
		this.setState({
			village_id: e.village_id,
			village_name: e.village_name,
			unit_type: e.unit_type,
			unit_type_name: e.unit_type_name,
			level: e.level,
			error_village: false,
			error_unit_type: false,
			error_level: false
		});
		this.set_button();
		this.set_research_units();
		this.set_research_level();
	};

	async submit() {
		this.setState({
			error_units: this.state.units.length < 1,
			error_village: (this.state.village_id == 0),
			error_unit_type: (this.state.unit_type == 0),
			error_level: (this.state.level == 0)
		});

		if (this.state.error_units || this.state.error_village ||
			this.state.error_unit_type || this.state.error_level)
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
			village_id,	unit_type, level, units,
			research_units, research_level,
			button_edit
		} = this.state;

		const village_select_class = classNames({
			select: true,
			'is-danger': this.state.error_village,
		});

		const unit_select_class = classNames({
			select: true,
			'is-danger': this.state.error_unit_type,
		});

		const level_select_class = classNames({
			select: true,
			'is-danger': this.state.error_level,
		});

		const range = [];
		for (let level = 1; level <= 20; level++) {
			range.push({ level, disabled: level > research_level });
		}
		range.push({ level: -1, disabled: research_level == 0 });
		const levels = range.map(option =>
			<option	value={ option.level } disabled={ option.disabled }>
				{option.level == -1 ? `(${props.lang_common_max})` : option.level}
			</option>
		);

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
									village_id: e.target.value,
								});
								this.set_button();
								this.set_research_units();
								this.set_research_level();
							} }
							options = { villages }
							className = { village_select_class }
							icon='fa-home'
						/>

					</div>

					<div className='column'>

						<label class='label'>{ props.lang_combo_box_unittype }</label>
						<Select
							label = { props.lang_combo_box_unittype }
							value = { unit_type }
							onChange = { e => {
								this.setState({
									unit_type_name: e.target[e.target.selectedIndex].attributes.unit_type_name.value,
									unit_type: e.target.value
								});
								this.set_button();
							} }
							options = { own_troops }
							className = { unit_select_class }
							button = { <Button
								action = { button_edit ? props.lang_common_add_edit : props.lang_common_add_unit }
								className = 'is-success'
								onClick = { this.add_unit.bind(this) }
								icon = { button_edit ? 'fa-pen' : 'fa-plus' } /> }
							icon = 'fa-helmet-battle'
						/>

						<Select
							label={ props.lang_combo_box_level }
							value={ level }
							onChange={ e => this.setState({ level: e.target.value }) }
							options = { levels }
							className={ level_select_class }
							icon = 'fa-sort-amount-up'
						/>

					</div>

				</div>

				<div className="columns">

					<div className="column">

						<UnitTypeTable
							content={ units }
							remove_unit={ this.remove_unit.bind(this) }
							edit_unit={ this.edit_unit.bind(this) }
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
