import { h, render, Component } from 'preact';
import axios from 'axios';
import classNames from 'classnames';
import { connect } from 'unistore/preact';
import { storeKeys } from '../language';

@connect(storeKeys)
export default class Units extends Component {
	state = {
		own_tribe: 0,
		unit_types: []
	};

	componentDidMount() {
		axios.get('/api/data?ident=player_tribe').then(res => this.setState({ own_tribe: Number(res.data) }));
		axios.get('/api/data?ident=unit_types').then(res => this.setState({ unit_types: res.data }));
	}

	render(props, { own_tribe, unit_types }) {
		const {
			units, error_units, clicked, changed,
			t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11
		} = props;

		const row_style = {
			verticalAlign: 'middle',
			textAlign: 'center'
		};

		const anchor_style = {
			fontWeight: 'bold'
		};

		const input_style = {
			width: '3.6em',
			height: '1.5em',
			textAlign: 'center'
		};

		const input_class_unit = classNames({
			input: true,
			'is-radiusless': true,
			'is-danger': error_units
		});

		let tribe_class;
		switch (own_tribe) {
			case 1: tribe_class = 'unitSmall roman unitType'; break;
			case 2: tribe_class = 'unitSmall teuton unitType'; break;
			case 3: tribe_class = 'unitSmall gaul unitType'; break;
		}

		return (
			<table className="table is-narrow is-striped">
				{own_tribe != 0 && unit_types.length != 0 && (
					<thead>
						<tr>
							<th style={ row_style }> <i class={ tribe_class + 1 } title={ unit_types[own_tribe][1].name }></i> </th>
							<th style={ row_style }> <i class={ tribe_class + 2 } title={ unit_types[own_tribe][2].name }></i> </th>
							<th style={ row_style }> <i class={ tribe_class + 3 } title={ unit_types[own_tribe][3].name }></i> </th>
							<th style={ row_style }> <i class={ tribe_class + 4 } title={ unit_types[own_tribe][4].name }></i> </th>
							<th style={ row_style }> <i class={ tribe_class + 5 } title={ unit_types[own_tribe][5].name }></i> </th>
							<th style={ row_style }> <i class={ tribe_class + 6 } title={ unit_types[own_tribe][6].name }></i> </th>
							<th style={ row_style }> <i class={ tribe_class + 7 } title={ unit_types[own_tribe][7].name }></i> </th>
							<th style={ row_style }> <i class={ tribe_class + 8 } title={ unit_types[own_tribe][8].name }></i> </th>
							<th style={ row_style }> <i class={ tribe_class + 9 } title={ unit_types[own_tribe][9].name }></i> </th>
							<th style={ row_style }> <i class={ tribe_class + 10 } title={ unit_types[own_tribe][10].name }></i> </th>
							<th style={ row_style }> <i class={ 'unitSmall hero_illu' } title={ 'Hero' }></i> </th>
						</tr>
					</thead>
				)}
				<tbody>
					<tr>
						<td style={ row_style }>
							{ units[1] ? <a
								class='has-text-success'
								id='t1'
								style={ anchor_style }
								onClick={ clicked }
							>{ units[1] }</a> : '-' }
						</td>
						<td style={ row_style }>
							{ units[2] ? <a
								class='has-text-success'
								id='t2'
								style={ anchor_style }
								onClick={ clicked }
							>{ units[2] }</a> : '-'}
						</td>
						<td style={ row_style }>
							{ units[3] ? <a
								class='has-text-success'
								id='t3'
								style={ anchor_style }
								onClick={ clicked }
							>{ units[3] }</a> : '-'}
						</td>
						<td style={ row_style }>
							{ units[4] ? <a
								class='has-text-success'
								id='t4'
								style={ anchor_style }
								onClick={ clicked }
							>{ units[4] }</a> : '-'}
						</td>
						<td style={ row_style }>
							{ units[5] ? <a
								class='has-text-success'
								id='t5'
								style={ anchor_style }
								onClick={ clicked }
							>{ units[5] }</a> : '-'}
						</td>
						<td style={ row_style }>
							{ units[6] ? <a
								class='has-text-success'
								id='t6'
								style={ anchor_style }
								onClick={ clicked }
							>{ units[6] }</a> : '-'}
						</td>
						<td style={ row_style }>
							{ units[7] ? <a
								class='has-text-success'
								id='t7'
								style={ anchor_style }
								onClick={ clicked }
							>{ units[7] }</a> : '-'}
						</td>
						<td style={ row_style }>
							{ units[8] ? <a
								class='has-text-success'
								id='t8'
								style={ anchor_style }
								onClick={ clicked }
							>{ units[8] }</a> : '-'}
						</td>
						<td style={ row_style }>
							{ units[9] ? <a
								class='has-text-success'
								id='t9'
								style={ anchor_style }
								onClick={ clicked }
							>{ units[9] }</a> : '-'}
						</td>
						<td style={ row_style }>
							{ units[10] ? <a
								class='has-text-success'
								id='t10'
								style={ anchor_style }
								onClick={ clicked }
							>{ units[10] }</a> : '-'}
						</td>
						<td style={ row_style }>
							{ units[11] ? <a
								class='has-text-success'
								id='t11'
								style={ anchor_style }
								onClick={ clicked }
							>{ units[11] }</a> : '-'}
						</td>
					</tr>

					<tr>
						<td style={ row_style }>
							<input
								style = { input_style }
								class = { input_class_unit }
								name = 't1'
								type = "text"
								value={ t1 == 0 ? '' : t1 }
								onChange={ changed }
							/>
						</td>
						<td style={ row_style }>
							<input
								style = { input_style }
								class = { input_class_unit }
								name = 't2'
								type = "text"
								value={ t2 == 0 ? '' : t2 }
								onChange={ changed }
							/>
						</td>
						<td style={ row_style }>
							<input
								style = { input_style }
								class = { input_class_unit }
								name = 't3'
								type = "text"
								value={ t3 == 0 ? '' : t3 }
								onChange={ changed }
							/>
						</td>
						<td style={ row_style }>
							<input
								style = { input_style }
								class = { input_class_unit }
								name = 't4'
								type = "text"
								value={ t4 == 0 ? '' : t4 }
								onChange={ changed }
							/>
						</td>
						<td style={ row_style }>
							<input
								style = { input_style }
								class = { input_class_unit }
								name = 't5'
								type = "text"
								value={ t5 == 0 ? '' : t5 }
								onChange={ changed }
							/>
						</td>
						<td style={ row_style }>
							<input
								style = { input_style }
								class = { input_class_unit }
								name = 't6'
								type = "text"
								value={ t6 == 0 ? '' : t6 }
								onChange={ changed }
							/>
						</td>
						<td style={ row_style }>
							<input
								style = { input_style }
								class = { input_class_unit }
								name = 't7'
								type = "text"
								value={ t7 == 0 ? '' : t7 }
								onChange={ changed }
							/>
						</td>
						<td style={ row_style }>
							<input
								style = { input_style }
								class = { input_class_unit }
								name = 't8'
								type = "text"
								value={ t8 == 0 ? '' : t8 }
								onChange={ changed }
							/>
						</td>
						<td style={ row_style }>
							<input
								style = { input_style }
								class = { input_class_unit }
								name = 't9'
								type = "text"
								value={ t9 == 0 ? '' : t9 }
								onChange={ changed }
							/>
						</td>
						<td style={ row_style }>
							<input
								style = { input_style }
								class = { input_class_unit }
								name = 't10'
								type = "text"
								value={ t10 == 0 ? '' : t10 }
								onChange={ changed }
							/>
						</td>
						<td style={ row_style }>
							<input
								name = 't11'
								type="checkbox"
								value={ t11 }
								onChange={ changed }
								checked={ t11 > 0 }
							/>
						</td>
					</tr>
				</tbody>
			</table>
		);
	}
}
