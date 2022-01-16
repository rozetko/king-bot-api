import { h, render, Component } from 'preact';
import { route } from 'preact-router';
import axios from 'axios';
import classNames from 'classnames';
import { connect } from 'unistore/preact';
import { storeKeys } from '../language';
import { Input, DoubleInput, Select, Button, Help } from '../components/form';

@connect(storeKeys)
export default class TradeRoute extends Component {
	state = {
		source_village_name: '',
		destination_village_name: '',
		source_village_id: 0,
		destination_village_id: 0,
		interval_min: 0,
		interval_max: 0,
		send_wood: 0,
		send_clay: 0,
		send_iron: 0,
		send_crop: 0,
		source_wood: 0,
		source_clay: 0,
		source_iron: 0,
		source_crop: 0,
		destination_wood: 10000000,
		destination_clay: 10000000,
		destination_iron: 10000000,
		destination_crop: 10000000,
		all_villages: [],
		error_source_village_id: false,
		error_destination_village_id: false,
		error_input_min: false,
		error_input_max: false
	};

	componentWillMount() {
		this.setState({ ...this.props.feature });

		axios.get('/api/data?ident=villages')
			.then(res => this.setState({ all_villages: res.data }));
	}

	async submit() {
		this.setState({
			error_source_village_id: (this.state.source_village_id == 0),
			error_destination_village_id: (this.state.destination_village_id == 0),
			error_input_min: (this.state.interval_min == 0),
			error_input_max: (this.state.interval_max == 0)
		});

		if (this.state.error_source_village_id ||
			this.state.error_destination_village_id ||
			this.state.error_input_min ||
			this.state.error_input_max) return;

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
			all_villages,
			source_village_id,
			destination_village_id,
			interval_min, interval_max,
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

		const source_village_select_class = classNames({
			select: true,
			'is-danger': this.state.error_source_village_id,
		});

		const destination_village_select_class = classNames({
			select: true,
			'is-danger': this.state.error_destination_village_id,
		});

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

		const villages = all_villages.map(village =>
			<option
				value={ village.data.villageId }
				village_name={ village.data.name }
			>
				({village.data.coordinates.x}|{village.data.coordinates.y}) {village.data.name}
			</option>
		);

		const input_style = { width: '7.5em' };

		return (
			<div>
				<div className='columns'>

					<div className='column'>

						<DoubleInput
							label = { props.lang_trade_interval }
							placeholder1 = { props.lang_common_min }
							placeholder2 = { props.lang_common_max }
							value1 = { interval_min }
							value2 = { interval_max }
							onChange1 = { e => this.setState({ interval_min: e.target.value }) }
							onChange2 = { e => this.setState({ interval_max: e.target.value }) }
							class1 = { input_class_min }
							class2 = { input_class_max }
							help = { <Help content = { props.lang_common_prov_number } /> }
							icon = 'fa-stopwatch'
						/>

					</div>

					<div className='column'>

						<Select
							label = { props.lang_trade_source_village }
							value = { source_village_id }
							onChange = { e => this.setState({
								source_village_name: e.target[e.target.selectedIndex].attributes.village_name.value,
								source_village_id: e.target.value,
							}) }
							options = { villages }
							className = { source_village_select_class }
							icon = 'fa-home'
						/>

						<Select
							label = { props.lang_trade_dest_village }
							value = { destination_village_id }
							onChange = { e => this.setState({
								destination_village_name: e.target[e.target.selectedIndex].attributes.village_name.value,
								destination_village_id: e.target.value,
							}) }
							options = { villages }
							className = { destination_village_select_class }
							icon = 'fa-home'
						/>

					</div>

				</div>

				<div className='columns'>

					<div className='column'>

						<label class='label'>{props.lang_trade_send_ress}</label>
						<div class="field is-grouped">
							<Input
								placeholder= '0'
								value={ send_wood }
								onChange={ e => this.setState({ send_wood: e.target.value }) }
								style={ input_style }
								parent_field = { false }
							/>
							<Input
								placeholder= '0'
								value={ send_clay }
								onChange={ e => this.setState({ send_clay: e.target.value }) }
								style={ input_style }
								parent_field = { false }
							/>
							<Input
								placeholder= '0'
								value={ send_iron }
								onChange={ e => this.setState({ send_iron: e.target.value }) }
								style={ input_style }
								parent_field = { false }
							/>
							<Input
								placeholder= '0'
								value={ send_crop }
								onChange={ e => this.setState({ send_crop: e.target.value }) }
								style={ input_style }
								parent_field = { false }
							/>
						</div>

					</div>

				</div>

				<div className='columns'>

					<div className='column'>

						<label class='label'>{props.lang_trade_source_greater}</label>
						<div class="field is-grouped">
							<Input
								placeholder= '0'
								value={ source_wood }
								onChange={ e => this.setState({ source_wood: e.target.value }) }
								style={ input_style }
								parent_field = { false }
							/>
							<Input
								placeholder= '0'
								value={ source_clay }
								onChange={ e => this.setState({ source_clay: e.target.value }) }
								style={ input_style }
								parent_field = { false }
							/>
							<Input
								placeholder= '0'
								value={ source_iron }
								onChange={ e => this.setState({ source_iron: e.target.value }) }
								style={ input_style }
								parent_field = { false }
							/>
							<Input
								placeholder= '0'
								value={ source_crop }
								onChange={ e => this.setState({ source_crop: e.target.value }) }
								style={{ width: '7.5em' }}
								parent_field = { false }
							/>
						</div>

					</div>

				</div>

				<div className='columns'>

					<div className='column'>

						<label class='label'>{props.lang_trade_dest_less}</label>
						<div class="field is-grouped">
							<Input
								placeholder= '10000000'
								value={ destination_wood }
								onChange={ e => this.setState({ destination_wood: e.target.value }) }
								style={ input_style }
								parent_field = { false }
							/>
							<Input
								placeholder= '10000000'
								value={ destination_clay }
								onChange={ e => this.setState({ destination_clay: e.target.value }) }
								style={ input_style }
								parent_field = { false }
							/>
							<Input
								placeholder= '10000000'
								value={ destination_iron }
								onChange={ e => this.setState({ destination_iron: e.target.value }) }
								style={ input_style }
								parent_field = { false }
							/>
							<Input
								placeholder= '10000000'
								value={ destination_crop }
								onChange={ e => this.setState({ destination_crop: e.target.value }) }
								style={ input_style }
								parent_field = { false }
							/>
						</div>

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
