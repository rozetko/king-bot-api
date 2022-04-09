import { h, render, Component } from 'preact';
import { route } from 'preact-router';
import axios from 'axios';
import classNames from 'classnames';
import { connect } from 'unistore/preact';
import lang, { storeKeys } from '../language';
import { DoubleInput, Select, Button, Help } from '../components/form';
import UnitsTable from '../components/units_table';

@connect(storeKeys)
export default class TimedSend extends Component {
	state = {
		all_villages: [],
		player_settings: '',
		units: [],
		village_name: null,
		village_id: 0,
		target_x: '',
		target_y: '',
		target_help: null,
		target_help_css: '',
		target_village_id: 0,
		target_village_name: null,
		target_distance: null,
		target_player_name: null,
		target_durations: null,
		mission_type: 0,
		mission_type_name: null,
		arrival_date: null,
		arrival_time: null,
		arrival_help: null,
		arrival_help_css: '',
		date: null,
		time: null,
		duration: null,
		timetype: '',
		timetype_name: null,
		timezone: '',
		timezone_name: null,
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
		error_village: false,
		error_date: false,
		error_time: false,
		error_mission_type: false,
		error_target_x: false,
		error_target_y: false,
		error_duration: false,
		error_units: false
	};

	componentWillMount() {
		this.setState({
			...this.props.feature
		});
	}

	componentDidMount() {
		if (this.state.village_id) {
			this.set_units();
			this.set_duration();
		}

		axios.get('/api/data?ident=villages').then(res => this.setState({ all_villages: res.data }));
		axios.get('/api/data?ident=player_settings').then(res => this.setState({ player_settings: res.data }));
	}

	submit = async e => {
		this.setState({
			error_village: this.state.village_id == 0,
			error_mission_type: this.state.mission_type == 0,
			error_target_x: this.state.target_village_id == 0,
			error_target_y: this.state.target_village_id == 0,
			error_units: (
				this.state.t1 + this.state.t2 + this.state.t3 +
				this.state.t4 + this.state.t5 + this.state.t6 +
				this.state.t7 + this.state.t8 + this.state.t9 +
				this.state.t10 + this.state.t11) == 0
		});

		if (this.state.error_village || this.state.error_mission_type ||
			this.state.error_date || this.state.error_time ||
			this.state.error_target_x || this.state.error_target_y ||
			this.state.error_duration || this.state.error_units) return;

		if (this.state.date != '' && this.state.time != '') {
			var { date, time, timetype, timezone } = this.state;
			const datetime = new Date(date + ' ' + time);
			switch (timetype) {
				case '0': // utc
					var offset = (timezone * 60) * 60 * 1000;
					var dateUTC = new Date(datetime.getTime() - offset);
					var arrival_date = this.format_date(dateUTC);
					var arrival_time = this.format_time(dateUTC);
					this.setState({ arrival_date });
					this.setState({ arrival_time });
					break;
				case '1': // local time
					arrival_date = datetime.toJSON().split('T')[0];
					arrival_time = datetime.toJSON().split('T')[1].substring(0, 8);
					this.setState({ arrival_date });
					this.setState({ arrival_time });
					break;
				case '2': // gameworld time
					var gt_timezone = 1; // Servers located in Germany
					if (this.is_dst(datetime))
						gt_timezone++;
					offset = (gt_timezone * 60) * 60 * 1000;
					var dateGT = new Date(datetime.getTime() - offset);
					arrival_date = this.format_date(dateGT);
					arrival_time = this.format_time(dateGT);
					this.setState({ arrival_date });
					this.setState({ arrival_time });
					break;
				default:
					return;
			}
		}

		if (!this.can_siege() && this.state.mission_type == 47) {
			this.setState({ mission_type: 3, mission_type_name: 'Attack' });
		}

		this.props.submit({ ...this.state });
	};

	delete = async e => {
		this.props.delete({ ...this.state });
	};

	cancel = async e => {
		route('/');
	};

	set_units = async e => {
		const { village_id } = this.state;
		const response = await axios.get(`/api/data?ident=units&village_id=${village_id}`);
		let units = [];
		if (response.data != null) {
			units = response.data;
		}
		this.setState({ units });
	};

	add_unit = async e => {
		if (!e.target)
			return;
		switch (e.target.id) {
			case 't1': this.setState({ t1: e.target.text }); break;
			case 't2': this.setState({ t2: e.target.text }); break;
			case 't3': this.setState({ t3: e.target.text }); break;
			case 't4': this.setState({ t4: e.target.text }); break;
			case 't5': this.setState({ t5: e.target.text }); break;
			case 't6': this.setState({ t6: e.target.text }); break;
			case 't7': this.setState({ t7: e.target.text }); break;
			case 't8': this.setState({ t8: e.target.text }); break;
			case 't9': this.setState({ t9: e.target.text }); break;
			case 't10': this.setState({ t10: e.target.text }); break;
			case 't11': this.setState({ t11: e.target.text }); break;
		}
		await this.set_duration();
	};

