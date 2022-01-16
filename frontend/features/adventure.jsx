import { h, render, Component } from 'preact';
import { route } from 'preact-router';
import classNames from 'classnames';
import { connect } from 'unistore/preact';
import { storeKeys } from '../language';
import { Input, Select, Button } from '../components/form';

@connect(storeKeys)
export default class Adventure extends Component {
	state = {
		type: 0,
		min_health: '',
		error_min_health: false,
	};

	componentWillMount() {
		this.setState({ ...this.props.feature });
	}

	async submit() {
		this.setState({ error_min_health: (this.state.min_health == '') });

		if (this.state.error_min_health) return;

		this.props.submit({ ...this.state });
	}

	render(props, { type, min_health }) {
		const input_class_min_health = classNames({
			input: true,
			'is-danger': this.state.error_min_health,
		});

		const adventure_types = [
			{ value: 0, name: props.lang_adventure_short },
			{ value: 1, name: props.lang_adventure_long }
		].map(option =>
			<option	value={ option.value }>{option.name}</option>
		);

		return (
			<div>
				<div className='columns'>

					<div className='column'>

						<Select
							label = { props.lang_adventure_adventure_type }
							value = { type }
							onChange = { e => this.setState({ type: e.target.value }) }
							options = { adventure_types }
							icon = 'fa-compass'
						/>

					</div>

					<div className='column'>

						<label class='label'>{props.lang_adventure_min_health}</label>
						<div class='field has-addons'>
							<p class='control'>
								<a class='button is-static is-radiusless'>
									{props.lang_common_min}
								</a>
							</p>
							<Input
								placeholder = { props.lang_adventure_health }
								value = { min_health }
								onChange = { e => this.setState({ min_health: e.target.value }) }
								className = { input_class_min_health }
								parent_field = { false }
							/>
							<p class='control'>
								<a class='button is-static is-radiusless'>%</a>
							</p>
						</div>
						<p class='help'>{props.lang_common_prov_number}</p>

					</div>

				</div>

				<div className="columns">

					<div className="column">

						<div class="buttons">
							<Button action={ props.lang_button_submit } onClick={ this.submit.bind(this) } className="is-success" icon='fa-check' />
							<Button action={ props.lang_button_cancel } onClick={ e => route('/', true) } icon='fa-times' />
						</div>

					</div>

					<div className="column">
					</div>

				</div>

			</div>
		);
	}
}
