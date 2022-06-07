import { h, render, Component } from 'preact';
import { route } from 'preact-router';
import axios from 'axios';
import classNames from 'classnames';
import { connect } from 'unistore/preact';
import { storeKeys } from '../language';
import VillagesTable from '../components/villages_table';
import { DoubleInput, Select, Button } from '../components/form';

@connect(storeKeys)
export default class StolenGoods extends Component {
	state = {
		all_villages: [],
		village_name: '',
		village_id: '',
		villages: [],
		interval_min: 0,
		interval_max: 0,
		error_villages: false,
		error_village: false,
		error_interval_min: false,
		error_interval_max: false
	};

	componentWillMount() {
		this.setState({
			...this.props.feature
		});

		axios.get('/api/data?ident=villages').then(res => this.setState({ all_villages: res.data }));
	}

	add_village = async e => {
		const { villages, village_name, village_id } = this.state;

		this.setState({
			error_village: (this.state.village_id == 0),
			error_interval_min: (this.state.interval_min == 0),
			error_interval_max: (this.state.interval_max == 0)
		});

		if (this.state.error_village)
			return;

		const selected_item = {
			village_id,
			village_name
		};

		var is_already = false;
		villages.forEach((village) => {
			if (village.village_id != village_id)
				return;
			is_already = true;
		});
		if (is_already)
			return; // village already added
		villages.push(selected_item);
		this.setState({ villages, error_villages: false });
	};

	remove_village = async e => {
		const { villages } = this.state;
		villages.splice(villages.indexOf(e), 1);
		this.setState({ villages });
	};

	async submit() {
		this.setState({
			error_villages: this.state.villages.length < 1,
			error_village: (this.state.village_id == 0),
			error_interval_min: (this.state.interval_min == 0),
			error_interval_max: (this.state.interval_max == 0)
		});

		if (this.state.error_villages || this.state.error_villages &&
			(this.state.error_village && this.state.error_interval_min || this.state.error_interval_max))
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
		var {
			all_villages, village_id, villages,
			interval_min, interval_max } = this.state;

		const village_select_class = classNames({
			select: true,
			'is-danger': this.state.error_village || this.state.error_villages,
		});

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

		const village_list = all_villages.map(village =>
			<option
				value={ village.data.villageId }
				village_name={ village.data.name }
				disabled={ village.data.belongsToKing == 0 }
			>
				({village.data.coordinates.x}|{village.data.coordinates.y}) {village.data.name}
			</option>
		);

		return (
			<div>
				<div className="columns">

					<div className="column">

						<label class='label'>{ props.lang_combo_box_village }</label>
						<Select
							label = { props.lang_combo_box_village }
							value = { village_id }
							onChange = { e => {
								this.setState({
									village_name: e.target[e.target.selectedIndex].attributes.village_name.value,
									village_id: e.target.value,
								});
							} }
							options = { village_list }
							className = { village_select_class }
							button = { <Button
								action = { props.lang_common_add }
								className = 'is-success'
								onClick = { this.add_village.bind(this) }
								icon = { 'fa-plus' } /> }
							icon='fa-home'
						/>

						<DoubleInput
							label = { props.lang_common_interval }
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

				</div>

				<div className="columns">

					<div className="column">

						<VillagesTable
							content={ villages }
							remove_village={ this.remove_village.bind(this) }
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
