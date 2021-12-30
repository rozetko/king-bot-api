import { h, render, Component } from 'preact';
import { route } from 'preact-router';
import axios from 'axios';
import classNames from 'classnames';
import { connect } from 'unistore/preact';
import { storeKeys } from '../language';

@connect(storeKeys)
export default class TrainTroops extends Component {
	state = {
		all_villages: [],
		all_troops: [],
		own_tribe: 0,
		village_name: '',
		village_id: '',
		error_village: false,
		unit: 0,
		unit_name: '',
		amount: 0,
		error_amount: false,
		error_unit: false,
		interval_min: 0,
		interval_max: 0,
		error_interval_max: false,
		error_interval_min: false
	}

	componentWillMount() {
		this.setState({
			...this.props.feature
		});

		axios.get('/api/data?ident=villages').then(res => this.setState({ all_villages: res.data }));
		axios.get('/api/data?ident=troops').then(res => this.setState({ all_troops: res.data }));
		axios.get('/api/data?ident=player_tribe').then(res => this.setState({ own_tribe: Number(res.data) }));
	}

	async submit() {
		this.setState({
			error_village: (this.state.village_id == 0),
			error_unit: (this.state.unit == 0),
			error_amount: (this.state.amount == 0),
			error_interval_min: (this.state.interval_min == ''),
			error_interval_max: (this.state.interval_max == '')
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
		const {
			all_villages, all_troops, own_tribe,
			village_id, village_name, error_village,
			unit, unit_name, error_unit,
			amount, error_amount,
			interval_min, error_interval_min,
			interval_max, error_interval_max
		} = this.state;

		const village_select_class = classNames({
			select: true,
			'is-radiusless': true,
			'is-danger': error_village,
		});

		const unit_select_class = classNames({
			select: true,
			'is-radiusless': true,
			'is-danger': error_unit,
		});

		const input_class_amount = classNames({
			input: true,
			'is-radiusless': true,
			'is-danger': error_amount,
		});

		const input_class_min = classNames({
			input: true,
			'is-radiusless': true,
			'is-danger': error_interval_min,
		});

		const input_class_max = classNames({
			input: true,
			'is-radiusless': true,
			'is-danger': error_interval_max,
		});

		const villages = all_villages.map(village =>
			<option
				value={ village.data.villageId }
				village_name={ village.data.name }
			>
				({village.data.coordinates.x}|{village.data.coordinates.y}) {village.data.name}
			</option>
		);

		// TODO: all_troops doesn't work as expected.
		const tribes = [[{ unit: 0, name: 'Tribe undefined' }],
			[
				{ unit: 1, name: 'Legionnaire' },
				{ unit: 2, name: 'Praetorian' },
				{ unit: 3, name: 'Imperian' },
				{ unit: 4, name: 'Equites Legati' },
				{ unit: 5, name: 'Equites Imperatoris' },
				{ unit: 6, name: 'Equites Caesaris' },
				{ unit: 7, name: 'Battering Ram' },
				{ unit: 8, name: 'Fire Catapult' }
			],[
				{ unit: 11, name: 'Clubswinger' },
				{ unit: 12, name: 'Spearfighter' },
				{ unit: 13, name: 'Axefighter' },
				{ unit: 14, name: 'Scout' },
				{ unit: 15, name: 'Paladin' },
				{ unit: 16, name: 'Teutonic Knight' },
				{ unit: 17, name: 'Ram' },
				{ unit: 18, name: 'Catapult' }
			],[
				{ unit: 21, name: 'Phalanx' },
				{ unit: 22, name: 'Swordsman' },
				{ unit: 23, name: 'Pathfinder' },
				{ unit: 24, name: 'Theutates thunder' },
				{ unit: 25, name: 'Druidrider' },
				{ unit: 26, name: 'Headuan' },
				{ unit: 27, name: 'Ram' },
				{ unit: 28, name: 'Trebuchet' }
			]];

		const troops = tribes[own_tribe].map(troop =>
			<option
				value={ troop.unit }
				unit_name={ troop.name }
			>
				{troop.name}
			</option>
		);

		return (
			<div>
				<div className="columns">

					<div className='column'>
						<div class='field'>
							<label class='label'>select unit</label>
							<div class='control'>
								<div class={ unit_select_class }>
									<select
										class='is-radiusless'
										value={ unit }
										onChange={ e => this.setState({
											unit_name: e.target[e.target.selectedIndex].attributes.unit_name.value,
											unit: e.target.value,
										})
										}
									>
										{ troops }
									</select>
								</div>
							</div>
						</div>
						<div class='field'>
							<label class='label'>{ props.lang_easy_scout_amount }</label>
							<input
								class={ input_class_amount }
								style={{ width: '150px' }}
								type='text'
								value={ amount }
								placeholder="0: max"
								onChange={ e => this.setState({ amount: e.target.value }) }
							/>
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
						<div class='field'>
							<label class='label'>{props.lang_combo_box_select_village}</label>
							<div class='control'>
								<div class={ village_select_class }>
									<select
										class='is-radiusless'
										value={ village_id }
										onChange={ e => this.setState({
											village_name: e.target[e.target.selectedIndex].attributes.village_name.value,
											village_id: e.target.value,
										})
										}
									>
										{ villages }
									</select>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className='columns'>
					<div className='column'>
						<button
							className='button is-success is-radiusless'
							onClick={ this.submit.bind(this) }
							style={{ marginRight: '1rem' }}
						>
							{props.lang_button_submit}
						</button>
						<button
							className='button is-radiusless'
							onClick={ this.cancel.bind(this) }
							style={{ marginRight: '1rem' }}
						>
							{props.lang_button_cancel}
						</button>

						<button
							className='button is-danger is-radiusless'
							onClick={ this.delete.bind(this) }
						>
							{props.lang_button_delete}
						</button>
					</div>
					<div className='column'>
					</div>
				</div>

			</div>
		);
	}
}
