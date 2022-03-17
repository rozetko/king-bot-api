import { h, render, Component } from 'preact';
import { route } from 'preact-router';
import axios from 'axios';
import classNames from 'classnames';
import { connect } from 'unistore/preact';
import { storeKeys } from '../language';

@connect(storeKeys)
export default class TradeRoute extends Component {
	state = {
		selected_farmlist: '',
		source_village_name: '',
		destination_village_name: '',
		source_village_id: 0,
		destination_village_id: 0,
		interval_min: '',
		interval_max: '',
		send_wood: '',
		send_clay: '',
		send_iron: '',
		send_crop: '',
		source_wood: '',
		source_clay: '',
		source_iron: '',
		source_crop: '',
		destination_wood: '',
		destination_clay: '',
		destination_iron: '',
		destination_crop: '',
		all_villages: [],
		error_input_min: false,
		error_input_max: false,
		error_source_village_id: false,
		error_destination_village_id: false,
	};

	componentWillMount() {
		this.setState({ ...this.props.feature });

		axios.get('/api/data?ident=villages')
			.then(res => this.setState({ all_villages: res.data }));
	}


	async submit() {
		this.setState({
			error_input_min: (this.state.interval_min == ''),
			error_input_max: (this.state.interval_max == ''),
			error_source_village_id: (this.state.source_village_id == 0),
			error_destination_village_id: (this.state.destination_village_id == 0),
		});

		if (this.state.error_input_min ||
			this.state.error_input_max ||
			this.state.error_source_village_id ||
			this.state.error_destination_village_id) return;

		const {
			ident,
			uuid,
			source_village_name,
			destination_village_name,
			source_village_id,
			destination_village_id,
			interval_min,
			interval_max,
			send_wood,
			send_clay,
			send_iron,
			send_crop,
			source_wood,
			source_clay,
			source_iron,
			source_crop,
			destination_wood,
			destination_iron,
			destination_clay,
			destination_crop,
		} = this.state;

		this.props.submit({
			ident,
			uuid,
			source_village_name,
			destination_village_name,
			source_village_id,
			destination_village_id,
			interval_min,
			interval_max,
			send_wood,
			send_clay,
			send_iron,
			send_crop,
			source_wood,
			source_clay,
			source_iron,
			source_crop,
			destination_wood,
			destination_iron,
			destination_clay,
			destination_crop,
		});
	}

	async delete() {
		const {
			ident,
			uuid,
			source_village_name,
			destination_village_name,
			source_village_id,
			destination_village_id,
			interval_min,
			interval_max,
			send_wood,
			send_clay,
			send_iron,
			send_crop,
			source_wood,
			source_clay,
			source_iron,
			source_crop,
			destination_wood,
			destination_iron,
			destination_clay,
			destination_crop,
		} = this.state;

		this.props.delete({
			ident,
			uuid,
			source_village_name,
			destination_village_name,
			source_village_id,
			destination_village_id,
			interval_min,
			interval_max,
			send_wood,
			send_clay,
			send_iron,
			send_crop,
			source_wood,
			source_clay,
			source_iron,
			source_crop,
			destination_wood,
			destination_iron,
			destination_clay,
			destination_crop,
		});
	}

	async cancel() {
		route('/');
	}

