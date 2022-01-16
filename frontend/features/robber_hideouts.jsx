import { h, render, Component } from 'preact';
import { route } from 'preact-router';
import axios from 'axios';
import classNames from 'classnames';
import { connect } from 'unistore/preact';
import { storeKeys } from '../language';
import { DoubleInput, Select, Button, Help } from '../components/form';

@connect(storeKeys)
export default class RoberHideouts extends Component {
	state = {
		own_tribe: 0,
		all_villages: [],
		unit_types: [],
		village_name: null,
		village_id: 0,
		interval_min: 0,
		interval_max: 0,
		target_x: '',
		target_y: '',
		target_style: null,
		target_help: 'fill x and y coordinates from any robber hideout',
		target_help_css: 'help',
		robber1_village_id: 0,
		robber2_village_id: 0,
		t1: 0,
		t2: 0,
		t3: 0,
		t4: 0,
		t5: 0,
		t6: 0,
		t7: 0,
		t8: 0,
		t9: 0,
		t10: 0,
		t11: 0,
		mission_type: 0,
		mission_type_name: null,
		error_village: false,
		error_interval_min: false,
		error_interval_max: false,
		error_target_x: false,
		error_target_y: false,
		error_mission_type: false
	};

	componentWillMount() {
		this.setState({
			...this.props.feature
		});

		axios.get('/api/data?ident=villages').then(res => this.setState({ all_villages: res.data }));
		axios.get('/api/data?ident=player_tribe').then(res => this.setState({ own_tribe: Number(res.data) }));
		axios.get('/api/data?ident=unit_types').then(res => this.setState({ unit_types: res.data }));
	}

	setRobbers = async e => {
		this.setState({
			error_target_x: (this.state.target_x == ''),
			error_target_y: (this.state.target_y == '')
		});

		if (this.state.error_target_x || this.state.error_target_y)
			return;

		let { target_help, target_help_css } = this.state;

		const { target_x, target_y } = this.state;
		var x = Number(target_x);
		var y = Number(target_y);
		const location_id = 536887296 + x + (y * 32768);
		var location_response = await axios.post('/api/find', [`MapDetails: ${location_id}`]);
		if (location_response.data.errors) {
			target_help = `error: ${location_response.data.errors[0].message}`;
			target_help_css = 'help is-danger';
			this.setState({
				target_help, target_help_css,
				error_target_x: true, error_target_y: true
			});
			return;
		}

		const location_data = location_response.data[0].data;
		if (!location_data.hasNPC) {
			target_help = 'error: not a robber village';
			target_help_css = 'help is-danger';
			this.setState({
				target_help, target_help_css,
				error_target_x: true, error_target_y: true
			});
			return;
		}

		var robber1_village_id = Number(location_data.hasNPC);
		// try to find robber2 increasing the value
		var robber2_village_id = Number(robber1_village_id) - 1; // negative add

		var village_response = await axios
			.post('/api/find', [`Village: ${robber2_village_id}`]);
		if (!village_response.data[0].data) {
			// if not found, try subtracting
			robber2_village_id = robber1_village_id; // set correct orders
			robber1_village_id = Number(robber1_village_id) + 1; // negative sub

			village_response = await axios
				.post('/api/find', [`Village: ${robber1_village_id}`]);
			if (!village_response.data[0].data) {
				target_help = 'error: unable to find robber village 2!';
				target_help_css = 'help is-danger';
				this.setState({
					target_help, target_help_css,
					error_target_x: true, error_target_y: true
				});
				return;
			}
		}

		target_help = 'successfully registered robber villages!';
		target_help_css = 'help is-success';
		this.setState({ robber1_village_id, robber2_village_id, target_help, target_help_css });
		setTimeout(async e => {
			this.setState({ target_style: { display: 'none' } });
		}, 3000 );
	};

	submit = async e => {
		const robbersAreRegistered = this.state.robber1_village_id != 0 ||
								this.state.robber2_village_id != 0;
		this.setState({
			error_village: (this.state.village_id == 0),
			error_interval_min: (this.state.interval_min == 0),
			error_interval_max: (this.state.interval_max == 0),
			error_mission_type: (this.state.mission_type == 0),
			error_target_x: (!robbersAreRegistered),
			error_target_y: (!robbersAreRegistered)
		});

		if (this.state.error_village || this.state.error_mission_type ||
			this.state.error_interval_min || this.state.error_interval_max ||
			this.state.error_target_x || this.state.error_target_y) return;

		this.props.submit({ ...this.state });
	};

