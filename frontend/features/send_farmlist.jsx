import { h, render, Component } from 'preact';
import { route } from 'preact-router';
import axios from 'axios';
import classNames from 'classnames';
import { connect } from 'unistore/preact';
import { storeKeys } from '../language';
import FarmlistTable from '../components/farmlist_table';
import { DoubleInput, Select, Button } from '../components/form';

@connect(storeKeys)
export default class SendFarmlist extends Component {
	state = {
		farmlist: '',
		village_name: '',
		village_id: 0,
		farmlists: [],
		losses_farmlist: '',
		interval_min: '',
		interval_max: '',
		all_farmlists: [],
		all_villages: [],
		error_farmlist: false,
		error_village: false,
		error_interval_min: false,
		error_interval_max: false
	};

	componentWillMount() {
		this.setState({ ...this.props.feature });

		axios.get('/api/data?ident=villages').then(res => this.setState({ all_villages: res.data }));
		axios.get('/api/data?ident=farmlists').then(res => this.setState({ all_farmlists: res.data }));
	}

	async add_farmlist() {
		const { farmlist, village_name, village_id, farmlists } = this.state;

		this.setState({
			error_farmlist: (this.state.farmlist == ''),
			error_village: (this.state.village_id == 0)
		});

		if (this.state.error_village || this.state.error_farmlist) return;

		const selected_farmlist = {
			farmlist: farmlist,
			village_name,
			village_id,
		};

		if (farmlists.indexOf(selected_farmlist) > -1)
			return; // farmlist already added
		farmlists.push(selected_farmlist);
		this.setState({ farmlists });
	}

	remove_farmlist(e) {
		const { farmlists } = this.state;
		farmlists.splice(farmlists.indexOf(e), 1);
		this.setState({ farmlists });
	}

	submit() {
		this.setState({
			error_farmlist: (this.state.farmlists.length < 1),
			error_village: (this.state.village_id == 0),
			error_interval_min: (this.state.interval_min == 0),
			error_interval_max: (this.state.interval_max == 0)
		});

		if (this.state.error_farmlist || this.state.error_village ||
			this.state.error_interval_min || this.state.error_interval_max)
			return;

		this.props.submit({ ...this.state });
	}

	delete() {
		this.props.delete({ ...this.state });
	}

	cancel() {
		route('/');
	}

	render(props) {
		const {
			all_farmlists, all_villages,
			farmlist, village_id,
			farmlists, losses_farmlist,
			interval_min, interval_max } = this.state;

		const village_select_class = classNames({
			select: true,
			'is-danger': this.state.error_village,
		});

		const farmlist_select_class = classNames({
			select: true,
			'is-danger': this.state.error_farmlist,
		});

		const input_class_min = classNames({
			input: true,
			'is-radiusless': true,
			'is-danger': this.state.error_interval_min
		});

		const input_class_max = classNames({
			input: true,
			'is-radiusless': true,
			'is-danger': this.state.error_interval_min,
		});

		const villages = all_villages.map(village =>
			<option
				value={ village.data.villageId }
				village_name={ village.data.name }
			>
				({village.data.coordinates.x}|{village.data.coordinates.y}) {village.data.name}
			</option>
		);

		const farmlist_opt = all_farmlists.map(farmlist =>
			<option value={ farmlist.data.listName }>{farmlist.data.listName}</option>
		);

		return (
			<div>
				<div className='columns'>

					<div className='column'>

						<label class='label'>{props.lang_combo_box_select_farmlist}</label>
						<Select
							value = { farmlist }
							onChange = { e => this.setState({ farmlist: e.target.value }) }
							options = { farmlist_opt }
							className = { farmlist_select_class }
							button = { <Button action = { props.lang_farmlist_add } className = 'is-success' onClick = { this.add_farmlist.bind(this) } icon = 'fa-plus' /> }
							icon = 'fa-cow'
						/>

						<DoubleInput
							label = { props.lang_farmlist_interval }
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

					<div className='column'>

						<Select
							label = { props.lang_combo_box_select_village }
							value = { village_id }
							onChange = { e => this.setState({
								village_name: e.target[e.target.selectedIndex].attributes.village_name.value,
								village_id: e.target.value,
							}) }
							options = { villages }
							className = { village_select_class }
							icon='fa-home'
						/>

						<Select
							label = { props.lang_farmlist_losses }
							value = { losses_farmlist }
							onChange = { e => this.setState({ losses_farmlist: e.target.value }) }
							options = { farmlist_opt }
							icon='fa-skull'
						/>

					</div>

				</div>

				<div className="columns">

					<div className="column">

						<FarmlistTable
							content={ farmlists }
							clicked={ this.remove_farmlist.bind(this) }
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