	set_unit = async e => {
		if (!e.target)
			return;
		switch (e.target.name) {
			case 't1': this.setState({ t1: e.target.value }); break;
			case 't2': this.setState({ t2: e.target.value }); break;
			case 't3': this.setState({ t3: e.target.value }); break;
			case 't4': this.setState({ t4: e.target.value }); break;
			case 't5': this.setState({ t5: e.target.value }); break;
			case 't6': this.setState({ t6: e.target.value }); break;
			case 't7': this.setState({ t7: e.target.value }); break;
			case 't8': this.setState({ t8: e.target.value }); break;
			case 't9': this.setState({ t9: e.target.value }); break;
			case 't10': this.setState({ t10: e.target.value }); break;
			case 't11': this.setState({ t11: e.target.checked ? 1 : 0 }); break;
		}
		await this.set_duration();
	};

	set_duration = async e => {
		const {
			target_durations, mission_type,
			t1, t2, t3, t4,	t5,	t6,
			t7, t8, t9, t10, t11 } = this.state;
		const selected_units = {
			t1, t2, t3, t4, t5, t6,
			t7, t8, t9, t10, t11
		};
		var duration = 0;
		if (target_durations) {
			for (const key in selected_units) {
				if (Number(selected_units[key]) > 0) {
					const unit = key.replace('t', '');
					if (Object.prototype
						.hasOwnProperty.call(target_durations, unit)) {
						if (Number(target_durations[unit]) > duration) {
							duration = target_durations[unit];
							continue;
						}
					}
				}
			}
			// if siege, double the duration
			if (mission_type == 47)
				duration = duration * 2;
			// set to ms
			duration = duration * 1000;
		}
		this.setState({ duration });
		await this.validate_duration();
	};

	validate_duration = async e => {
		const { date, time, duration, timetype, timezone } = this.state;
		let { arrival_help, arrival_help_css,
			error_date, error_time, error_duration } = this.state;
		arrival_help = null;
		arrival_help_css = null;
		error_date = false;
		error_time = false;
		error_duration = false;
		if (duration) {
			const datetime = new Date(date + ' ' + time);

			let send_time_ms;
			switch (timetype) {
				case '0': // utc
					var offset = (datetime.getTimezoneOffset() + (timezone * 60)) * 60 * 1000;
					send_time_ms = datetime.getTime() - offset - duration;
					break;
				case '1': // local time
					send_time_ms = datetime.getTime() - duration;
					break;
				case '2': // gameworld time
					var gt_timezone = 1; // Servers located in Germany
					if (this.is_dst(datetime))
						gt_timezone++;
					offset = (datetime.getTimezoneOffset() + (gt_timezone * 60)) * 60 * 1000;
					send_time_ms = datetime.getTime() - offset - duration;
					break;
				default:
					return;
			}

			const current_time_ms = Date.now();
			const diff_time_ms = send_time_ms - current_time_ms;
			const is_late = isNaN(diff_time_ms) || diff_time_ms < 0;
			if (is_late) {
				arrival_help = 'error_duration_exceeded';
				arrival_help_css = 'is-danger';
				error_date = true;
				error_time = true;
				error_duration = true;
			}
		}
		this.setState({
			arrival_help, arrival_help_css,
			error_date, error_time, error_duration
		});
	};

	set_target = async e => {
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
			target_help_css = 'is-danger';
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
			target_help_css = 'is-danger';
			this.setState({
				target_help, target_help_css,
				error_target_x: true, error_target_y: true
			});
			return;
		}
		const village_data = village_response.data[0].data;
		if (!village_data) {
			target_help = lang.translate('lang_timed_send_help_error_wrong');
			target_help_css = 'is-danger';
			this.setState({
				target_help, target_help_css,
				error_target_x: true, error_target_y: true
			});
			return;
		}

		const target_village_name = village_data.name;
		const target_distance = Math.round(target_data.distance);
		const target_player_name = target_data.destPlayerName;
		const target_durations = target_data.durations;