	delete = async e => {
		this.props.delete({ ...this.state });
	};

	cancel = async e => {
		route('/');
	};

	render(props) {
		var { all_villages, own_tribe, unit_types,
			interval_min, interval_max,
			target_x, target_y,
			target_style, target_help, target_help_css,
			village_id, mission_type,
			t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11
		} = this.state;

		const robbersAreRegistered =
			this.state.robber1_village_id != 0 || this.state.robber2_village_id != 0;

		if (target_help_css == 'help' && robbersAreRegistered)
			target_style = { display: 'none' };

		const row_style = {
			verticalAlign: 'middle',
			textAlign: 'center',
		};

		var toggle_icon = classNames({
			fas: true,
			'fa-lg': true,
			'fa-times-circle': !robbersAreRegistered,
			'fa-check-circle': robbersAreRegistered,
		});
		var toggle_span = classNames({
			icon: true,
			'is-medium': true,
			'has-text-danger': !robbersAreRegistered,
			'has-text-success': robbersAreRegistered,
		});

		var class_name;
		switch (own_tribe) {
			case 1: class_name = 'unitSmall roman unitType'; break;
			case 2: class_name = 'unitSmall teuton unitType'; break;
			case 3: class_name = 'unitSmall gaul unitType'; break;
		}
		var new_rows = [];
		if (own_tribe != 0 && unit_types.length != 0) {
			new_rows = [
				<th style={ row_style }> <i class={ class_name + 1 } title={ unit_types[own_tribe][1].name }></i> </th>,
				<th style={ row_style }> <i class={ class_name + 2 } title={ unit_types[own_tribe][2].name }></i> </th>,
				<th style={ row_style }> <i class={ class_name + 3 } title={ unit_types[own_tribe][3].name }></i> </th>,
				<th style={ row_style }> <i class={ class_name + 4 } title={ unit_types[own_tribe][4].name }></i> </th>,
				<th style={ row_style }> <i class={ class_name + 5 } title={ unit_types[own_tribe][5].name }></i> </th>,
				<th style={ row_style }> <i class={ class_name + 6 } title={ unit_types[own_tribe][6].name }></i> </th>,
				<th style={ row_style }> <i class={ class_name + 7 } title={ unit_types[own_tribe][7].name }></i> </th>,
				<th style={ row_style }> <i class={ class_name + 8 } title={ unit_types[own_tribe][8].name }></i> </th>,
				<th style={ row_style }> <i class={ class_name + 9 } title={ unit_types[own_tribe][9].name }></i> </th>,
				<th style={ row_style }> <i class={ class_name + 10 } title={ unit_types[own_tribe][10].name }></i> </th>,
				<th style={ row_style }> <i class={ 'unitSmall hero_illu' } title={ 'Hero' }></i> </th>
			];
		}

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

		const input_class_x = classNames({
			input: true,
			'is-radiusless': true,
			'is-danger': this.state.error_target_x,
		});

		const input_class_y = classNames({
			input: true,
			'is-radiusless': true,
			'is-danger': this.state.error_target_y,
		});

		const village_select_class = classNames({
			select: true,
			'is-danger': this.state.error_village
		});

		const missiontype_select_class = classNames({
			select: true,
			'is-danger': this.state.error_mission_type
		});

		const villages = all_villages.map(village =>
			<option
				value={ village.data.villageId }
				village_name={ village.data.name }
			>
				({village.data.coordinates.x}|{village.data.coordinates.y}) {village.data.name}
			</option>
		);

		const mission_types = [
			{ value: 3, name: 'Attack' },
			{ value: 4, name: 'Raid' },
			{ value: 47, name: 'Siege' }
		].map(option =>
			<option
				value={ option.value }
				mission_type_name={ option.name }
			>
				{option.name}
			</option>
		);

		return (
			<div>
				<div className="columns">

					<div className="column">

						<label class="label">
							<span>robbers registered</span>
							<span class={ toggle_span }>
								<i class={ toggle_icon }></i>
							</span>
						</label>

						<DoubleInput
							label = 'target (x / y)'
							placeholder1 = { 'x' }
							placeholder2 = { 'y' }
							value1 = { target_x }
							value2 = { target_y }
							onChange1 = { e => this.setState({ target_x: e.target.value }) }
							onChange2 = { e => this.setState({ target_y: e.target.value }) }
							class1 = { input_class_x }
							class2 = { input_class_y }
							parent_style = { target_style }
							button = { <Button action = 'set robbers' className = 'is-success' onClick = { this.setRobbers } icon = 'fa-campground' /> }
							help = { <Help className = { target_help_css } content = { target_help } /> }
							icon = 'fa-map-marker-alt'
						/>

						<DoubleInput
							label = { props.lang_farmlist_interval }
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

						<Select
							label = { 'mission type' }
							value = { mission_type }
							onChange = { e => this.setState({
								mission_type_name: e.target[e.target.selectedIndex].attributes.mission_type_name.value,
								mission_type: e.target.value,
							}) }
							options = { mission_types }
							className = { missiontype_select_class }
							icon = 'fa-bullseye-arrow'
						/>

					</div>

				</div>

				<div class="columns">

					<div class="column">

						<table className="table is-hoverable is-fullwidth">
							<thead>
								<tr>
									{new_rows}
								</tr>
							</thead>
							<tbody>
								<tr>
									<td style={ row_style }>
										<input
											style="width: 30px;"
											type="text"
											value={ t1 }
											placeholder="t1"
											onChange={ async e => {
												this.setState({ t1: e.target.value });
											} }
										/>
									</td>
									<td style={ row_style }>
										<input
											style="width: 30px;"
											type="text"
											value={ t2 }
											placeholder="t2"
											onChange={ async e => {
												this.setState({ t2: e.target.value });
											} }
										/>
									</td>
									<td style={ row_style }>
										<input
											style="width: 30px;"
											type="text"
											value={ t3 }
											placeholder="t3"
											onChange={ async e => {
												this.setState({ t3: e.target.value });
											} }
										/>
									</td>
									<td style={ row_style }>
										<input
											style="width: 30px;"
											type="text"
											value={ t4 }
											placeholder="t4"
											onChange={ async e => {
												this.setState({ t4: e.target.value });
											} }
										/>
									</td>
									<td style={ row_style }>
										<input
											style="width: 30px;"
											type="text"
											value={ t5 }
											placeholder="t5"
											onChange={ async e => {
												this.setState({ t5: e.target.value });
											} }
										/>
									</td>
									<td style={ row_style }>
										<input
											style="width: 30px;"
											type="text"
											value={ t6 }
											placeholder="t6"
											onChange={ async e => {
												this.setState({ t6: e.target.value });
											} }
										/>
									</td>
									<td style={ row_style }>
										<input
											style="width: 30px;"
											type="text"
											value={ t7 }
											placeholder="t7"
											onChange={ async e => {
												this.setState({ t7: e.target.value });
											} }
										/>
									</td>
									<td style={ row_style }>
										<input
											style="width: 30px;"
											type="text"
											value={ t8 }
											placeholder="t8"
											onChange={ async e => {
												this.setState({ t8: e.target.value });
											} }
										/>
									</td>
									<td style={ row_style }>
										<input
											style="width: 30px;"
											type="text"
											value={ t9 }
											placeholder="t9"
											onChange={ async e => {
												this.setState({ t9: e.target.value });
											} }
										/>
									</td>
									<td style={ row_style }>
										<input
											style="width: 30px;"
											type="text"
											value={ t10 }
											placeholder="t10"
											onChange={ async e => {
												this.setState({ t10: e.target.value });
											} }
										/>
									</td>
									<td style={ row_style }>
										<input
											type="checkbox"
											value={ t11 }
											onChange={ async e => {
												this.setState({ t11: e.target.checked ? 1 : 0 });
											} }
										/>
									</td>
								</tr>
							</tbody>
						</table>

					</div>

				</div>

				<div className="columns">

					<div className="column">

						<div class="buttons">
							<Button action={ props.lang_button_submit } onClick={ this.submit } className="is-success" icon='fa-check' />
							<Button action={ props.lang_button_cancel } onClick={ this.cancel } icon='fa-times' />
							<Button action={ props.lang_button_delete } onClick={ this.delete } className="is-danger" icon='fa-trash-alt' />
						</div>

					</div>

					<div className="column">
					</div>

				</div>

			</div>
		);
	}
}
