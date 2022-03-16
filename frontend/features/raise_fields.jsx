import { h, render, Component } from 'preact';
import { route } from 'preact-router';
import axios from 'axios';
import classNames from 'classnames';
import { connect } from 'unistore/preact';
import { storeKeys } from '../language';
import { Input, Select, Button } from '../components/form';

@connect(storeKeys)
export default class RaiseFields extends Component {
	state = {
		all_villages: [],
		village_name: '',
		village_id: 0,
		crop: '',
		wood: '',
		clay: '',
		iron: '',
		error_wood: false,
		error_clay: false,
		error_iron: false,
		error_crop: false,
		error_village: false
	};

	componentWillMount() {
		this.setState({ ...this.props.feature });

		axios.get('/api/data?ident=villages').then(res => this.setState({ all_villages: res.data }));
	}

	async submit() {
		this.setState({
			error_wood: (this.state.wood === ''),
			error_clay: (this.state.clay === ''),
			error_iron: (this.state.iron === ''),
			error_crop: (this.state.crop === ''),
			error_village: (this.state.village_id == 0)
		});

		if (this.state.error_wood || this.state.error_clay || this.state.error_iron ||
			this.state.error_crop || this.state.error_village)
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
			all_villages, village_id,
			crop, iron, wood, clay
		} = this.state;

		const input_class_wood = classNames({
			input: true,
			'is-radiusless': true,
			'is-danger': this.state.error_wood,
		});

		const input_class_clay = classNames({
			input: true,
			'is-radiusless': true,
			'is-danger': this.state.error_clay,
		});

		const input_class_iron = classNames({
			input: true,
			'is-radiusless': true,
			'is-danger': this.state.error_iron,
		});

		const input_class_crop = classNames({
			input: true,
			'is-radiusless': true,
			'is-danger': this.state.error_crop,
		});

		const village_select_class = classNames({
			select: true,
			'is-danger': this.state.error_village,
		});

		const villages = all_villages.map(village =>
			<option
				value={ village.data.villageId }
				village_name={ village.data.name }
			>
				({village.data.coordinates.x}|{village.data.coordinates.y}) {village.data.name}
			</option>
		);

		const input_style = { width: '5em' };

		return (
			<div>
				<div className='columns'>

					<div className='column'>

						<div class="field is-grouped">
							<Input
								label={ props.lang_common_wood }
								placeholder={ props.lang_common_level }
								value={ wood }
								onChange={ e => this.setState({ wood: e.target.value }) }
								style={{ width: '5em' }}
								parent_field = { false }
								className = { input_class_wood }
							/>
							<Input
								label={ props.lang_common_clay }
								placeholder={ props.lang_common_level }
								value={ clay }
								onChange={ e => this.setState({ clay: e.target.value }) }
								style={{ width: '5em' }}
								parent_field = { false }
								className = { input_class_clay }
							/>
							<Input
								label={ props.lang_common_iron }
								placeholder={ props.lang_common_level }
								value={ iron }
								onChange={ e => this.setState({ iron: e.target.value }) }
								style={{ width: '5em' }}
								parent_field = { false }
								className = { input_class_iron }
							/>
							<Input
								label={ props.lang_common_crop }
								placeholder={ props.lang_common_level }
								value={ crop }
								onChange={ e => this.setState({ crop: e.target.value }) }
								style={{ width: '5em' }}
								parent_field = { false }
								className = { input_class_crop }
							/>
						</div>

					</div>

					<div className='column'>
						<Select
							label = { props.lang_combo_box_village }
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
