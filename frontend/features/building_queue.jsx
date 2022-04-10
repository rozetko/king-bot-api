import { h, render, Component } from 'preact';
import { route } from 'preact-router';
import axios from 'axios';
import classNames from 'classnames';
import arrayMove from 'array-move';
import { connect } from 'unistore/preact';
import { storeKeys } from '../language';
import { Select, Button } from '../components/form';

const headerStyle = {
	textAlign: 'center',
};

@connect(storeKeys)
export default class BuildingQueue extends Component {
	state = {
		all_villages: [],
		village_name: '',
		village_id: 0,
		buildings: [],
		resources: [],
		queue: [],
		error_village: false
	};

	componentWillMount() {
		this.setState({
			...this.props.feature,
		});
	}

	componentDidMount() {
		if (this.state.village_id) {
			var option = document.createElement('option');
			option.setAttribute('value', this.state.village_id);
			option.setAttribute('village_name', this.state.village_name);
			var select = document.createElement('select');
			select.options.add(option);
			this.set_village({
				target: select
			});
		}

		axios.get('/api/data?ident=villages').then(res => this.setState({ all_villages: res.data }));
	}

	async submit() {
		this.setState({
			error_village: (this.state.village_id == 0),
		});

		if (this.state.error_village) return;

		this.props.submit({ ...this.state });
	}

	async delete() {
		this.props.delete({ ...this.state });
	}

	async cancel() {
		route('/');
	}

	async set_village(e) {
		if (!e.target.value) return;

		this.setState({
			village_name: e.target[e.target.selectedIndex].attributes.village_name.value,
			village_id: e.target.value,
		});
		let response = await axios.get(`/api/data?ident=buildings&village_id=${this.state.village_id}`);
		let res = [];
		let bd = [];

		for (let item of response.data) {
			if (Number(item.buildingType) > 4) {
				bd.push(item);
				continue;
			}

			res.push(item);
		}

		res = res.sort((x1, x2) => Number(x1.buildingType) - Number(x2.buildingType));
		bd = bd.sort((x1, x2) => Number(x1.buildingType) - Number(x2.buildingType));

		this.setState({
			buildings: bd,
			resources: res,
		});
	}

	upgrade(building) {
		const { buildingType, locationId } = building;
		const queue_item = {
			type: buildingType,
			location: locationId
		};

		this.setState({ queue: [ ...this.state.queue, queue_item ] });
	}

	delete_item(building) {
		const queues = this.state.queue;
		var idx = queues.indexOf(building);
		if (idx != -1) {
			queues.splice(idx, 1); // The second parameter is the number of elements to remove.
		}

		this.setState({ queue: [ ...queues ] });
	}

	move_up(building) {
		const queues = this.state.queue;
		var idx = queues.indexOf(building);
		if (idx != -1) {
			arrayMove.mut(queues, idx, idx - 1); // The second parameter is the number of elements to remove.
		}

		this.setState({ queue: [ ...queues ] });
	}

	move_down(building) {
		const queues = this.state.queue;
		var idx = queues.indexOf(building);
		if (idx != -1) {
			arrayMove.mut(queues, idx, idx + 1); // The second parameter is the number of elements to remove.
		}

		this.setState({ queue: [ ...queues ] });
	}

