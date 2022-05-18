import { h, render, Component } from 'preact';
import axios from 'axios';
import classNames from 'classnames';
import { connect } from 'unistore/preact';
import { storeKeys } from '../language';
import { handle_response } from '../actions';
import ResourceTable from '../components/resource_table';
import InfoTitle from '../components/info_title';
import { Select, Button } from '../components/form';

@connect(`notifications,${storeKeys}`, handle_response)
export default class ResourceFinder extends Component {
	state = {
		village_name: '',
		village_id: 0,
		all_villages: [],
		find_wood: true,
		find_clay: true,
		find_iron: true,
		only_free: false,
		resources: [],
		error_village: false,
		loading: false,
		message: '',
	};

	componentDidMount() {
		axios.get('/api/data?ident=villages').then(res => {
			this.setState({
				all_villages: res.data,
				village_id: res.data[0].villageId,
				village_name: res.data[0].data.name,
			});
		});
	}

	async search() {
		if (this.state.loading) return;

		this.setState({
			error_village: (!this.state.village_id)
		});

		if (this.state.error_village) return;

		this.setState({ loading: true, message: '', resources: [] });

		const {
			village_id,
			find_wood,
			find_clay,
			find_iron,
			only_free
		} = this.state;

		const payload_data = {
			village_id,
			find_wood,
			find_clay,
			find_iron,
			only_free
		};

		const payload = {
			action: 'get',
			data: payload_data,
		};

		let response = await axios.post('/api/resourcefinder', payload);

		const { error, data } = response.data;

		if (error) {
			this.setState({ loading: false });
			this.props.handle_response(data);
			return;
		}

		this.setState({ resources: [ ...data ], loading: false });
	}

	set_res_type = async e =>  {
		let { find_wood, find_clay, find_iron } = this.state;
		switch (e.target.name) {
			case 'find_wood':
				find_wood = e.target.checked;
				if (!find_clay && !find_iron)
					find_clay = true;
				break;

			case 'find_clay':
				find_clay = e.target.checked;
				if (!find_wood && !find_iron)
					find_wood = true;
				break;

			case 'find_iron':
				find_iron = e.target.checked;
				if (!find_wood && !find_clay)
					find_wood = true;
				break;
		}
		this.setState({ find_wood, find_clay, find_iron });
	};

	render(props, {
		village_id,
		find_wood,
		find_clay,
		find_iron,
		all_villages,
		resources, loading
	}) {
		const village_select_class = classNames({
			select: true,
			'is-danger': this.state.error_village,
		});

		const search_button = classNames({
			button: true,
			'is-success': true,
			'is-radiusless': true,
			'is-loading': loading,
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
				<InfoTitle
					title={ props.lang_resourcefinder_name }
					description={ props.lang_resourcefinder_description }
				/>

				<div className='columns'>

					<div className='column'>

						<Select
							label = { props.lang_resourcefinder_distance_to }
							value = { village_id }
							onChange = { e => this.setState({
								village_name: e.target[e.target.selectedIndex].attributes.village_name.value,
								village_id: e.target.value,
							}) }
							options = { villages }
							className = { village_select_class }
							icon='fa-home'
						/>

						<Button
							action = { props.lang_button_search }
							className = { search_button }
							onClick = { this.search.bind(this) }
							style = {{ marginRight: '1rem' }}
							icon = 'fa-search'
						/>

					</div>

					<div className='column'>

						<div class="field">
							<label class="label">{ props.lang_resourcefinder_type }</label>
							<p class='control'>
								<label class='radio is-radiusless'>
									<input
										type = "checkbox"
										name = "find_wood"
										onChange = { this.set_res_type }
										checked = { find_wood }
									/> { props.lang_resourcefinder_wood }
								</label>
								<label class='radio is-radiusless'>
									<input
										type = "checkbox"
										name = "find_clay"
										onChange = { this.set_res_type }
										checked = { find_clay }
									/> { props.lang_resourcefinder_clay }
								</label>
								<label class='radio is-radiusless'>
									<input
										type = "checkbox"
										name = "find_iron"
										onChange = { this.set_res_type }
										checked = { find_iron }
									/> { props.lang_resourcefinder_iron }
								</label>
							</p>
						</div>

						<div class="field">
							<p class='control'>
								<label class="checkbox is-radiusless">
									<input
										type = "checkbox"
										name = "only_free"
										onChange = { e => this.setState({ only_free: e.target.checked }) }
									/> { props.lang_resourcefinder_only_free }
								</label>
							</p>
						</div>

					</div>

				</div>

				<ResourceTable
					content={ resources }
				/>

			</div>
		);
	}
}
