import { h, render, Component } from 'preact';
import { connect } from 'unistore/preact';
import classNames from 'classnames';

import lang, { storeKeys } from '../language';

const rowStyle = {
	verticalAlign: 'middle',
	textAlign: 'left',
	whiteSpace: 'nowrap'
};

export default connect(storeKeys)(props => {
	const { content, clicked } = props;
	const list = content.map(item => <Inactive content={ item } clicked={ clicked } />);

	return (
		<div>
			<table className='table is-hoverable is-fullwidth'>
				<thead>
					<tr>
						<th style={ rowStyle }>{props.lang_table_distance}</th>
						<th style={ rowStyle }>{props.lang_table_evolution}</th>
						<th style={ rowStyle }>{props.lang_table_coordinates}</th>
						<th style={ rowStyle }>{props.lang_table_population}</th>
						<th style={ rowStyle }>{props.lang_table_village}</th>
						<th style={ rowStyle }>{props.lang_table_player}</th>
						<th style={ rowStyle }>{props.lang_table_tribe}</th>
						<th style={ rowStyle }>{props.lang_table_villages}</th>
						<th style={ rowStyle }>{props.lang_table_kingdom}</th>
						<th />
					</tr>
				</thead>
				<tbody>{list}</tbody>
			</table>
		</div>
	);
});

class Inactive extends Component {
	state = {
		toggled: false,
	};

	render({ content, clicked }, { toggled }) {
		const {
			distance, evolution, x, y, pop, pop_g,
			name, capital, name_player, tribe,
			villages, kingdom_tag
		} = content;

		const coordinates = `(${x}|${y})`;

		let tribe_name;
		switch (tribe) {
			case '1': tribe_name = lang.translate('lang_tribe_roman'); break;
			case '2': tribe_name = lang.translate('lang_tribe_teuton'); break;
			case '3': tribe_name = lang.translate('lang_tribe_gaul'); break;
		}

		const icon = classNames({
			'fas': true,
			'fa-lg': true,
			'fa-plus': !toggled,
			'fa-minus': toggled,
		});

		return (
			<tr>
				<td style={ rowStyle }>
					{ Number(distance).toFixed(1) }
				</td>
				<td style={ rowStyle }>
					{ evolution }
				</td>
				<td style={ rowStyle }>
					{ coordinates }
				</td>
				<td style={ rowStyle }>
					{ pop }/{ pop_g }
				</td>
				<td style={ rowStyle }>
					{ capital == '1' &&
						<span class="icon-text">
							<span class="icon">
								<i class="fas fa-home"></i>
							</span>
							<span>{name}</span>
						</span>
					}
					{ capital != '1' && name }
				</td>
				<td style={ rowStyle }>
					{ name_player }
				</td>
				<td style={ rowStyle }>
					{ tribe_name }
				</td>
				<td style={ rowStyle }>
					{ villages }
				</td>
				<td style={ rowStyle }>
					{ kingdom_tag }
				</td>
				<td style={ rowStyle }>
					<a class="has-text-black" onClick={ async e => {
						if (await clicked(content)) this.setState({ toggled: !toggled });
					} }>
						<span class='icon is-medium'>
							<i class={ icon }></i>
						</span>
					</a>
				</td>
			</tr>
		);
	}
}
