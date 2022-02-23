import { h, render, Component } from 'preact';
import { route } from 'preact-router';
import axios from 'axios';
import classNames from 'classnames';
import { connect } from 'unistore/preact';
import { storeKeys } from '../language';
import { Input, DoubleInput, Select, Button } from '../components/form';

@connect(storeKeys)
export default class ImproveTroops extends Component {
	state = {
		all_villages: [],
		unit_types: '',
		own_tribe: 0,
		village_name: '',
		village_id: '',
		unit_type: 0,
		unit_type_name: '',
		level: 0,
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

	async submit() {
		this.setState({
			error_village: (this.state.village_id == 0),
			error_unit_type: (this.state.unit_type == 0),
			error_level: (this.state.level == 0)
		});

		if (this.state.error_village || this.state.error_unit_type || this.state.error_level)
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
			village_id,	unit_type, level
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

		const range = (start, end) => Array.from(Array(end - start + 1).keys()).map(x => x + start);
		const levels = range(1, 20).map(option =>
			<option	value={ option }>{option}</option>
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
				{ unit_type: unit_types[own_tribe][1].unit_type, name: unit_types[own_tribe][1].name },
				{ unit_type: unit_types[own_tribe][2].unit_type, name: unit_types[own_tribe][2].name },
				{ unit_type: unit_types[own_tribe][3].unit_type, name: unit_types[own_tribe][3].name },
				{ unit_type: unit_types[own_tribe][4].unit_type, name: unit_types[own_tribe][4].name },
				{ unit_type: unit_types[own_tribe][5].unit_type, name: unit_types[own_tribe][5].name },
				{ unit_type: unit_types[own_tribe][6].unit_type, name: unit_types[own_tribe][6].name },
				{ unit_type: unit_types[own_tribe][7].unit_type, name: unit_types[own_tribe][7].name },
				{ unit_type: unit_types[own_tribe][8].unit_type, name: unit_types[own_tribe][8].name }
			];
		}
		const own_troops = tribe_units.map(troop =>
			<option
				value={ troop.unit_type }
				unit_type_name={ troop.name }
			>
				{troop.name}
			</option>
		);

		return (
			<div>
				<div className="columns">

					<div className='column'>

						<Select
							label = 'select unit'
							value = { unit_type }
							onChange = { e => this.setState({
								unit_type_name: e.target[e.target.selectedIndex].attributes.unit_type_name.value,
								unit_type: e.target.value,
							}) }
							options = { own_troops }
							className = { unit_select_class }
							icon = 'fa-helmet-battle'
						/>

						<Select
							label={ props.lang_queue_level }
							value={ level }
							onChange={ e => this.setState({ level: e.target.value }) }
							options = { levels }
							className={ level_select_class }
							width= '7.5em'
							icon = 'fa-sort-amount-up'
						/>

					</div>

					<div className="column">

						<Select
							label = { props.lang_combo_box_select_village }
							value = { village_id }
							onChange = { e => this.setState({
								village_name: e.target[e.target.selectedIndex].attributes.village_name.value,
								village_id: e.target.value,
							}) }
							options = { villages }
							className = { village_select_class }
							icon='fa-home'
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
