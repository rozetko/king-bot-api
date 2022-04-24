import { h } from 'preact';
import { Input } from '../components/form';

export default ({
	label,
	placeholder1, placeholder2,
	value1, value2,
	onChange2, onChange1,
	class1,
	class2,
	type, type1, type2,
	width = '7.5em',
	style = { width }, style1, style2,
	icon, icon1, icon2,
	parent_style, button, help
}) => (
	<div class="field"{ ...parent_style ? { style: parent_style } : {} }>
		{ label && (<label class="label">{ label }</label>) }
		<div class="field is-grouped">
			<Input
				className = { class1 }
				type = { type1 ? type1 : type }
				placeholder={ placeholder1 }
				value={ value1 }
				onChange={ onChange1 }
				style={ style1 ? style1 : style }
				parent_field = { false }
				icon = { icon1 ? icon1 : icon }
			/>
			<Input
				className = { class2 }
				type = { type2 ? type2 : type }
				placeholder={ placeholder2 }
				value={ value2 }
				onChange={ onChange2 }
				style={ style2 ? style2 : style }
				parent_field = { false }
				icon = { icon2 ? icon2 : icon }
			/>
			{ button && (<p class='control'>{ button }</p>) }
		</div>
		{ help && (<p class='control' style={{ marginTop: '-0.38em' }}>{ help }</p>) }
	</div>
);
