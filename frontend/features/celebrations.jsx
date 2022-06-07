import { h, render, Component } from 'preact';
import { route } from 'preact-router';
import axios from 'axios';
import classNames from 'classnames';
import { connect } from 'unistore/preact';
import { storeKeys } from '../language';
import CelebrationsTable from '../components/celebrations_table';
import { Select, Button } from '../components/form';

const townhall = 24;
const brewery = 35;

@connect(storeKeys)
export default class Celebrations extends Component {
	state = {
		all_villages: [],
		village_name: '',
		village_id: '',
		celebrations: [],
		building_type: 0,
		celebration_type: 0,
		celebration_type_name: '',
		button_edit: false,
		can_hold_small: false,
		can_hold_large: false,
		can_hold_brewery: false,
		error_celebrations: false,
		error_village: false,
		error_celebration_type: false
	};

	componentWillMount() {
		this.setState({
			...this.props.feature
		});

		axios.get('/api/data?ident=villages').then(res => this.setState({ all_villages: res.data }));
	}

	componentDidMount() {
		this.set_button();
	}

	set_celebration_types = async e => {
		var { village_id, celebration_type, all_villages } = this.state;

		let can_hold_small = false;
		let can_hold_large = false;
		let can_hold_brewery = false;

		// check town hall building type
		let building_type = townhall;
		let building = await axios.get(`/api/data?ident=building&village_id=${village_id}&building_type=${building_type}`);
		if (building.data) {
			can_hold_small = true;
			if (building.data.lvl >= 10 && all_villages.length > 1)
				can_hold_large = true;
		}

		// check brewery building type
		building_type = brewery;
		building = await axios.get(`/api/data?ident=building&village_id=${village_id}&building_type=${building_type}`);
		if (building.data)
			can_hold_brewery = true;

		if (celebration_type == 1 && !can_hold_small ||
			celebration_type == 2 && !can_hold_large ||
			celebration_type == 3 && !can_hold_brewery)
			celebration_type = 0;

		this.setState({ can_hold_small, can_hold_large, can_hold_brewery, celebration_type });
	};

	set_button = async e => {
		var { celebrations, village_id, building_type } = this.state;
		var exists = false;
		celebrations.forEach((celebration) => {
			if (celebration.village_id == village_id &&
				celebration.building_type == building_type)
			{
				exists = true;
				return;
			}
		});
		this.setState({	button_edit: exists });
	};

	add_celebration = async e => {
		const { celebrations, village_name, village_id,
			building_type, celebration_type, celebration_type_name } = this.state;

		this.setState({
			error_village: (this.state.village_id == 0),
			error_celebration_type: (this.state.celebration_type == 0)
		});

		if (this.state.error_village || this.state.error_celebration_type)
			return;

		const selected_celebration = {
			village_id,
			village_name,
			building_type,
			celebration_type,
			celebration_type_name
		};

		var is_already = false;
		celebrations.forEach((celebration) => {
			if (celebration.village_id != village_id)
				return;
			if (celebration.building_type != building_type)
				return;
			is_already = true;
			celebration.building_type = building_type;
			celebration.celebration_type = celebration_type;
			celebration.celebration_type_name = celebration_type_name;
		});
		if (is_already)
			return; // celebration already added
		celebrations.push(selected_celebration);
		this.setState({ celebrations, error_celebrations: false });
		this.set_button();
	};

	remove_celebration = async e => {
		const { celebrations } = this.state;
		celebrations.splice(celebrations.indexOf(e), 1);
		this.setState({ celebrations });
		this.set_button();
	};

	edit_celebration = async e => {
		this.setState({
			village_id: e.village_id,
			village_name: e.village_name,
			building_type: e.building_type,
			celebration_type: e.celebration_type,
			celebration_type_name: e.celebration_type_name,
			error_village: false,
			error_celebration_type: false
		});
		this.set_button();
		this.set_celebration_types();
	};

	async submit() {
		this.setState({
			error_celebrations: this.state.celebrations.length < 1,
			error_village: (this.state.village_id == 0),
			error_celebration_type: (this.state.celebration_type == 0)
		});

		if (this.state.error_celebrations || this.state.error_celebrations &&
			(this.state.error_village || this.state.error_celebration_type))
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
			all_villages, celebrations,
			village_id,	celebration_type, button_edit,
			can_hold_small, can_hold_large, can_hold_brewery,
		} = this.state;

		const village_select_class = classNames({
			select: true,
			'is-danger': this.state.error_village,
		});

		const celebration_select_class = classNames({
			select: true,
			'is-danger': this.state.error_celebration_type || this.state.error_celebrations,
		});

		const villages = all_villages.map(village =>
			<option
				value={ village.data.villageId }
				village_name={ village.data.name }
			>
				({village.data.coordinates.x}|{village.data.coordinates.y}) {village.data.name}
			</option>
		);

		const celebration_types = [
			{ value: 1, building_type: townhall, name: props.lang_celebration_small, disabled: !can_hold_small },
			{ value: 2, building_type: townhall, name: props.lang_celebration_large,  disabled: !can_hold_large },
			{ value: 3, building_type: brewery, name: props.lang_celebration_brewery, disabled: !can_hold_brewery }
		].map(option =>
			<option
				value={ option.value }
				building_type={ option.building_type }
				celebration_type_name={ option.name }
				disabled = { option.disabled }
			>
				{option.name}
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
								this.set_celebration_types();
							} }
							options = { villages }
							className = { village_select_class }
							icon='fa-home'
						/>

					</div>

					<div className="column">

						<label class='label'>{ props.lang_combo_box_celebrationtype }</label>
						<Select
							label = { props.lang_combo_box_celebrationtype }
							value = { celebration_type }
							onChange = { e => {
								this.setState({
									building_type: e.target[e.target.selectedIndex].attributes.building_type.value,
									celebration_type: e.target.value,
									celebration_type_name: e.target[e.target.selectedIndex].attributes.celebration_type_name.value
								});
								this.set_button();
							} }
							options = { celebration_types }
							className = { celebration_select_class }
							button = { <Button
								action = { button_edit ? props.lang_common_edit : props.lang_common_add }
								className = 'is-success'
								onClick = { this.add_celebration.bind(this) }
								icon = { button_edit ? 'fa-pen' : 'fa-plus' } /> }
							icon = 'fa-birthday-cake'
						/>

					</div>

				</div>

				<div className="columns">

					<div className="column">

						<CelebrationsTable
							content={ celebrations }
							remove_celebration={ this.remove_celebration.bind(this) }
							edit_celebration={ this.edit_celebration.bind(this) }
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
