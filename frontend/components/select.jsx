import { h } from 'preact';

export default ({
	label, value, onChange,
	className, options, width,
	style = { width }, icon, button,
	parent_style, parent_field = true
}) => {

	const select_node =
		<p class={ 'control' + (icon ? ' has-icons-left' : '') }>
			<div class={ className && className.includes('select') ? className : 'select ' + className }>
				<select
					class = 'is-radiusless'
					value={ value }
					onChange={ onChange }
					style = { style }
				>
					{ options }
				</select>
			</div>
			{icon && (<span class="icon is-left"><i class={ 'fas ' + icon }></i></span>)}
		</p>;

	const field_node =
		<div class={ 'field' + (button ? ' has-addons' : '') }{ ...parent_style ? { style: parent_style } : {} }>
			{!button && label && (<label class="label">{ label }</label>)}
			{select_node}
			{button && (<p class='control'>{ button }</p>)}
		</div>;

	return parent_field
		? field_node
		: select_node;
};