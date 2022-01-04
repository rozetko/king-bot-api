import { h, render, Component } from 'preact';
import { route } from 'preact-router';
import axios from 'axios';
import classNames from 'classnames';

export default class SendTimedAttack extends Component {
	state = {
		own_tribe: 0,
		village_name: '',
		village_id: '',
		all_villages: [],
		target_x: 0,
		target_y: 0,
		target_villageId: '',
		target_village_name: '',
		target_playerId: '',
		target_player_name: '',
		target_tribeId: '',
		target_distance: '',
		troops: '',
		mission_types: '',
		date: '',
		time: '',
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
		mission_type: 3,
		mission_type_name: '',
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
		axios.get('/api/data?ident=troops').then(res => this.setState({ troops: res.data }));
	}

	setTarget = async e => {
		this.setState({
			error_village: (this.state.village_id == 0),
			error_target_x: (this.state.target_x == 0),
			error_target_y: (this.state.target_y == 0)
		});

		if (this.state.error_village || this.state.error_target_x || this.state.error_target_y)
			return;

		const { village_id, target_x, target_y } = this.state;
		var x = Number(target_x);
		var y = Number(target_y);
		const villageID = 536887296 + x + (y * 32768);
		var params = {
			sourceVillage: village_id,
			destinationVillage: villageID
		};
		var response = await axios.post('/api/checkTarget', params);
		const check_target_data = response.data;

		params = [
			`Village: ${villageID}`
		];
		response = await axios.post('/api/findvillage', params);

		const destinationVillage = response.data[0].data;
		if (!destinationVillage) alert('unable to find destination village!');

		const target_villageId = destinationVillage.villageId;
		const target_village_name = destinationVillage.name;
		const target_distance = check_target_data.distance;
		const target_playerId = destinationVillage.playerId;
		const target_tribeId = destinationVillage.tribeId;
		const target_player_name = check_target_data.destPlayerName;
		if (target_village_name == null) alert('Something went wrong. Is your target banned?');
		this.setState({ target_villageId, target_village_name, target_x, target_y, target_playerId, target_player_name, target_tribeId, target_distance });
	};

	submit = async e => {
		this.setState({
			error_village: (this.state.village_id == 0),
			error_target_x: (this.state.target_x == 0),
			error_target_y: (this.state.target_y == 0),
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
		var { all_villages, village_name, village_id,
			target_x, target_y, target_player_name, target_village_name,
			target_tribeId, target_distance, own_tribe, troops,
			t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11,
			mission_type, mission_type_name, time, date
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
		if (own_tribe != 0 && troops != '') {
			new_rows = [
				<th style={ row_style }> <i class={ class_name + 1 } title={ troops[own_tribe][1].name }></i> </th>,
				<th style={ row_style }> <i class={ class_name + 2 } title={ troops[own_tribe][2].name }></i> </th>,
				<th style={ row_style }> <i class={ class_name + 3 } title={ troops[own_tribe][3].name }></i> </th>,
				<th style={ row_style }> <i class={ class_name + 4 } title={ troops[own_tribe][4].name }></i> </th>,
				<th style={ row_style }> <i class={ class_name + 5 } title={ troops[own_tribe][5].name }></i> </th>,
				<th style={ row_style }> <i class={ class_name + 6 } title={ troops[own_tribe][6].name }></i> </th>,
				<th style={ row_style }> <i class={ class_name + 7 } title={ troops[own_tribe][7].name }></i> </th>,
				<th style={ row_style }> <i class={ class_name + 8 } title={ troops[own_tribe][8].name }></i> </th>,
				<th style={ row_style }> <i class={ class_name + 9 } title={ troops[own_tribe][9].name }></i> </th>,
				<th style={ row_style }> <i class={ class_name + 10 } title={ troops[own_tribe][10].name }></i> </th>,
				<th style={ row_style }> <i class={ 'unitSmall hero_illu' } title={ 'Hero' }></i> </th>
			];
		}

		if (date == '') {
			var curDate = new Date();
			curDate = curDate.toJSON();
			date = curDate.split('T')[0];
			this.setState({ date });
		}
		if (this.state.time == '') {
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
								style={{ width: '150px', marginRight: '10px' }}
								type='text'
								value={ target_x }
								placeholder= "x"
								onChange={ e => this.setState({ target_x: e.target.value }) }
							/>
							<input
								class={ input_class_y }
								style={{ width: '150px' }}
								type='text'
								value={ target_y }
								placeholder="y"
								onChange={ e => this.setState({ target_y: e.target.value }) }
							/>
							<button className='button is-radiusless is-success' style='margin-left: 1rem' onClick={ this.setTarget }>
								set target
							</button>
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