	render(props, { all_villages, village_id, buildings, resources, queue }) {
		const village_select_class = classNames({
			select: true,
			'is-danger': this.state.error_village,
		});

		const resource_options = resources.map(building =>
			<tr>
				<td style={ headerStyle }>{ building.locationId }</td>
				<td>{ props.lang_building_types[building.buildingType] }</td>
				<td style={ headerStyle }>{ building.lvl }</td>
				<td style={ headerStyle }>
					<a class='has-text-black' onClick={ () => this.upgrade(building) }>
						<span class='icon is-medium'>
							<i class='far fa-lg fa-arrow-alt-circle-up'></i>
						</span>
					</a>
				</td>
			</tr>
		);

		const buildings_options = buildings.map(building =>
			<tr>
				<td style={ headerStyle }>{ building.locationId }</td>
				<td>{ props.lang_building_types[building.buildingType] }</td>
				<td style={ headerStyle }>{ building.lvl }</td>
				<td style={ headerStyle }>
					<a class='has-text-black' onClick={ () => this.upgrade(building) }>
						<span class='icon is-medium'>
							<i class='far fa-lg fa-arrow-alt-circle-up'></i>
						</span>
					</a>
				</td>
			</tr>
		);

		const queue_options = queue.map((building, index) =>
			<tr>
				<td style={ headerStyle }>{ index + 1 }</td>
				<td style={ headerStyle }>{ building.location }</td>
				<td>{ props.lang_building_types[building.type] }</td>
				<td style={ headerStyle }>
					<a class='has-text-black' onClick={ () => this.move_up(building) }>
						<span class='icon is-medium'>
							<i class='fas fa-lg fa-long-arrow-alt-up'></i>
						</span>
					</a>
				</td>
				<td style={ headerStyle }>
					<a class='has-text-black' onClick={ () => this.move_down(building) }>
						<span class='icon is-medium'>
							<i class='fas fa-lg fa-long-arrow-alt-down'></i>
						</span>
					</a>
				</td>
				<td style={ headerStyle }>
					<a class='has-text-black' onClick={ () => this.delete_item(building) }>
						<span class='icon is-medium'>
							<i class='far fa-lg fa-trash-alt'></i>
						</span>
					</a>
				</td>
			</tr>
		);

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

						<label class="label">{ props.lang_combo_box_village }</label>
						<div class='field is-grouped'>
							<Select
								value = { village_id }
								onChange={ this.set_village.bind(this) }
								options = { villages }
								className = { village_select_class }
								parent_field = { false }
								icon = 'fa-home'
							/>
							<p class="control">
								<Button action={ props.lang_button_submit } onClick={ this.submit.bind(this) } className="is-success" icon='fa-check' />
							</p>
							<p class="control">
								<Button action={ props.lang_button_delete } onClick={ this.delete.bind(this) } className="is-danger" icon='fa-trash-alt' />
							</p>
						</div>

					</div>

				</div>

				<div className='columns'>

					<div className='column' align='center'>
						<strong>{props.lang_queue_res_fields}</strong>
						<table className="table is-striped">
							<thead>
								<tr>
									<td style={ headerStyle }><strong>{props.lang_table_id}</strong></td>
									<td><strong>{props.lang_table_name}</strong></td>
									<td style={ headerStyle }><strong>{props.lang_table_lvl}</strong></td>
									<td style={ headerStyle }><strong></strong></td>
								</tr>
							</thead>
							<tbody>
								{resource_options}
							</tbody>
						</table>
					</div>

					<div className='column' align='center'>
						<strong>{props.lang_queue_buildings}</strong>
						<table className='table is-striped'>
							<thead>
								<tr>
									<td style={ headerStyle }><strong>{props.lang_table_id}</strong></td>
									<td><strong>{props.lang_table_name}</strong></td>
									<td style={ headerStyle }><strong>{props.lang_table_lvl}</strong></td>
									<td style={ headerStyle }><strong></strong></td>
								</tr>
							</thead>
							<tbody>
								{buildings_options}
							</tbody>
						</table>
					</div>

					<div className='column' align='center'>
						<strong>{props.lang_queue_queue}</strong>
						<table className='table is-striped'>
							<thead>
								<tr>
									<td style={ headerStyle }><strong>{props.lang_table_pos}</strong></td>
									<td style={ headerStyle }><strong>{props.lang_table_id}</strong></td>
									<td><strong>{props.lang_table_name}</strong></td>
									<td style={ headerStyle }><strong></strong></td>
									<td style={ headerStyle }><strong></strong></td>
									<td style={ headerStyle }><strong></strong></td>
								</tr>
							</thead>
							<tbody>
								{queue_options}
							</tbody>
						</table>
					</div>

				</div>

			</div>
		);
	}
}
