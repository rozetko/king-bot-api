import { h } from 'preact';
import { connect } from 'unistore/preact';

import { storeKeys } from '../language';

const rowStyle = {
	verticalAlign: 'middle',
	textAlign: 'center',
};

export default connect(storeKeys)(props => {
	const { content, remove_unit, edit_unit } = props;
	const list = content.map(item =>
		<UnitType content={ item } remove_unit={ remove_unit } edit_unit={ edit_unit } />
	);

	return (
		<div>
			<table className='table is-hoverable is-fullwidth'>
				<thead>
					<tr>
						<th style={ rowStyle }>{props.lang_table_unittype}</th>
						<th style={ rowStyle }>{props.lang_table_level}</th>
						<th style={ rowStyle }>{props.lang_table_village}</th>
						<th style={ rowStyle }>{props.lang_table_options}</th>
					</tr>
				</thead>
				<tbody>{list}</tbody>
			</table>
		</div>
	);
});

const UnitType = ({ content, remove_unit, edit_unit }) => (
	<tr>
		<td style={ rowStyle }>
			{content.unit_type_name}
		</td>
		<td style={ rowStyle }>
			{content.level}
		</td>
		<td style={ rowStyle }>
			{content.village_name}
		</td>
		<td style={ rowStyle }>
			<a class='has-text-black' onClick={ () => edit_unit(content) }>
				<span class='icon is-medium'>
					<i className='fas fa-lg fa-edit'></i>
				</span>
			</a>
			<a class='has-text-black' onClick={ () => remove_unit(content) }>
				<span class='icon is-medium'>
					<i className='fas fa-lg fa-trash-alt'></i>
				</span>
			</a>
		</td>
	</tr>
);