	render(props) {
		const {
			interval_min, interval_max, all_villages,
			source_village_name, destination_village_name,
			source_village_id,
			destination_village_id,
			send_wood,
			send_clay,
			send_iron,
			send_crop,
			source_wood,
			source_clay,
			source_iron,
			source_crop,
			destination_wood,
			destination_clay,
			destination_iron,
			destination_crop,
		} = this.state;

		const input_class_min = classNames({
			input: true,
			'is-radiusless': true,
			'is-danger': this.state.error_input_min,
		});

		const input_class_max = classNames({
			input: true,
			'is-radiusless': true,
			'is-danger': this.state.error_input_max,
		});

		const source_village_select_class = classNames({
			select: true,
			'is-danger': this.state.error_source_village_id,
		});

		const destination_village_select_class = classNames({
			select: true,
			'is-danger': this.state.error_destination_village_id,
		});

		const resource_class = classNames({
			input: true,
			'is-radiusless': true,
		});

		const villages = all_villages.map(village =>
			<option
				value={ village.data.villageId }
				village_name={ village.data.name }
			>
				({village.data.coordinates.x}|{village.data.coordinates.y}) {village.data.name}
			</option>
		);

		return (
			<div>
				<div className='columns'>

					<div className='column'>

						<div class='field'>
							<label class='label'>{props.lang_trade_source_village}</label>
							<div class='control'>
								<div class={ source_village_select_class }>
									<select
										class='is-radiusless'
										value={ source_village_id }
										onChange={ e => this.setState({
											source_village_name: e.target[e.target.selectedIndex].attributes.village_name.value,
											source_village_id: e.target.value,
										})
										}
									>
										{villages}
									</select>
								</div>
							</div>
						</div>

						<div class='field'>
							<label class='label'>{props.lang_trade_dest_village}</label>
							<div class='control'>
								<div class={ destination_village_select_class }>
									<select
										class='is-radiusless'
										value={ destination_village_id }
										onChange={ e => this.setState({
											destination_village_name: e.target[e.target.selectedIndex].attributes.village_name.value,
											destination_village_id: e.target.value,
										})
										}
									>
										{villages}
									</select>
								</div>
							</div>
						</div>

						<label
							style={{ marginTop: '2rem' }}
							class='label'
						>{props.lang_trade_interval}</label>
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
						<p class='help'>{props.lang_common_prov_number}</p>

						<label
							style={{ marginTop: '2rem' }}
							class='label'
						>{props.lang_trade_send_ress}</label>
						<input
							class={ resource_class }
							style={{ width: '150px', marginRight: '10px' }}
							type='text'
							value={ send_wood }
							placeholder='0'
							onChange={ e => this.setState({ send_wood: e.target.value }) }
						/>

						<input
							class={ resource_class }
							style={{ width: '150px', marginRight: '10px' }}
							type='text'
							value={ send_clay }
							placeholder='0'
							onChange={ e => this.setState({ send_clay: e.target.value }) }
						/>

						<input
							class={ resource_class }
							style={{ width: '150px', marginRight: '10px' }}
							type='text'
							value={ send_iron }
							placeholder='0'
							onChange={ e => this.setState({ send_iron: e.target.value }) }
						/>

						<input
							class={ resource_class }
							style={{ width: '150px', marginRight: '10px' }}
							type='text'
							value={ send_crop }
							placeholder='0'
							onChange={ e => this.setState({ send_crop: e.target.value }) }
						/>

						<label
							style={{ marginTop: '2rem' }}
							class='label'
						>{props.lang_trade_source_greater}</label>
						<input
							class={ resource_class }
							style={{ width: '150px', marginRight: '10px' }}
							type='text'
							value={ source_wood }
							placeholder='0'
							onChange={ e => this.setState({ source_wood: e.target.value }) }
						/>

						<input
							class={ resource_class }
							style={{ width: '150px', marginRight: '10px' }}
							type='text'
							value={ source_clay }
							placeholder='0'
							onChange={ e => this.setState({ source_clay: e.target.value }) }
						/>

						<input
							class={ resource_class }
							style={{ width: '150px', marginRight: '10px' }}
							type='text'
							value={ source_iron }
							placeholder='0'
							onChange={ e => this.setState({ source_iron: e.target.value }) }
						/>

						<input
							class={ resource_class }
							style={{ width: '150px', marginRight: '10px' }}
							type='text'
							value={ source_crop }
							placeholder='0'
							onChange={ e => this.setState({ source_crop: e.target.value }) }
						/>

						<label
							style={{ marginTop: '2rem' }}
							class='label'
						>{props.lang_trade_dest_less}</label>
						<input
							class={ resource_class }
							style={{ width: '150px', marginRight: '10px' }}
							type='text'
							value={ destination_wood }
							placeholder='10000000'
							onChange={ e => this.setState({ destination_wood: e.target.value }) }
						/>

						<input
							class={ resource_class }
							style={{ width: '150px', marginRight: '10px' }}
							type='text'
							value={ destination_clay }
							placeholder='10000000'
							onChange={ e => this.setState({ destination_clay: e.target.value }) }
						/>

						<input
							class={ resource_class }
							style={{ width: '150px', marginRight: '10px' }}
							type='text'
							value={ destination_iron }
							placeholder='10000000'
							onChange={ e => this.setState({ destination_iron: e.target.value }) }
						/>

						<input
							class={ resource_class }
							style={{ width: '150px', marginRight: '10px' }}
							type='text'
							value={ destination_crop }
							placeholder='10000000'
							onChange={ e => this.setState({ destination_crop: e.target.value }) }
						/>

					</div>

				</div>

				<div className='columns'>
					<div className='column'>
						<button
							className='button is-radiusless is-success'
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
					<div className='column'></div>
				</div>

			</div>
		);
	}
}