		target_help = null;
		this.setState({
			target_x, target_y, target_durations,
			target_village_id, target_village_name,
			target_player_name, target_distance, target_help });
		await await this.set_duration();
	};

	format_date = function(date) {
		const day = ('0' + date.getDate()).slice(-2);
		const month = ('0' + (date.getMonth() + 1)).slice(-2);
		const year = date.getFullYear();
		return year + '-' + month + '-' + day;
	};

	format_time = function(date) {
		const hours = `${date.getHours()}`.padStart(2, '0');
		const minutes = `${date.getMinutes()}`.padStart(2, '0');
		const seconds = `${date.getSeconds()}`.padStart(2, '0');
		return hours + ':' + minutes + ':' + seconds;
	};

	is_dst = function(date) {
		let jan = new Date(date.getFullYear(), 0, 1).getTimezoneOffset();
		let jul = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
		return Math.max(jan, jul) !== date.getTimezoneOffset();
	};

	get_duration(duration) {
		const seconds = Math.floor((duration / 1000) % 60),
			minutes = Math.floor((duration / (1000 * 60)) % 60),
			hours = Math.floor((duration / (1000 * 60 * 60)));

		return `${(hours < 10) ? '0' + hours : hours}:` +
			`${(minutes < 10) ? '0' + minutes : minutes}:` +
			`${(seconds < 10) ? '0' + seconds : seconds}`;
	}

	can_siege() {
		var { t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11 } = this.state;

		return t7 > 0 &&
			(t1 + t2 + t3 + t4 + t5 + t6 + t7 + t8 + t9 + t10 + t11) >= 1000;
	}

	render(props) {
		var { all_villages, player_settings, units,
			village_id,	target_x, target_y, target_help, target_help_css,
			target_village_name, target_distance, target_player_name,
			target_durations, duration, arrival_help, arrival_help_css,
			mission_type, date, time,
			timetype, timetype_name,
			timezone, timezone_name,
			t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11
		} = this.state;

		if (timetype == '') {
			if (player_settings) {
				timetype = Number(player_settings.timeType).toString();
				switch (timetype) {
					case '0': timetype_name = 'UTC'; break;
					case '1': timetype_name = 'LOC'; break;
					case '2': timetype_name = 'GT';	break;
				}
				this.setState({ timetype, timetype_name });
				if (timetype == '0') {
					timezone = player_settings.timeZone;
					timezone_name = player_settings.timeZoneString;
					this.setState({ timezone, timezone_name });
				}
			}
		}

		if (timetype) {
			const curDate = new Date();
			switch (timetype) {
				case '0': // utc
					if (!date) {
						var offset = (curDate.getTimezoneOffset() + (timezone * 60)) * 60 * 1000;
						var curUTCDate = new Date(curDate.getTime() + offset);
						date = this.format_date(curUTCDate);
						this.setState({ date });
					}
					if (!time) {
						offset = (curDate.getTimezoneOffset() + (timezone * 60)) * 60 * 1000;
						var curUTCTime = new Date(curDate.getTime() + offset);
						time = this.format_time(curUTCTime);
						this.setState({ time });
					}
					break;
				case '1': // local time
					if (!date) {
						date = this.format_date(curDate);
						this.setState({ date });
					}
					if (!time) {
						time = this.format_time(curDate);
						this.setState({ time });
					}
					break;
				case '2': // gameworld time
					var gt_timezone = 1; // Servers located in Germany
					if (this.is_dst(curDate))
						gt_timezone++;
					if (!date) {
						offset = (curDate.getTimezoneOffset() + (gt_timezone * 60)) * 60 * 1000;
						curUTCDate = new Date(curDate.getTime() + offset);
						date = this.format_date(curUTCDate);
						this.setState({ date });
					}
					if (!time) {
						offset = (curDate.getTimezoneOffset() + (gt_timezone * 60)) * 60 * 1000;
						curUTCTime = new Date(curDate.getTime() + offset);
						time = this.format_time(curUTCTime);
						this.setState({ time });
					}
					break;
			}
		}

		const row_style = {
			verticalAlign: 'middle',
			textAlign: 'center',
		};

		const input_class_date = classNames({
			input: true,
			'is-radiusless': true,
			'is-danger': this.state.error_date
		});

		const input_class_time = classNames({
			input: true,
			'is-radiusless': true,
			'is-danger': this.state.error_time
		});

		const input_class_x = classNames({
			input: true,
			'is-radiusless': true,
			'is-danger': this.state.error_target_x
		});

		const input_class_y = classNames({
			input: true,
			'is-radiusless': true,
			'is-danger': this.state.error_target_y
		});

		const village_select_class = classNames({
			select: true,
			'is-danger': this.state.error_village
		});

		const missiontype_select_class = classNames({
			select: true,
			'is-danger': this.state.error_mission_type
		});

		const duration_class = classNames({
			'is-danger': this.state.error_duration
		});

		const villages = all_villages.map(village =>
			<option
				value={ village.data.villageId }
				village_name={ village.data.name }
			>
				({village.data.coordinates.x}|{village.data.coordinates.y}) {village.data.name}
			</option>
		);

		const can_siege = this.can_siege();
		if (!can_siege && mission_type == 47) {
			mission_type = 3;
		}
		const mission_types = [
			{ value: 5, name: props.lang_mission_type_support },
			{ value: 3, name: props.lang_mission_type_attack },
			{ value: 4, name: props.lang_mission_type_raid },
			{ value: 6, name: props.lang_mission_type_spy },
			{ value: 47, name: props.lang_mission_type_siege, disabled: !can_siege },
			{ value: 10, name: props.lang_mission_type_settle }
		].map(option =>
			<option
				value={ option.value }
				mission_type_name={ option.name }
				disabled = { option.disabled }
			>
				{option.name}
			</option>
		);

		return (
			<div>
				<div className="columns">

					<div className="column">

						<DoubleInput
							label = { props.lang_timed_send_arrival + ` (${timetype_name}${timezone_name})` }
							type1 = 'date'
							type2 = 'time'
							value1 = { date }
							value2 = { time }
							onChange1 = { e => {
								this.setState({ date: e.target.value });
								this.validate_duration();
							} }
							onChange2 = { e => {
								this.setState({ time: e.target.value });
								this.validate_duration();
							} }
							class1 = { input_class_date }
							class2 = { input_class_time }
							icon1 = 'fa-calendar'
							icon2 = 'fa-clock'
							width = { null }
							help = {
								<Help
									className = { arrival_help_css }
									content = { arrival_help == 'error_duration_exceeded' ? props.lang_timed_send_error_arrival_duration : null }
								/> }
						/>

						<DoubleInput
							label = { props.lang_common_target }
							placeholder1 = { 'x' }
							placeholder2 = { 'y' }
							value1 = { target_x }
							value2 = { target_y }
							onChange1 = { e => this.setState({ target_x: e.target.value }) }
							onChange2 = { e => this.setState({ target_y: e.target.value }) }
							class1 = { input_class_x }
							class2 = { input_class_y }
							button = { <Button
								action = { props.lang_timed_send_button_settarget }
								className = 'is-success'
								onClick = { this.set_target }
								icon = 'fa-bullseye-pointer' /> }
							help = { <Help className = { target_help_css } content = { target_help ?? '' } /> }
							icon = 'fa-map-marker-alt'
						/>
					</div>

					<div className="column">

						<Select
							label = { props.lang_combo_box_village }
							value = { village_id }
							onChange = { e => {
								this.setState({
									village_name: e.target[e.target.selectedIndex].attributes.village_name.value,
									village_id: e.target.value
								});
								this.set_units();
							} }
							options = { villages }
							className = { village_select_class }
							icon='fa-home'
						/>

						<Select
							label = { props.lang_combo_box_missiontype }
							value = { mission_type }
							onChange = { e => {
								this.setState({
									mission_type_name: e.target[e.target.selectedIndex].attributes.mission_type_name.value,
									mission_type: e.target.value
								});
								this.set_duration();
							} }
							options = { mission_types }
							className = { missiontype_select_class }
							icon = 'fa-bullseye-arrow'
						/>

					</div>

				</div>

				<div class="columns">

					<div class="column is-one-third">

						<table className="table is-narrow is-fullwidth">
							<thead>
								<tr>
									<th style={ row_style }>{props.lang_table_village}</th>
									<th style={ row_style }>{props.lang_table_player}</th>
									<th style={ row_style }>{props.lang_table_distance}</th>
									<th style={ row_style }>{props.lang_table_duration}</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td style={ row_style }>
										{target_village_name}
									</td>
									<td style={ row_style }>
										{target_player_name}
									</td>
									<td style={ row_style }>
										{target_distance}
									</td>
									<td style={ row_style }>
										{ target_durations ?
											<span class={ `tag is-medium ${duration_class}` }>
												{this.get_duration(duration)}
											</span> : null }
									</td>
								</tr>
							</tbody>
						</table>

					</div>

				</div>

				<div class="columns">

					<div class="column">

						<UnitsTable
							units = { units }
							error_units = { this.state.error_units }
							t1 = { t1 }
							t2 = { t2 }
							t3 = { t3 }
							t4 = { t4 }
							t5 = { t5 }
							t6 = { t6 }
							t7 = { t7 }
							t8 = { t8 }
							t9 = { t9 }
							t10 = { t10 }
							t11 = { t11 }
							clicked={ this.add_unit }
							changed={ this.set_unit }
						/>

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
