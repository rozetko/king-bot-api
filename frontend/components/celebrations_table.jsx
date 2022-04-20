import { h } from 'preact';
import { connect } from 'unistore/preact';

import { storeKeys } from '../language';

const rowStyle = {
	verticalAlign: 'middle',
	textAlign: 'center',
};

export default connect(storeKeys)(props => {
	const { content, remove_celebration, edit_celebration } = props;
	const list = content.map(item =>
		<Celebration content={ item } remove_celebration={ remove_celebration } edit_celebration={ edit_celebration } props={ props } />
	);

	return (
		<div>
			<table className='table is-hoverable is-fullwidth'>
				<thead>
					<tr>
						<th style={ rowStyle }>{props.lang_table_village}</th>
						<th style={ rowStyle }>{props.lang_table_celebrationtype}</th>
						<th style={ rowStyle }>{props.lang_table_options}</th>
					</tr>
				</thead>
				<tbody>{list}</tbody>
			</table>
		</div>
	);
});

const Celebration = ({ content, remove_celebration, edit_celebration, props }) => (
	<tr>
		<td style={ rowStyle }>
			{content.village_name}
		</td>
		<td style={ rowStyle }>
			{content.celebration_type_name}
		</td>
		<td style={ rowStyle }>
			<a class='has-text-black' onClick={ () => edit_celebration(content) }>
				<span class='icon is-medium'>
					<i className='fas fa-lg fa-edit'></i>
				</span>
			</a>
			<a class='has-text-black' onClick={ () => remove_celebration(content) }>
				<span class='icon is-medium'>
					<i className='fas fa-lg fa-trash-alt'></i>
				</span>
			</a>
		</td>
	</tr>
);
