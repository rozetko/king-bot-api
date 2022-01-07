import { h, render, Component } from 'preact';
import { route } from 'preact-router';
import axios from 'axios';
import classNames from 'classnames';

export default class SendTimedAttack extends Component {
	state = {
		own_tribe: 0,
		all_villages: [],
		unit_types: [],
		village_name: null,
		village_id: 0,
		target_x: '',
		target_y: '',
		target_help: null,
		target_help_css: 'help',
		target_villageId: 0,
		target_village_name: null,
		target_distance: null,
		target_player_name: null,
		date: null,
		time: null,
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

	setTarget = async e => {
		this.setState({
			error_village: (this.state.village_id == 0),
			error_target_x: (this.state.target_x == ''),
			error_target_y: (this.state.target_y == '')
		});

		if (this.state.error_village || this.state.error_target_x || this.state.error_target_y)
			return;

		let { target_help, target_help_css } = this.state;

		const { village_id, target_x, target_y } = this.state;
		var x = Number(target_x);
		var y = Number(target_y);
		const target_village_id = 536887296 + x + (y * 32768);
		var params = {
			villageId: village_id,
			destVillageId: target_village_id
		};
		const target_response = await axios.post('/api/checkTarget', params);
		if (target_response.data.errors) {
			target_help = `error: ${target_response.data.errors[0].message}`;
			target_help_css = 'help is-danger';
			this.setState({
				target_help, target_help_css,
				error_target_x: true, error_target_y: true
			});
			return;
		}
		const target_data = target_response.data;

		const village_response = await axios.post('/api/find', [`Village: ${target_village_id}`]);
		if (village_response.data.errors) {
			target_help = `error: ${village_response.data.errors[0].message}`;
			target_help_css = 'help is-danger';
			this.setState({
				target_help, target_help_css,
				error_target_x: true, error_target_y: true
			});
			return;
		}
		const village_data = village_response.data[0].data;
		if (!village_data) {
			target_help = 'something went wrong, is your target a robber?';
			target_help_css = 'help is-danger';
			this.setState({
				target_help, target_help_css,
				error_target_x: true, error_target_y: true
			});
			return;
		}

		const target_village_name = village_data.name;
		const target_distance = target_data.distance;
		const target_player_name = target_data.destPlayerName;

		target_help = null;
		this.setState({
			target_x, target_y,
			target_village_id, target_village_name,
			target_player_name, target_distance, target_help });
	};

	submit = async e => {
		this.setState({
			error_village: (this.state.village_id == 0),
			error_target_x: (this.state.target_x == ''),
			error_target_y: (this.state.target_y == ''),
			error_mission_type: (this.state.mission_type == 0)
		});

		if (this.state.error_village || this.state.error_mission_type ||
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
			village_id,	target_x, target_y,
			target_help, target_help_css,
			target_village_name, target_distance, target_player_name,
			t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11,
			mission_type, date, time
		} = this.state;

		const row_style = {
			verticalAlign: 'middle',
			textAlign: 'center',
		};

		var class_name = '';
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

		if (!date) {
			var curDate = new Date();
			curDate = curDate.toJSON();
			date = curDate.split('T')[0];
			this.setState({ date });
		}
		if (!time) {
			var curUTCTime = new Date();
			curUTCTime = curUTCTime.toJSON();
			time = curUTCTime.split('T')[1].substring(0, 5);
			this.setState({ time });
		}

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
			{ value: 5, name: 'Support' },
			{ value: 3, name: 'Attack' },
			{ value: 4, name: 'Raid' },
			{ value: 6, name: 'Spy' },
			{ value: 47, name: 'Siege' },
			{ value: 10, name: 'Settle' }
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
						<div class='field'>
							<label class="label">attack date / time (UTC)</label>
							<input type="date" id="start" name="trip-start"
								value={ date } onChange={ (e) => this.setState({ date: e.target.value }) }
							></input>
							<input type="time" id="meeting-time" step="1"
								name="meeting-time" value={ time } onChange={ (e) => this.setState({ time: e.target.value }) }
							/>
						</div>
						<div class='field'>
							<label style={{ marginTop: '2rem' }} class='label'>target (x / y)</label>
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
							<button className='button is-radiusless is-success' onClick={ this.setTarget }>
								set target
							</button>
							<p class={ target_help_css }>{target_help}</p>
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

				<div>
					<table className="table is-hoverable is-fullwidth">
						<thead>
							<tr>
								<th style={ row_style }>distance</th>
								<th style={ row_style }>player</th>
								<th style={ row_style }>village</th>
								{new_rows}
							</tr>
						</thead>
						<tbody>
							<tr>
								<td style={ row_style }>
									{target_distance}
								</td>
								<td style={ row_style }>
									{target_player_name}
								</td>
								<td style={ row_style }>
									{target_village_name}
								</td>
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
