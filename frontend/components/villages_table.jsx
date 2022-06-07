import { h } from 'preact';
import { connect } from 'unistore/preact';

import { storeKeys } from '../language';

const rowStyle = {
	verticalAlign: 'middle',
	textAlign: 'center',
};

export default connect(storeKeys)(props => {
	const { content, remove_village } = props;
	const list = content.map(item =>
		<Village content={ item } remove_village={ remove_village } />
	);

	return (
		<div>
			<table className='table is-hoverable is-fullwidth'>
				<thead>
					<tr>
						<th style={ rowStyle }>{props.lang_table_village}</th>
						<th style={ rowStyle }>{props.lang_table_options}</th>
					</tr>
				</thead>
				<tbody>{list}</tbody>
			</table>
		</div>
	);
});

const Village = ({ content, remove_village }) => (
	<tr>
		<td style={ rowStyle }>
			{content.village_name}
		</td>
		<td style={ rowStyle }>
			<a class='has-text-black' onClick={ () => remove_village(content) }>
				<span class='icon is-medium'>
					<i className='fas fa-lg fa-trash-alt'></i>
				</span>
			</a>
		</td>
	</tr>
);
