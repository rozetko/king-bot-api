import { h, render, Component } from 'preact';
import axios from 'axios';
import classNames from 'classnames';
import { connect } from 'unistore/preact';
import { storeKeys } from '../language';
import { handle_response } from '../actions';
import InfoTitle from '../components/info_title';
import NatureTable from '../components/nature_table';
import { Select, Button } from '../components/form';

@connect(`notifications,${storeKeys}`, handle_response)
export default class NatureFinder extends Component {
	state = {
		village_name: '',
		village_id: 0,
		all_villages: [],
		nature_type: 0,
		find_9c: true,
		only_free: false,
		nature: [],
		error_village: false,
		error_nature_type: false,
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
			error_village: (!this.state.village_id),
			error_nature_type: (!this.state.nature_type)
		});

		if (this.state.error_village || this.state.error_nature_type)
			return;

		this.setState({ loading: true, message: '', nature: [] });

		const {
			village_id,
			nature_type
		} = this.state;

		const payload_data = {
			village_id,
			nature_type
		};

		const payload = {
			action: 'get',
			data: payload_data,
		};

		let response = await axios.post('/api/naturefinder', payload);

		const { error, data } = response.data;

		if (error) {
			this.setState({ loading: false });
			this.props.handle_response(data);
			return;
		}

		this.setState({ nature: [ ...data ], loading: false });
	}

	render(props, {
		village_id,
		nature_type,
		all_villages,
		nature,
		loading
	}) {
		const village_select_class = classNames({
			select: true,
			'is-danger': this.state.error_village,
		});

		const naturetype_select_class = classNames({
			select: true,
			'is-danger': this.state.error_nature_type,
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

		const nature_types = [
			{ value: 1, name: props.lang_nature_types[1] },
			{ value: 2, name: props.lang_nature_types[2] },
			{ value: 3, name: props.lang_nature_types[3] },
			{ value: 4, name: props.lang_nature_types[4] },
			{ value: 5, name: props.lang_nature_types[5] },
			{ value: 6, name: props.lang_nature_types[6] },
			{ value: 7, name: props.lang_nature_types[7] },
			{ value: 8, name: props.lang_nature_types[8] },
			{ value: 9, name: props.lang_nature_types[9] },
			{ value: 10, name: props.lang_nature_types[10] }
		].map(option =>
			<option
				value={ option.value }
				nature_type_name={ option.name }
			>
				{option.name}
			</option>
		);

		return (
			<div>
				<InfoTitle
					title={ props.lang_naturefinder_name }
					description={ props.lang_naturefinder_description }
				/>

				<div className='columns'>

					<div className='column'>

						<Select
							label = { props.lang_naturefinder_distance_to }
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

						<Select
							label = { props.lang_naturefinder_nature_type }
							value = { nature_type }
							onChange = { e => this.setState({
								nature_type_name: e.target[e.target.selectedIndex].attributes.nature_type_name.value,
								nature_type: e.target.value,
							}) }
							options = { nature_types }
							className = { naturetype_select_class }
							icon='fa-paw'
						/>

					</div>

				</div>

				<NatureTable
					content={ nature }
				/>

			</div>
		);
	}
}
