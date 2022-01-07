import { h, render, Component } from 'preact';
import { route } from 'preact-router';
import axios from 'axios';
import classNames from 'classnames';
import { connect } from 'unistore/preact';
import { storeKeys } from '../language';

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
		this.hide_target();
		this.setState({ robber1_village_id, robber2_village_id, target_help, target_help_css });
	};

	hide_target = async e => {
		let { target_style } = this.state;
		setTimeout(async e => {
			this.setState({ target_style });
		}, 10000 );
	};

	submit = async e => {
		var robbersRegistered = this.state.robber1_village_id != 0 ||
								this.state.robber2_village_id != 0;
		this.setState({
			error_village: (this.state.village_id == 0),
			error_interval_min: (this.state.interval_min == 0),
			error_interval_max: (this.state.interval_max == 0),
			error_mission_type: (this.state.mission_type == 0),
			error_target_x: (!robbersRegistered),
			error_target_y: (!robbersRegistered)
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

		const row_style = {
			verticalAlign: 'middle',
			textAlign: 'center',
		};

		var robbersRegistered = this.state.robber1_village_id != 0 ||
								this.state.robber2_village_id != 0;
		var toggle_icon = classNames({
			fas: true,
			'fa-lg': true,
			'fa-times-circle': !robbersRegistered,
			'fa-check-circle': robbersRegistered,
		});
		var toggle_span = classNames({
			icon: true,
			'is-medium': true,
			'has-text-danger': !robbersRegistered,
			'has-text-success': robbersRegistered,
		});
		target_style = robbersRegistered ? { display: 'none' } : '';

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
			'is-radiusless': true,
			'is-danger': this.state.error_village
		});

		const missiontype_select_class = classNames({
			select: true,
			'is-radiusless': true,
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

		const missionTypes = [
			{ value: 3, name: 'Attack' },
			{ value: 4, name: 'Raid' },
			{ value: 47, name: 'Siege' }
		];
		const mission_types = missionTypes.map(type =>
			<option
				value={ type.value }
				mission_type_name={ type.name }
			>
				{type.name}
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
						<div class='field' style={ target_style }>
							<label class='label'>target (x / y)</label>
							<input
								class={ input_class_x }
								style={{ width: '80px', marginRight: '10px' }}
								type='text'
								value={ target_x }
								placeholder= "x"
								onChange={ e => this.setState({ target_x: e.target.value }) }
							/>
							<input
								class={ input_class_y }
								style={{ width: '80px', marginRight: '10px' }}
								type='text'
								value={ target_y }
								placeholder="y"
								onChange={ e => this.setState({ target_y: e.target.value }) }
							/>
							<button className='button is-radiusless is-success' onClick={ this.setRobbers }>
								register robbers
							</button>
							<p class={ target_help_css }>{target_help}</p>
						</div>


						<div class='field'>
							<label style={{ marginTop: '2rem' }} class='label'>{props.lang_farmlist_interval}</label>
							<input
								class={ input_class_min }
								style={{ width: '150px', marginRight: '10px' }}
								type='text'
								value={ interval_min }
								placeholder={ props.lang_common_min }
								onChange={ e => this.setState({ interval_min: e.target.value }) }
							/>
							<input
								class={ input_class_max }
								style={{ width: '150px' }}
								type='text'
								value={ interval_max }
								placeholder={ props.lang_common_max }
								onChange={ e => this.setState({ interval_max: e.target.value }) }
							/>
						</div>

					</div>

					<div className="column">

						<div class="field">
							<label class="label">select village</label>
							<div class="control">
								<div class={ village_select_class }>
									<select
										class="is-radiusless"
										value={ village_id }
										onChange={ (e) => this.setState({
											village_name: e.target[e.target.selectedIndex].attributes.village_name.value,
											village_id: e.target.value
										})
										}
									>
										{villages}
									</select>
								</div>
							</div>
						</div>

						<div class='field'>
							<label class='label'>mission type</label>
							<div class='control'>
								<div class={ missiontype_select_class }>
									<select
										class='is-radiusless'
										value={ mission_type }
										onChange={ e => this.setState({
											mission_type_name: e.target[e.target.selectedIndex].attributes.mission_type_name.value,
											mission_type: e.target.value,
										})
										}
									>
										{mission_types}
									</select>
								</div>
							</div>
						</div>

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

				<div className="columns" style='margin-top: 1rem;'>
					<div className="column">
						<button className="button is-radiusless is-success" onClick={ this.submit } style='margin-right: 1rem'>
							submit
						</button>
						<button className="button is-radiusless" onClick={ this.cancel } style='margin-right: 1rem'>
							cancel
						</button>

						<button className="button is-danger is-radiusless" onClick={ this.delete }>
							delete
						</button>
					</div>
					<div className="column">
					</div>
				</div>

			</div>
		);
	}
}
